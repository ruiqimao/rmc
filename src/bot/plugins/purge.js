import { Plugin, Command, Util } from 'plugin';

export default class extends Plugin {

	init() {
		this.addCommand('purge', Purge);
	}

}

class Purge extends Command {

	get usage() { return ''; }
	get description() { return 'erase the last 1000 messages in the channel'; }

	*authorize(msg, suffix) {
		const allowed =
			!msg.channel.isPrivate && // No clearing messages in PMs.
			Util.checkPermission(msg.channel, msg.author, 'manageMessages'); // User must have permission to delete messages.
		return allowed;
	}

	*process(msg, suffix) {
		// Confirm the command.
		const response = yield this.client.awaitResponse(
			msg,
			'Are you sure you want to delete the last 1000 messages in this channel?');

		// Check whether the response was affirmative.
		if (Util.checkAffirmative(response.content)) {
			// Tell the user the messages are being deleted.
			yield this.client.sendMessage(msg, 'Alright, I\'m deleting 1000 messages!');

			// Get the message logs.
			const messages = yield this.client.getChannelLogs(msg, 1000);

			// Delete them all!
			this.client.deleteMessages(messages);
		} else {
			// Tell the user the response was negative.
			this.client.sendMessage(msg, 'Okay, I won\'t touch the messages.');
		}
	}

}
