'use strict';

var Command = require('./Command');

module.exports = new Command({

	usage: '<text>',

	description: 'make me say something',

	authorize: function(client, msg, suffix, next) {
		// Everyone is allowed to make RM-C say something.
		next(true);
	},

	process: function(client, msg, suffix) {
		// Make sure there actually is a message.
		if (!suffix) return client.reply(msg, 'Hurry up and tell me what to say already.');

		client.sendMessage(msg, suffix);
	}

});
