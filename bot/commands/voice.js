'use strict';

var Command = require('./Command'),
	config = require('../config');

// Join.
exports.join = new Command({

	usage: '',

	description: 'join a voice channel',

	authorize: function(client, msg, suffix, next) {
		var allowed =
			!msg.channel.isPrivate && // Cannot be PM.
			Command.checkRole(msg, config.COMMANDER); // Must be a commander.
		next(allowed);
	},

	process: function(client, msg, suffix) {
		// Get the voice channel to join.
		var channel = msg.author.voiceChannel;

		// If the channel is null, don't do anything.
		if (channel == null) {
			return client.reply(msg, 'You\'re not in a voice channel, dummy.');
		}

		// Join the channel.
		client.joinVoiceChannel(channel);
	}

});

// Leave.
exports.leave = new Command({

	usage: '',

	description: 'leave a voice channel',

	authorize: function(client, msg, suffix, next) {
		var allowed =
			!msg.channel.isPrivate && // Cannot be PM.
			Command.checkRole(msg, config.COMMANDER); // Must be a commander.
		next(allowed);
	},

	process: function(client, msg, suffix) {
		var connection = Command.getVoiceConnection(client, msg);

		// If not connected to a voice channel on the server, don't do anything.
		if (connection == null) {
			return client.reply(msg, 'I\'m not in a voice channel, dummy.');
		}

		// Stop playing if doing so.
		if (connection.playing) connection.stopPlaying();

		// Leave the voice channel.
		client.leaveVoiceChannel(connection.voiceChannel);
	}

});
