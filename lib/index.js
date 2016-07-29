'use strict';

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _rmc = require('./bot/rmc');

var _rmc2 = _interopRequireDefault(_rmc);

var _authorization = require('./bot/authorization');

var _authorization2 = _interopRequireDefault(_authorization);

var _config = require('./bot/config');

var Config = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	new _rmc2.default(client, Config).start();
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