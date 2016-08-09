const Client = require('discord.js').Client;
const EventEmitter = require('events');
const Mongorito = require('mongorito');
const Model = Mongorito.Model;

const co = require('co');
const HTTP = require('http');
const Express = require('express');
const Hogan = require('hogan-express');
const BodyParser = require('body-parser');

/*
 * Class for RMC bot.
 */
class Bot extends EventEmitter {

	/*
	 * Constructor.
	 *
	 * @param authorization The authorization data.
	 * @param config The configuration for the bot.
	 * @param worker The cluster worker for the bot.
	 * @param numWorkers The total number of workers.
	 */
	constructor(authorization, config, worker, numWorkers) {
		super();

		// Assign the member variables.
		this.token = authorization.DISCORD_TOKEN;
		this.dbUri = authorization.MONGO_URI;
		this.owners = authorization.OWNERS;
		this.config = config;
		this.worker = worker;
		this.numWorkers = numWorkers;
		this.client = new Client({
			forceFetchUsers: true,
			shardCount: numWorkers,
			shardId: worker.id - 1
		});
		this.db = null;
		this.plugins = [];
		this.commands = {};
		this.loggedIn = false;
		this.gracefulShutdown = false;

		// Set constants.
		this.PERMISSION_DENIED_RESPONSES = [
			'I don\'t recognize your authority.',
			'No.',
			'Fuck off.',
			'No, fuck you.',
			'Who do you think you are, telling me what to do?',
			'Don\'t tell me what to do.',
			'HAHAHA no.',
			'Ehhh...',
			'Nah.',
			'Yeah no.',
			'Screw that.',
			'Beep boop, permission denied, fucker!'
		];

		// Set functions to export to children.
		this.exportFunctions = [
			'getVoiceConnection',
			'permissionDenied',
			'errorOccurred',
			'createModel'
		];

		// Bind functions.
		this.handleCommand = this.handleCommand.bind(this);
	}

	/*
	 * Starts normal bot operations.
	 */
	start() {
		// Connect to the database.
		Mongorito.connect(this.dbUri).then((db) => {
			this.db = db;
			console.log('Connected to database!');

			// Create models.
			this.Prefix = this.createModel('_bot-command-prefix');
			this.Commander = this.createModel('_bot-commander');
			this.EnabledCommands = this.createModel('_bot-enabled-commands');

			// Create a web server.
			this.express = Express();

			// Set up body parser.
			this.express.use(BodyParser.json({ limit: '50mb' }));
			this.express.use(BodyParser.urlencoded({ extended: true, limit: '50mb' }));

			// Set up templates.
			this.express.engine('html', Hogan);

			// Set up static files.
			this.express.use(Express.static(__dirname + '/dashboard/public'));

			// Start listening on the server.
			this.server = HTTP.createServer(this.express);
			this.server.listen(this.config.SERVER_PORT + this.worker.id, (err) => {
				if (err) return console.error('Could not start web server.');
				console.log('Started web server on port ' + (this.config.SERVER_PORT + this.worker.id) + '!');

				// Login.
				this.client.loginWithToken(this.token);

				this.client.on('error', (err) => {
					console.log(err);
				});

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

			// Fix the commands lists.
			yield this.fixCommandsLists();
		}.bind(this));
	}

	/*
	 * Fix all the commands lists.
	 */
	*fixCommandsLists() {
		for (const server of this.client.servers) {
			// Get the saved enabled commands and the full list of commands.
			const entry = yield this.EnabledCommands.getEntry(server.id, this.enabledCommands);
			const savedCommands = entry.val();
			const commands = this.enabledCommands;

			// Make corrections.
			for (const command in savedCommands) {
				if (commands[command] !== undefined && !savedCommands[command]) commands[command] = false;
			}

			// Save the corrected command list.
			entry.val(commands);
			yield entry.save();
		}
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
			const Plugin = require('./plugins/' + name);
			const plugin = new Plugin(this);
			yield plugin.load();
			this.plugins.push({
				name: name,
				plugin: plugin
			});

			// Rebuild the cache of commands.
			yield this.loadCommandCache();
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
			yield this.loadCommandCache();
		}.bind(this));
	}

