import { Client } from 'discord.js';
import EventEmitter from 'events';
import Mongorito from 'mongorito';

import co from 'co';

/*
 * Class for RMC bot.
 */
export default class Bot extends EventEmitter {

	/*
	 * Constructor.
	 *
	 * @param authorization The authorization data.
	 * @param config The configuration for the bot.
	 */
	constructor(authorization, config) {
		super();

		// Assign the member variables.
		this.token = authorization.DISCORD_TOKEN;
		this.dbUri = authorization.MONGO_URI;
		this.owners = authorization.OWNERS;
		this.config = config;
		this.client = new Client({
			forceFetchUsers: true
		});
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
				this.loadPlugins().then(() => {
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
			});

		}).catch((err) => {
			console.error('Couldn\'t connect to the database.');
		});
	}

	/*
	 * Load all the plugins in the config.
	 *
	 * @return A Promise after all the plugins have loaded.
	 */
	loadPlugins() {
		return co(function*() {
			// Clear the plugin list.
			this.plugins = [];

			// Load the plugins.
			for (const plugin of this.config.PLUGINS) {
				yield this.loadPlugin(plugin).then(() => {
					console.log('Loaded plugin \'' + plugin + '\'.');
				}).catch((err) => {
					console.error('Could not load plugin \'' + plugin + '\'.');
					console.error(err);
				});
			}
		}.bind(this));
	}

	/*
	 * Load a plugin.
	 *
	 * @param name The name of the plugin.
	 *
	 * @return A Promise after the plugin has loaded.
	 */
	loadPlugin(name) {
		// Check if the plugin has already been loaded.
		if (this.plugins.filter((p) => p.name == name).length > 0) {
			// Reject if it has.
			return Promise.reject();
		}

		return co(function*() {
			const Plugin = require('./plugins/' + name).default;
			const plugin = new Plugin(this);
			yield plugin.load();
			this.plugins.push({
				name: name,
				plugin: plugin
			});

			// Rebuild the cache of commands.
			this.loadCommandCache();
		}.bind(this));
	}

	/*
	 * Unload a plugin.
	 *
	 * @param name The name of the plugin.
	 *
	 * @return A Promise after the plugin has unloaded.
	 */
	unloadPlugin(name) {
		return co(function*() {
			// Find the plugin.
			let found = false,
				index = null,
				plugin = null;
			for (const i in this.plugins) {
				if (this.plugins[i].name == name) {
					found = true;
					index = i;
					plugin = this.plugins[i].plugin;
					break;
				}
			}
			if (!found) return Promise.reject();

			// Unload the plugin.
			yield plugin.unload();

			// Remove the plugin.
			this.plugins.splice(index, 1);

			// Rebuild the command cache.
			this.loadCommandCache();
		}.bind(this));
	}

	/*
	 * Build a cache of all commands.
	 */
	loadCommandCache() {
		// Clear the command cache.
		this.commands = {};

		// Load all the commands and store them in the cache.
		for (const plugin of this.plugins) {
			for (const command of plugin.plugin.commands) {
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
		// Check if the command is valid.
		if (command in this.commands) {
			// Execute the command.
			this.commands[command].run(msg, suffix);
		}
	}

}
