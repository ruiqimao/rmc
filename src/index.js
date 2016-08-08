const Cluster = require('cluster');
const OS = require('os');

const Bot = require('./bot');

const Authorization = require('./authorization');
const Config = require('./bot/config');

function main() {

	// Set the authorization according to the environment.
	if (IS_PRODUCTION) {
		Authorization.DISCORD_TOKEN = Authorization.DISCORD_PRD_TOKEN;
		Authorization.MONGO_URI = Authorization.MONGO_PRD_URI;
	} else {
		Authorization.DISCORD_TOKEN = Authorization.DISCORD_DEV_TOKEN;
		Authorization.MONGO_URI = Authorization.MONGO_DEV_URI;
	}

	// Validate the authorization file.
	if (!Authorization.DISCORD_TOKEN) {
		console.error('No token specified.');
		process.exit(1);
	}
	if (!Authorization.MONGO_URI) {
		console.error('No MongoDB URI specified.');
		process.exit(1);
	}
	if (!Authorization.OWNERS || Authorization.OWNERS.length == 0) {
		console.error('No owners specified.');
		process.exit(1);
	}

	// Start a cluster.
	const numCPUs = OS.cpus().length;
	if (Cluster.isMaster) {
		// Fork workers.
		for (let i = 0; i < numCPUs; i ++) {
			Cluster.fork();
		}

		// Capture SIGINT and SIGTERM.
		const shutdown = () => {
			// Send SIGTERM to all workers.
			const workers = Cluster.workers;
			for (const id in workers) {
				const worker = workers[id];
				worker.kill('SIGTERM');
			}
		};
		process.on('SIGINT', shutdown);
		process.on('SIGTERM', shutdown);
	} else {
		const worker = Cluster.worker;

		// Create the bot.
		const bot = new Bot(
			Authorization,
			Config,
			worker,
			numCPUs);

		// Catch all the messages from the bot.
		bot.on('connected', () => {
			console.log(bot.client.user.username + '(' + worker.id + ') is connected!');
		});
		bot.on('ready', () => {
			console.log(bot.client.user.username + '(' + worker.id + ') is ready to go!');
		});
		bot.on('disconnected', (graceful) => {
			console.log(bot.client.user.username + '(' + worker.id + ') is disconnected.');

			// If not graceful, exit with an error code.
			if (!graceful) process.exit(1);
			else process.exit(0);
		});

		// Capture SIGTERM.
		const shutdown = () => {
			// Shutdown the bot.
			console.log('Shutting down...');
			bot.shutdown();
		};
		process.on('SIGTERM', shutdown);
		process.on('SIGINT', () => { });

		// Wait to login prevent being rate limited.
		setTimeout(bot.start.bind(bot), 6000 * (worker.id - 1));
	}

}

exports.main = main;
