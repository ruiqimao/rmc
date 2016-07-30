'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.main = main;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _authorization = require('./authorization');

var _authorization2 = _interopRequireDefault(_authorization);

var _config = require('./bot/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function main() {

	// Validate the authorization file.
	if (!_authorization2.default.DISCORD_TOKEN) {
		console.error('No token specified.');
		process.exit(1);
	}
	if (!_authorization2.default.MONGO_URI) {
		console.error('No MongoDB URI specified.');
		process.exit(1);
	}

	// Create and start the bot.
	var bot = new _bot2.default(_authorization2.default.DISCORD_TOKEN, _authorization2.default.MONGO_URI, _config2.default);
	bot.start();

	// Catch all the messages from the bot.
	bot.on('connected', function () {
		console.log('RM-C is connected!');
	});
	bot.on('ready', function () {
		console.log('RM-C is ready to go!');
	});
	bot.on('disconnected', function (graceful) {
		console.log('RM-C is disconnected.');

		// If not graceful, exit with an error code.
		if (!graceful) process.exit(1);
	});

	// Capture SIGINT and SIGTERM.
	var shutdown = function shutdown() {
		// Shutdown the bot.
		console.log('Shutting down...');
		bot.shutdown();
	};
	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);
}