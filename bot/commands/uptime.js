'use strict';

var Command = require('./Command');

module.exports = new Command({

	usage: '',

	description: 'find out how long I\'ve been running',

	authorize: function(client, msg, suffix, next) {
		// Everyone is allowed to check uptime.
		next(true);
	},

	process: function(client, msg, suffix) {
		// Get the client uptime.
		var uptime = client.uptime;

		// Convert the time to a readable format.
		var date = new Date(uptime);
		var days = date.getUTCDate() - 1,
			hours = date.getUTCHours(),
			minutes = date.getUTCMinutes(),
			seconds = date.getUTCSeconds();
		var segments = [];
		if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
		if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
		if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
		if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
		var dateString = segments.join(', ');

		// Return the choice.
		client.sendMessage(msg, 'I\'ve been running for **' + dateString + '**!');
	}

});
