'use strict';

var MAX_QUEUE = 20; // Maximum queue size.

var youtubedl = require('youtube-dl');

var Command = require('./Command');

var queues = {}, // All queues.
	playing = {}; // All servers that are playing.

/*
 * Common authorization requirements.
 */
function authorize(client, msg, suffix, next) {
	var connection = Command.getVoiceConnection(client, msg);
	var allowed =
		connection != null && // Must be connected to a voice channel.
		msg.author.voiceChannel != null && // User must be connected to a voice channel.
		connection.voiceChannel.equals(msg.author.voiceChannel); // Must be connected to the same voice channel.
	next(allowed);
}

// Play.
exports.play = new Command({

	usage: '<video-url>|<search>',

	description: 'play audio from a video (YouTube, Vimeo, Youku, etc.)',

	authorize: authorize,

	process: function(client, msg, suffix) {
		// Get the queue.
		if (!(msg.server.id in queues)) {
			queues[msg.server.id] = [];
		}
		var queue = queues[msg.server.id];

		// Check the queue size.
		if (queue.length >= MAX_QUEUE) {
			return client.reply(msg, 'Overload! I can\'t queue that many songs. Feed me more RAM.');
		}

		// Validate the argument.
		if (suffix.length == 0) {
			return client.reply(msg, 'Give me a video, dumbass.');
		}

		// Send a confirmation message.
		client.sendMessage(msg, 'Okay, I\'m looking for that video.', function(err, response) {
			if (err) return Command.errorOccured(client, msg);

			// If the suffix doesn't start with http, assume it's a search.
			if (!suffix.startsWith('http')) {
				suffix = 'gvsearch1:' + suffix;
			}

			// Get the video info.
			youtubedl.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], function(err, info) {
				if (err || info.format_id.startsWith('0')) { // Unknown format is invalid.
					return client.updateMessage(response, msg.author + ', that\'s not a real video, stupid.');
				}

				// Get an audio-only format if possible.
				var formatOverride = null;
				var audioFormats = info.formats.filter((f) => f.vcodec == 'none');
				if (audioFormats.length > 0) formatOverride = audioFormats[0].format_id;

				// Send a message confirming the video's been added.
				var title = info.title.replace(/`/g, '\\`');
				client.updateMessage(response, 'I\'ve queued up `' + title + '`.');

				// Add the video to queue.
				addToQueue(client, msg, [suffix, title, formatOverride], queue);
			});
		});
	}

});

// Skip.
exports.skip = new Command({

	usage: '[number|all]',

	description: 'skip 1 or more songs',

	authorize: authorize,

	process: function(client, msg, suffix) {
		// Get the voice connection.
		var connection = Command.getVoiceConnection(client, msg);

		// Check the number.
		if (suffix == 'all') {
			// Skip everthing.
			clearQueue(msg);
		} else if (suffix == '') {
			// Just skip one, so do nothing here.
		} else {
			// Check if the number is valid and positive.
			var number;
			if (isNaN(suffix) || (number = parseInt(suffix)) < 0) {
				client.reply(msg, 'Are you serious? Go back to school and learn math again, please.');
				return;
			}

			// Remove the appropriate number of entries from the queue.
			if (msg.server.id in queues) {
				var queue = queues[msg.server.id];
				while (queue.length > 0 && number -- > 1) {
					queue.shift();
				}
			}
		}

		// Stop playback.
		connection.stopPlaying();

		// Send a message.
		var skipString = 'Okay, skipped';
		if (suffix) skipString += ' ' + suffix;
		skipString += '!';
		client.sendMessage(msg, skipString);
	}

});

/*
 * Add a video to the queue.
 *
 * @param client The Discord client.
 * @param msg The message that triggered the command.
 * @param vid The URL and title of the video.
 * @param queue The queue to add to.
 */
function addToQueue(client, msg, vid, queue) {
	// Add to the queue.
	queue.push(vid);

	// Start playing if not currently playing and the queue size is 1.
	if (!(msg.server.id in playing) && queue.length == 1) playQueue(client, msg, queue);
}

/*
 * Play the first song in the queue.
 *
 * @param client The Discord client.
 * @param msg The message that triggered the command.
 * @param queue The queue to play from.
 */
function playQueue(client, msg, queue) {
	// Get the voice connection.
	var connection = Command.getVoiceConnection(client, msg);

	// If the queue is empty or the connection doesn't exist, delete the queue.
	if (queue.length == 0 || connection == null) {
		// Not playing anymore.
		clearQueue(msg);

		// Send a message if still connected to the voice channel.
		if (connection != null) client.sendMessage(msg, 'I\'m all out of songs to play!');
		return;
	}

	// Get the first video from the queue.
	var vid = queue.shift();

	// Set the server to playing.
	playing[msg.server.id] = true;

	// Send a message saying what is being played.
	client.sendMessage(msg, 'I\'m now playing `' + vid[1] + '`.');

	// Start streaming.
	var video;
	if (vid[2] != null) {
		// Format override.
		video = youtubedl(vid[0], ['--format=' + vid[2], '--force-ipv4']);
	} else {
		// No format override.
		video = youtubedl(vid[0], ['--force-ipv4']);
	}
	connection.playRawStream(video, function(err, intent) {
		if (err) return Command.errorOccurred(client, msg);

		// Catch EPIPE in the connection.
		connection.streamProc.stdin.on('error', function() { });

		// Catch all errors.
		intent.on('error', function(err) { });

		// Catch the end event.
		intent.on('end', function() {
			setTimeout(function() {
				// Play the next song in the queue.
				playQueue(client, msg, queue);
			}, 2000); // But first wait 2 seconds.
		});
	});

	// Catch all errors.
	video.on('error', function(err) { });
}

/*
 * Clear a queue.
 *
 * @param msg The message that triggered the command.
 */
function clearQueue(msg) {
	if (msg.server.id in queues) queues[msg.server.id].length = 0;
	delete queues[msg.server.id];
	delete playing[msg.server.id];
}
