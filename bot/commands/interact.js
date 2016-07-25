'use strict';

var Command = require('./Command');

// Any of the responses RM-C can give when slapped.
var SLAP_RESPONSES = [
	'Don\'t touch me.',
	'No.',
	'Stop it.',
	'Why?',
	'Get away from me.',
	'I hate you.',
	'Do you want to die?',
	'I\'ll seriously get angry!'
];

// Number of times RM-C's been petted.
var petCounter = 0;

// Pet.
exports.pet = new Command({

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

// Slap.
exports.slap = new Command({

	usage: '',

	description: 'slap me for being a bad robot :(',

	authorize: function(client, msg, suffix, next) {
		// Everyone is allowed to slap RM-C.
		next(true);
	},

	process: function(client, msg, suffix) {
		// Respond with a random message.
		var index = Math.floor(Math.random() * SLAP_RESPONSES.length);
		client.sendMessage(msg, SLAP_RESPONSES[index]);
	}

});
