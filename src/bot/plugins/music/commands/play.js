const Command = require('plugin').Command;

const YoutubeDL = require('youtube-dl');

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

		// If the suffix doesn't start with http, assume it's a search.
		if (!suffix.startsWith('http')) {
			suffix = 'gvsearch1:' + suffix;
		}

		// Send a confirmation message.
		const response = yield this.client.sendMessage(msg, 'Okay, I\'m looking for that video.');

		// Get the video info.
		YoutubeDL.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
			if (err || info.format_id === undefined || info.format_id.startsWith('0')) { // Unknown format is invalid.
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

module.exports = Play;
