'use strict';

var Command = require('./Command');

var ABOUT =
	`I'm "Ruinous Might Cannon Type", or otherwise known as "RM-C". I was made by Ernesta Kuhne (read: Ruiqi Mao) and if you piss me off, I'll seriously hurt you. <3`;

module.exports = new Command({

	usage: '',

	description: 'about me!',

	authorize: function(client, msg, suffix, next) {
		// Everyone is allowed to make RM-C say something.
		next(true);
	},

	process: function(client, msg, suffix) {
		client.sendMessage(msg, ABOUT);
	}

});
