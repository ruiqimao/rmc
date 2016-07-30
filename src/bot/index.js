import { Client } from 'discord.js';
import EventEmitter from 'events';
import Mongorito from 'mongorito';

/*
 * Class for RMC bot.
 */
export default class Bot extends EventEmitter {

	/*
	 * Constructor.
	 *
	 * @param token The authorization token.
	 * @param dbUri The database URI.
	 * @param config The configuration for the bot.
	 */
	constructor(token, dbUri, config) {
		super();

		// Assign the member variables.
		this.token = token;
		this.dbUri = dbUri;
		this.config = config;
		this.client = new Client();
		this.db = null;
		this.plugins = [];
		this.commands = {};
		this.loggedIn = false;
		this.gracefulShutdown = false;
	}

	/*
	 * Starts normal bot operations.
	 */
	start() {
		// Connect to the database.
		Mongorito.connect(this.dbUri).then((db) => {
			this.db = db;
			console.log('Connected to database!');

			// Login.
			this.client.loginWithToken(this.token);

			// Wait for the client to be ready.
			this.client.on('ready', () => {

				// Set the logged in flag.
				this.loggedIn = true;
				this.emit('connected');

				// Initialize all the plugins.
				this.loadPlugins();

				// Set the status and game.
				this.client.setStatus('online', this.config.GAME);

				// Read messages.
				this.client.on('message', (msg) => {
					this.handleMessage(msg);
				});

				// Handle a disconnection.
				this.client.on('disconnected', () => {
					this.emit('disconnected', this.gracefulShutdown);
				});

				// Emit a ready event.
				this.emit('ready');
			});

		}).catch((err) => {
			console.error('Couldn\'t connect to the database.');
		});
	}

	/*
	 * Load all the plugins in the config.
	 */
	loadPlugins() {
		// Clear the plugin list.
		this.plugins = [];

		// Load the plugins.
		for (const plugin in this.config.PLUGINS) {
			const Plugin = this.config.PLUGINS[plugin];
			this.plugins.push(new Plugin(this));
		}

		// Build a cache of commands.
		this.loadCommandCache();
	}

	/*
	 * Build a cache of all commands.
	 */
	loadCommandCache() {
		// Clear the command cache.
		this.commands = {};

		// Load all the commands and store them in the cache.
		for (const plugin of this.plugins) {
			for (const command of plugin.commands) {
				this.commands[command.name] = command.command;
			}
		}
	}

	/*
	 * Gracefully shut down the bot.
	 */
	shutdown() {
		// Set the graceful shutdown flag.
		this.gracefulShutdown = true;

		// Log out.
		if (this.loggedIn) this.client.logout();

		// Close the database connection.
		if (this.db) this.db.close();
	}

	/*
	 * Handle a message.
	 *
	 * @param msg The message.
	 */
	handleMessage(msg) {
		// Ignore messages from herself.
		if (msg.author.equals(this.client.user)) return;

		// Ping.
		if (msg.content === 'ping') {
			return this.client.sendMessage(msg, 'pong');
		}

		// Trim the message and check if the message is a command.
		const message = msg.content.trim();
		if (message.startsWith(this.config.COMMAND_PREFIX)) {
			// Get the command.
			const command = message.substring(this.config.COMMAND_PREFIX.length).split(' ')[0];

			// Get the suffix.
			const suffix = message.substring(command.length + this.config.COMMAND_PREFIX.length).trim();

			// Handle the command.
			this.handleCommand(msg, command, suffix);
		}
	}

	/*
	 * Handle a command.
	 *
	 * @param msg The message that triggered the command.
	 * @param command The command.
	 * @param suffix The command suffix.
	 */
	handleCommand(msg, command, suffix) {
		// Handle special "help" command.
		if (command == 'help') {
			return this.handleHelp(msg, suffix);
		}

		// Check if the command is valid.
		if (command in this.commands) {
			// Execute the command.
			this.commands[command].run(msg, suffix);
		}
	}

	/*
	 * Handles the "help" command.
	 *
	 * @param msg The message that triggered the command.
	 * @param suffix The command suffix.
	 */
	handleHelp(msg, suffix) {
		/*
		 * Generates a help entry.
		 *
		 * @param command The name of the command to generate the entry from.
		 *
		 * @return The help entry if the command exists, null otherwise.
		 */
		const generateEntry = (command) => {
			// Check if the command exists.
			if (command in this.commands) {
				// Get the command.
				let cmd = this.commands[command];

				// Construct the entry.
				let entry = '`' + this.config.COMMAND_PREFIX + command;
				if (cmd.usage) entry += ' ' + cmd.usage;
				entry += '`: ' + cmd.description;

				// Return the entry.
				return entry;
			} else {
				// Return null.
				return null;
			}
		};

		// Check if the suffix exists.
		if (suffix.length > 0) {
			// Show the help entry for a certain command.
			const entry = generateEntry(suffix);

			// Check if the entry actually exists.
			if (entry != null) {
				// Reply with the entry.
				this.client.sendMessage(msg, entry);
			} else {
				// Error!
				this.client.sendMessage(msg, '`' + suffix + '` isn\'t an actual command, dumbass.');
			}
		} else {
			// Show all help entries.
			const entries = '**Available Directives:**\n' + Object.keys(this.commands).map((cmd) => generateEntry(cmd)).join('\n');
			this.client.sendMessage(msg, entries);
		}
	}

}
