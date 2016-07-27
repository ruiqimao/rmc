'use strict';

var Command = require('./Command');

module.exports = new Command({

	usage: '',

	description: 'erase the last 1000 messages in the channel',

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
			'Are you sure you want to delete the last 1000 messages in this channel?',
			function(err, msg) {
				if (err) return Command.errorOccurred(client, msg);

				// Check whether the response was affirmative.
				if (Command.checkAffirmative(msg.content)) {
					// Tell the user the messages are being deleted.
					client.sendMessage(msg, 'Alright, I\'m deleting everything!', function() {
						// Delete all messages!
						purgeMessages(client, msg.channel);
					});
				} else {
					// Tell the user the response was negative.
					client.sendMessage(msg, 'Okay, I won\'t touch the messages.');
				}
			});
	}
});

/*
 * Delete the last 1000 messages.
 *
 * @param client The Discord client.
 * @param channel The channel.
 */
function purgeMessages(client, channel) {
	// Get the message logs.
	client.getChannelLogs(channel, 1000, function(err, messages) {
		if (err) return;

		// Delete them all!
		client.deleteMessages(messages);
	});
}
