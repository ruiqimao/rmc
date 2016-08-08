const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Purge extends Command {

	get usage() { return '<number>'; }
	get description() { return 'erase some number of messages in the channel'; }

	*authorize(msg, suffix) {
		const allowed =
			!msg.channel.isPrivate && // No clearing messages in PMs.
			Util.checkPermission(msg.channel, msg.author, 'manageMessages'); // User must have permission to delete messages.
		return allowed;
	}

	*process(msg, suffix) {
		// Check the number of messages to delete.
		const number = parseInt(suffix);
		if (isNaN(number)) return this.client.reply(msg, 'Give me a number of messages to delete. A NUMBER, dumbass.');
		const numberSuffix = (number == 1 ? '' : 's');

		// Confirm the command.
		const response = yield this.client.awaitResponse(
			msg,
			'Are you sure you want to delete the last ' + number + ' message' + numberSuffix +' in this channel?');

		// Check whether the response was affirmative.
		if (Util.checkAffirmative(response.content)) {
			// Tell the user the messages are being deleted.
			yield this.client.sendMessage(msg, 'Alright, I\'m deleting ' + number + ' message' + numberSuffix + '!');

			// Get the message logs.
			const messages = yield this.client.getChannelLogs(msg, number + 4); // +4 for the 4 extra messages.

			// Delete them all!
			this.client.deleteMessages(messages);
		} else {
			// Tell the user the response was negative.
			this.client.sendMessage(msg, 'Okay, I won\'t touch the messages.');
		}
	}

}

module.exports = Purge;
