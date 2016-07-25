'use strict';

var Command = require('./Command');

module.exports = new Command({

	usage: '<choice1>;[choice2];...',

	description: 'randomly choose something',

	authorize: function(client, msg, suffix, next) {
		// Everyone is allowed to use choose.
		next(true);
	},

	process: function(client, msg, suffix) {
		// Get all the choices and weed out the blank ones.
		var choices = suffix.split(';').map((c) => c.trim()).filter((c) => c.length > 0);

		// Make sure there is at least one choice.
		if (choices.length == 0) {
			client.reply(msg, 'You have to give me at least one choice, idiot.');
			return;
		}

		// Generate a random number and turn it into an index.
		var index = Math.floor(Math.random() * choices.length);

		// Return the choice.
		client.sendMessage(msg, choices[index]);
	}

});
