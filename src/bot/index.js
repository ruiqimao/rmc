import { Client } from 'discord.js';
import EventEmitter from 'events';

/*
 * Class for RMC bot.
 */
export default class Bot extends EventEmitter {

	/*
	 * Constructor.
	 *
	 * @param token The authorization token.
	 * @param config The configuration for the bot.
	 */
	constructor(token, config) {
		super();

		// Assign the member variables.
		this.token = token;
		this.config = config;
		this.client = new Client();
		this.commands = {};
		this.loggedIn = false;
		this.gracefulShutdown = false;
	}

	/*
	 * Starts normal bot operations.
	 */
	start() {
		// Login.
		this.client.loginWithToken(this.token);

		// Wait for the client to be ready.
		this.client.on('ready', () => {

			// Set the logged in flag.
			this.loggedIn = true;
			this.emit('connected');

			// Initialize all the commands.
			for (const command in this.config.COMMANDS) {
				const Command = this.config.COMMANDS[command];
				this.commands[command.toLowerCase()] = new Command(this.client, this.config);
			}

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
	}

	/*
	 * Gracefully shut down the bot.
	 */
	shutdown() {
		// Set the graceful shutdown flag.
		this.gracefulShutdown = true;

		// Log out.
		if (this.loggedIn) this.client.logout();
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
