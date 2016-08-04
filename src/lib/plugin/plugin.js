import co from 'co';

/*
 * Plugin.
 */
export default class Plugin {

	/*
	 * Constructor.
	 *
	 * @bot The bot.
	 */
	constructor(bot) {
		// Set the member variables.
		this.bot = bot;
		this.client = bot.client;
		this.config = bot.config;
		this.db = bot.db;
		this.commands = [];

		// Import functions from the bot.
		for (const func of bot.exportFunctions) {
			this[func] = bot[func].bind(bot);
		}
		this.exportFunctions = bot.exportFunctions;
	}

	/*
	 * Load the plugin.
	 *
	 * @return A Promise after the plugin has loaded.
	 */
	load() {
		return co(function*() {
			// Call init() if it exists.
			if (this.init) yield co(this.init.bind(this));

			// Load the commands.
			for (const command of this.commands) {
				yield command.command.load();
			}
		}.bind(this));
	}

	/*
	 * Unload the plugin.
	 *
	 * @return A Promise after the plugin has been unloaded.
	 */
	unload() {
		return co(function*() {
			// Call destroy() if it exists.
			if (this.destroy) yield this.destroy.bind(this);

			// Unload the commands.
			for (const command of this.commands) {
				yield command.command.unload();
			}
		}.bind(this));
	}

	/*
	 * Add a command.
	 *
	 * @param name Name of the command.
	 * @param command Prototype of the command to add.
	 */
	addCommand(name, command) {
		this.commands.push({
			name: name,
			command: new command(this)
		});
	}

	/*
	 * Remove a command.
	 *
	 * @param name Name of the command.
	 */
	removeCommand(name) {
		this.commands = this.commands.filter((command) => command.name != name);
	}

	/*
	 * Get the plugin data for a server.
	 *
	 * @param id The server id.
	 *
	 * @return The plugin data for the server.
	 */
	*_getData(id) {
		const data = {};

		// Get the plugin's own data.
		if (this.getData) data._ = yield this.getData(id);

		// Get data from all the commands.
		for (const command of this.commands) {
			if (command.command.getData) data[command.name] = yield command.command.getData(id);
		}

		// Return the data.
		return data;
	}

	/*
	 * Save data to the plugin for a server.
	 *
	 * @param id The server id.
	 * @param data The data to save.
	 */
	*_saveData(id, data) {
		// Save the plugin's own data.
		if (this.getData && data._ !== undefined) yield this.setData(id, data._);

		// Save data for all the commands.
		for (const command of this.commands) {
			if (command.command.saveData && data[command.name] !== undefined) {
				yield command.command.saveData(id, data[command.name]);
			}
		}
	}

}