	/*
	 * Build a cache of all commands.
	 */
	*loadCommandCache() {
		// Clear the command cache.
		this.commands = {};
		this.enabledCommands = {};

		// Load all the commands and store them in the cache.
		for (const plugin of this.plugins) {
			for (const command of plugin.plugin.commands) {
				this.commands[command.name] = command.command;
				this.enabledCommands[command.name] = true;
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

		// Close the server.
		if (this.server) this.server.close();

		// Force a shutdown in 5 seconds.
		setTimeout(() => process.exit(0), 5000);
	}

	/*
	 * Handle a message.
	 *
	 * @param msg The message.
	 */
	handleMessage(msg) {
		co(function*() {
			// Ignore messages from herself.
			if (msg.author.equals(this.client.user)) return;

			// Ping.
			if (msg.content === 'ping') {
				return this.client.sendMessage(msg, 'pong');
			}

			// Trim the message and check if the message is a command.
			const message = msg.content.trim();

			// Get the prefix.
			let prefix;
			if (msg.channel.isPrivate) {
				prefix = this.config.COMMAND_PREFIX;
			} else {
				prefix = (yield this.Prefix.getEntry(msg.server.id, this.config.COMMAND_PREFIX)).val();
			}

			// Check if the message is a command.
			if (message.startsWith(prefix)) {
				// Get the command.
				const command = message.substring(prefix.length).split(' ')[0];

				// Get the suffix.
				const suffix = message.substring(command.length + prefix.length).trim();

				// Handle the command.
				yield this.handleCommand(msg, command, suffix);
			}
		}.bind(this));
	}

	/*
	 * Get data for the dashboard.
	 *
	 * @param server The server id.
	 *
	 * @return The relevant information.
	 */
	*getData(server) {
		// Get the roles.
		const roles = this.client.servers.get('id', server).roles.map(role => {
			return {
				id: role.id,
				name: role.name,
				color: role.colorAsHex()
			};
		});

		// Get the channels.
		const textChannels = this.client.servers.get('id', server).channels
			.filter(channel => channel.type === 'text')
			.map(channel => {
				return {
					id: channel.id,
					name: channel.name
				};
			});

		return {
			// Server name.
			'name': (this.client.servers.get('id', server).name),

			// Server roles.
			'roles': roles,

			// Server text channels.
			'textChannels': textChannels,

			// Command prefix.
			'prefix': (yield this.Prefix.getEntry(server, this.config.COMMAND_PREFIX)).val(),

			// Commander.
			'commander': (yield this.Commander.getEntry(server, '')).val(),

			// Enabled commands.
			'commands': (yield this.EnabledCommands.getEntry(server, this.enabledCommands)).val()
		};
	}

	/*
	 * Save data for the dashboard.
	 *
	 * @param server The server id.
	 * @param data The data to save.
	 *
	 * @return The relevant information.
	 */
	*saveData(server, data) {
		// Save the command prefix.
		if (data.prefix.length > 0 && data.prefix.length < 4) {
			const entry = yield this.Prefix.getEntry(server, this.config.COMMAND_PREFIX);
			entry.val(data.prefix);
			yield entry.save();
		}

		// Save the commander.
		{
			const entry = yield this.Commander.getEntry(server, '');
			entry.val(data.commander);
			yield entry.save();
		}

		// Save the enabled commands.
		{
			const entry = yield this.EnabledCommands.getEntry(server, this.enabledCommands);
			entry.val(data.commands);
			yield entry.save();
		}
	}

	/*
	 * Handle a command.
	 *
	 * @param msg The message that triggered the command.
	 * @param command The command.
	 * @param suffix The command suffix.
	 */
	*handleCommand(msg, command, suffix) {
		// Get the list of enable commands.
		const commands = (yield this.EnabledCommands.getEntry(msg.server.id, this.enabledCommands)).val();

		// Check if the command is valid.
		if (commands[command]) {
			// Execute the command.
			yield this.commands[command].run(msg, suffix);
		}
	}

	/*
	 * Get the voice connection RM-C is connected to.
	 *
	 * @param server The server to look for.
	 *
	 * @return The voice connection associated with the server, null if it doesn't exist.
	 */
	getVoiceConnection(server) {
		// Get all connections associated with the server.
		const connections = this.client.voiceConnections.filter(
			(v) => v.voiceChannel.server.equals(server) || v.voiceChannel.server.id == server
		);

		// Return the connection.
		if (connections.length == 0) return null;
		return connections[0];
	}

	/*
	 * Sends a permission denied reply.
	 *
	 * @param channel A Channel resolvable.
	 */
	permissionDenied(channel) {
		const index = Math.floor(Math.random() * this.PERMISSION_DENIED_RESPONSES.length);
		this.client.reply(channel, this.PERMISSION_DENIED_RESPONSES[index]);
	}

	/*
	 * Sends a message saying something went wrong.
	 *
	 * @param chanel A channel resolvable.
	 */
	errorOccurred(channel) {
		this.client.sendMessage(channel, 'My creator is an idiot. Something went wrong!');
	}

	/*
	 * Create a Mongorito model using a collection name.
	 *
	 * @param collection The collection name to use.
	 *
	 * @return A Mongorito Model.
	 */
	createModel(collection) {
		const db = this.db;
		const bot = this;
		return class extends Model {
			db() { return db; }
			collection() { return collection; }
			bot() { return bot; }

			/*
			 * Get the entry for the server. For models with exactly one entry per server.
			 *
			 * @param server The server id.
			 * @param def The default value.
			 *
			 * @return The entry.
			 */
			static *getEntry(server, def) {
				const entries = yield this.limit(1).find({
					'server': server
				});
				if (entries.length > 0) {
					return entries[0];
				} else {
					return new this({
						'server': server,
						'value': def
					});
				}
			}

			/*
			 * Get or set the 'value' field.
			 *
			 * @param val The val to set, if needed.
			 *
			 * @return The value.
			 */
			val(val) {
				if (val !== undefined) {
					this.set('value', val);
				}
				return this.get('value');
			}
		};
	}

}

module.exports = Bot;
