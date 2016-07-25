'use strict';

var Discord = require('discord.js');

var authorization = require('./authorization.json'),
	rmc = require('./bot/rmc');

// Create the client.
var client = new Discord.Client();
client.loggedIn = false;

// Check the token.
if (!authorization.DISCORD_TOKEN) {
	console.error('No token specified.');
	process.exit(1);
}

// Login.
client.loginWithToken(authorization.DISCORD_TOKEN);

// Wait for the client to be ready.
client.on('ready', function() {
	console.log('RM-C is connected and ready to go!');
	client.loggedIn = true;

	// Start the bot.
	rmc.start(client);
});

// Capture SIGINT and SIGTERM.
process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);

/*
 * Gracefully shut down the bot.
 */
function shutDown() {
	console.log('Shutting down...');

	// Log out.
	if (client.loggedIn) client.logout();
}
