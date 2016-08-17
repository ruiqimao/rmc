const Command = require('plugin').Command;

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
			if (isNaN(suffix) || (number = parseInt(suffix)) < 1) {
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

module.exports = Skip
