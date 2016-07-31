import { Plugin, Command } from 'plugin';

import youtubedl from 'youtube-dl';
import request from 'request';

import BufferStream from 'buffer-stream';

export default class extends Plugin {

	init() {
		this.addCommand('play', Play);
		this.addCommand('skip', Skip);

		// Set the constants.
		this.MAX_QUEUE = 20; // Maximum queue size.
		this.INITIAL_BUFFER = 262144; // Initial buffer pass condition (256KB).
		this.MAX_BUFFER = 1048576; // Maximum buffer size (1MB).

		// Set the member variables.
		this.queues = {}; // All queues.
		this.playing = {}; // All servers that are playing.
	}

	/*
	 * Common authorization requirements.
	 */
	authorize(command, msg) {
		const connection = command.getVoiceConnection(msg.server);
		const allowed =
			connection != null && // Must be connected to a voice channel.
			msg.author.voiceChannel != null && // User must be connected to a voice channel.
			connection.voiceChannel.equals(msg.author.voiceChannel); // Must be connected to the same voice channel.
		return allowed;
	}

	/*
	 * Add a video to the queue.
	 *
	 * @param command The command.
	 * @param channel A channel.
	 * @param vid The URL and title of the video.
	 * @param queue The queue to add to.
	 */
	addToQueue(command, channel, vid, queue) {
		// Add to the queue.
		queue.push(vid);

		// Start playing if not currently playing and the queue size is 1.
		if (!(channel.server.id in this.playing) && queue.length == 1) this.playQueue(command, channel, queue);
	}

	/*
	 * Play the first song in the queue.
	 *
	 * @param command The command.
	 * @param channel A channel.
	 * @param queue The queue to play from.
	 */
	playQueue(command, channel, queue) {
		// Get the voice connection.
		const connection = command.getVoiceConnection(channel.server);

		// If the queue is empty or the connection doesn't exist, delete the queue.
		if (queue.length == 0 || connection == null) {
			// Not playing anymore.
			this.clearQueue(channel.server);

			// Send a message if still connected to the voice channel.
			if (connection != null) command.client.sendMessage(channel, 'I\'m all out of songs to play!');
			return;
		}

		// Get the first video from the queue.
		const vid = queue.shift();

		// Set the server to playing.
		this.playing[channel.server.id] = true;

		// Send a message saying what is being played.
		command.client.sendMessage(channel, 'I\'m now playing `' + vid.title + '`.');

		console.log(vid);

		// Pipe the video into a buffer stream.
		const buffer = new BufferStream(this.INITIAL_BUFFER, this.MAX_BUFFER);
		request.get(vid.url).pipe(buffer);

		// Start streaming.
		connection.playRawStream(buffer).then((intent) => {
			// Catch EPIPE in the connection.
			connection.streamProc.stdin.on('error', () => { });

			// Catch all errors.
			intent.on('error', (err) => { });

			// Catch the end event.
			intent.on('end', () => {
				setTimeout(() => {
					// Play the next song in the queue.
					this.playQueue(command, channel, queue);
				}, 2000); // But first wait 2 seconds.
			});
		}).catch(() => {
			command.errorOccurred();
		});
	}

	/*
	 * Clear a queue.
	 *
	 * @param server The server whose queue to clear.
	 */
	clearQueue(server) {
		if (server.id in this.queues) this.queues[server.id].length = 0;
		delete this.queues[server.id];
		delete this.playing[server.id];
	}

}

class Play extends Command {

	get usage() { return '<video-url>|<search>'; }
	get description() { return 'play audio from a video (YouTube, Vimeo, Youku, etc.)'; }

	*authorize(msg, suffix) {
		return this.plugin.authorize(this, msg);
	}

	*process(msg, suffix) {
		// Get the queue.
		if (!(msg.server.id in this.plugin.queues)) {
			this.plugin.queues[msg.server.id] = [];
		}
		const queue = this.plugin.queues[msg.server.id];

		// Check the queue size.
		if (queue.length >= this.plugin.MAX_QUEUE) {
			return this.client.reply(msg, 'Overload! I can\'t queue that many songs. Feed me more RAM.');
		}

		// Validate the argument.
		if (suffix.length == 0) {
			return this.client.reply(msg, 'Give me a video, dumbass.');
		}

		// Send a confirmation message.
		const response = yield this.client.sendMessage(msg, 'Okay, I\'m looking for that video.');

		// If the suffix doesn't start with http, assume it's a search.
		if (!suffix.startsWith('http')) {
			suffix = 'gvsearch1:' + suffix;
		}

		// Get the video info.
		youtubedl.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
			if (err || info.format_id.startsWith('0')) { // Unknown format is invalid.
				return this.client.updateMessage(response, msg.author + ', that\'s not a real video, stupid.');
			}

			// Send a message confirming the video's been added.
			const title = info.title.replace(/`/g, '\\`');
			this.client.updateMessage(response, 'I\'ve queued up `' + title + '`.');

			// Add the video to queue.
			this.plugin.addToQueue(this, msg.channel, info, queue);
		});
	}

}

class Skip extends Command {

	get usage() { return '[number|all]'; }
	get description() { return 'skip 1 or more songs'; }

	*authorize(msg, suffix) {
		return this.plugin.authorize(this, msg);
	}

	*process(msg, suffix) {
		// Get the voice connection.
		const connection = this.getVoiceConnection(msg.server);

		// Check the number.
		if (suffix == 'all') {
			// Skip everthing.
			this.plugin.clearQueue(msg.server);
		} else if (suffix == '') {
			// Just skip one, so do nothing here.
		} else {
			// Check if the number is valid and positive.
			let number;
			if (isNaN(suffix) || (number = parseInt(suffix)) < 0) {
				this.client.reply(msg, 'Are you serious? Go back to school and learn math again, please.');
				return;
			}

			// Remove the appropriate number of entries from the queue.
			if (msg.server.id in this.plugin.queues) {
				const queue = this.plugin.queues[msg.server.id];
				while (queue.length > 0 && number -- > 1) {
					queue.shift();
				}
			}
		}

		// Stop playback.
		connection.stopPlaying();

		// Send a message.
		let skipString = 'Okay, skipped';
		if (suffix) skipString += ' ' + suffix;
		skipString += '!';
		this.client.sendMessage(msg, skipString);
	}

}
