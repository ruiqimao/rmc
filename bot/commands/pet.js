'use strict';

var Command = require('./Command');

var petCounter = 0;

module.exports = new Command({

	usage: '',

	description: 'pet me for being a good robot!',

	authorize: function(client, msg, suffix, next) {
		// Everyone is allowed to pet RM-C.
		next(true);
	},

	process: function(client, msg, suffix) {
		// Respond with the count.
		var countString = ++petCounter + ' time';
		if (petCounter > 1) countString += 's';
		client.sendMessage(msg, '*~kya~*, I\'ve been petted ' + countString + '.', function() {
			// Send either a heart or a tsundere message.
			if (Math.random() > 0.5) {
				// Heart!
				client.sendMessage(msg, ':heart:');
			} else {
				// B-baka!
				client.sendMessage(msg, 'B-baka! It\'s not like I wanted you to pet me or anything...');
			}
		});
	}

});
