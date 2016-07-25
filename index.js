'use strict';

var Discord = require('discord.js');

var constants = require('./constants'),
	rmc = require('./bot/rmc');

// Create the client.
var client = new Discord.Client();
client.loggedIn = false;

// Login.
client.loginWithToken(constants.TOKEN);

// Wait for the client to be ready.
client.on('ready', function() {
	console.log('RM-C is connected and ready to go!');
	client.loggedIn = true;

	// Start the bot.
	rmc.start(client);
});

// Capture SIGINT.
process.on('SIGINT', function() {
	console.log('Shutting down...');

	// Log out.
	if (client.loggedIn) client.logout();
});
