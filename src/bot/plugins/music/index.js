const Plugin = require('plugin').Plugin;

const Request = require('request');

const BufferStream = require('buffer-stream');

class Music extends Plugin {

	*init() {
		this.addCommand('play', require('./commands/play'));
		this.addCommand('skip', require('./commands/skip'));

		// Set the constants.
		this.MAX_QUEUE = 20; // Maximum queue size.
		this.INITIAL_BUFFER = 262144; // Initial buffer pass condition (256KB).
		this.MAX_BUFFER = 1048576; // Maximum buffer size (1MB).

		// Set the member variables.
		this.queues = {}; // All queues.
		this.playing = {}; // All servers that are playing.
	}

	*destroy() {
		// Stop playing on all servers.
		for (const server of Object.keys(this.playing)) {
			const connection = this.getVoiceConnection(server);
			if (connection) connection.stopPlaying();
		}
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

		// Pipe the video into a buffer stream.
		const buffer = new BufferStream(this.INITIAL_BUFFER, this.MAX_BUFFER);
		Request.get(vid.url).pipe(buffer);

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

module.exports = Music;
