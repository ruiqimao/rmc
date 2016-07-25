'use strict';

var Command = require('./Command');

module.exports = new Command({

	usage: '',

	description: 'erase all messages in the channel',

	authorize: function(client, msg, suffix, next) {
		var allowed =
			!msg.channel.isPrivate && // No clearing messages in PMs.
			Command.checkPermission(msg, 'manageMessages'); // User must have permission to delete messages.
		next(allowed);
	},

	process: function(client, msg, suffix) {
		// Confirm the command.
		client.awaitResponse(
			msg,
			'Are you sure you want to delete all messages in this channel?',
			function(err, msg) {
				if (err) return Command.errorOccurred(client, msg);

				// Check whether the response was affirmative.
				if (Command.checkAffirmative(msg.content)) {
					// Tell the user the messages are being deleted.
					client.sendMessage(msg, 'Alright, I\'m deleting everything!');

					// Delete all messages!
					purgeMessages(client, msg.channel);
				} else {
					// Tell the user the response was negative.
					client.sendMessage(msg, 'Okay, I won\'t touch the messages.');
				}
			});
	}
});

/*
 * Repeatedly delete messages until there are no more left.
 *
 * @param client The Discord client.
 * @param channel The channel.
 */
function purgeMessages(client, channel) {
	// Get the message logs.
	client.getChannelLogs(channel, 1000, function(err, messages) {
		if (err) return;

		// Check if there are any messages left.
		if (messages.length > 0) {
			// Delete them all!
			client.deleteMessages(messages, function(err) {
				// Keep deleting.
				purgeMessages(client, channel);
			});
		}
	});
}
