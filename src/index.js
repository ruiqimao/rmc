import Discord from 'discord.js';

import Bot from './bot';

import Authorization from './authorization';
import Config from './bot/config';

export function main() {

	// Validate the authorization file.
	if (!Authorization.DISCORD_TOKEN) {
		console.error('No token specified.');
		process.exit(1);
	}
	if (!Authorization.MONGO_URI) {
		console.error('No MongoDB URI specified.');
		process.exit(1);
	}

	// Create and start the bot.
	const bot = new Bot(
		Authorization.DISCORD_TOKEN,
		Authorization.MONGO_URI,
		Config);
	bot.start();

	// Catch all the messages from the bot.
	bot.on('connected', () => {
		console.log('RM-C is connected!');
	});
	bot.on('ready', () => {
		console.log('RM-C is ready to go!');
	});
	bot.on('disconnected', (graceful) => {
		console.log('RM-C is disconnected.');

		// If not graceful, exit with an error code.
		if (!graceful) process.exit(1);
	});

	// Capture SIGINT and SIGTERM.
	const shutdown = () => {
		// Shutdown the bot.
		console.log('Shutting down...');
		bot.shutdown();
	}
	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);

}
