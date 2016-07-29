'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.main = main;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _authorization = require('./authorization');

var _authorization2 = _interopRequireDefault(_authorization);

var _config = require('./bot/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function main() {

	// Create the client.
	var client = new _discord2.default.Client();
	client.loggedIn = false;
	client.graceful = false;

	// Check the token.
	if (!_authorization2.default.DISCORD_TOKEN) {
		console.error('No token specified.');
		process.exit(1);
	}

	// Login.
	client.loginWithToken(_authorization2.default.DISCORD_TOKEN);

	// Wait for the client to be ready.
	client.on('ready', function () {
		console.log('RM-C is connected and ready to go!');
		client.loggedIn = true;

		// Start the bot.
		new _bot2.default(client, _config2.default).start();
	});

	// Capture SIGINT and SIGTERM.
	process.on('SIGINT', shutDown);
	process.on('SIGTERM', shutDown);

	/*
  * Gracefully shut down the bot.
  */
	function shutDown() {
		console.log('Shutting down...');

		// Set the graceful shutdown flag.
		client.graceful = true;

		// Log out.
		if (client.loggedIn) client.logout();
	}
}