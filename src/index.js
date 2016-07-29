import Discord from 'discord.js';
import RMC from './bot/rmc';
import Authorization from './bot/authorization';
import Config from './bot/config';

// Create the client.
const client = new Discord.Client();
client.loggedIn = false;
client.graceful = false;

// Check the token.
if (!Authorization.DISCORD_TOKEN) {
	console.error('No token specified.');
	process.exit(1);
}

// Login.
client.loginWithToken(Authorization.DISCORD_TOKEN);

// Wait for the client to be ready.
client.on('ready', () => {
	console.log('RM-C is connected and ready to go!');
	client.loggedIn = true;

	// Start the bot.
	(new RMC(client, Config)).start();
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
