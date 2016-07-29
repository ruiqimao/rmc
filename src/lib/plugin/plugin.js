/*
 * Class for plugin.
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

		// Call init() if it exists.
		if (this.init) this.init();
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

}
