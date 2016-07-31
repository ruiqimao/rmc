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
		this.commands = [];
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

}
