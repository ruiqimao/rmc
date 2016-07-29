import Command, { Util } from './command';

export default class Purge extends Command {

	get usage() { return ''; }
	get description() { return 'erase the last 1000 messages in the channel'; }

	authorize(msg, suffix, next) {
		const allowed =
			!msg.channel.isPrivate && // No clearing messages in PMs.
			Util.checkPermission(msg.channel, msg.author, 'manageMessages'); // User must have permission to delete messages.
		next(allowed);
	}

	process(msg, suffix) {
		// Confirm the command.
		this.client.awaitResponse(
			msg,
			'Are you sure you want to delete the last 1000 messages in this channel?',
			(err, msg) => {
				if (err) return this.errorOccurred(msg);

				// Check whether the response was affirmative.
				if (Util.checkAffirmative(msg.content)) {
					// Tell the user the messages are being deleted.
					this.client.sendMessage(msg, 'Alright, I\'m deleting 1000 messages!', () => {
						// Delete all messages!
						this.purgeMessages(msg.channel);
					});
				} else {
					// Tell the user the response was negative.
					this.client.sendMessage(msg, 'Okay, I won\'t touch the messages.');
				}
			});
	}

	/*
	 * Delete the last 1000 messages.
	 *
	 * @param channel The channel.
	 */
	purgeMessages(channel) {
		// Get the message logs.
		this.client.getChannelLogs(channel, 1000, (err, messages) => {
			if (err) return;

			// Delete them all!
			this.client.deleteMessages(messages);
		});
	}

}
