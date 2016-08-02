import co from 'co';

/*
 * Command.
 */
export default class Command {

	/*
	 * Constructor.
	 *
	 * @param plugin The plugin associated with the command.
	 */
	constructor(plugin) {
		// Assign the member variables.
		this.plugin = plugin;
		this.bot = plugin.bot;
		this.client = plugin.client;
		this.config = plugin.config;
		this.db = plugin.db;

		// Import functions from the plugin.
		for (const func of plugin.exportFunctions) {
			this[func] = plugin[func].bind(plugin);
		}

		// Make sure the proper virtual methods exist.
		if (this.usage === undefined)       throw new TypeError('Must have a usage.');
		if (this.description === undefined) throw new TypeError('Must have a description.');
		if (this.authorize === undefined)   throw new TypeError('Must implement authorize().');
		if (this.process === undefined)     throw new TypeError('Must implement process().');
	}

	/*
	 * Load the command.
	 *
	 * @return A Promise after the command has loaded.
	 */
	load() {
		if (this.init) {
			// Call init() if it exists.
			return co(this.init.bind(this));
		} else {
			// Otherwise, return a resolved Promise.
			return Promise.resolve();
		}
	}

	/*
	 * Unload the command.
	 *
	 * @return A Promise after the command has unloaded.
	 */
	unload() {
		if (this.destroy) {
			// Call destroy() if it exists.
			return co(this.destroy.bind(this));
		} else {
			// Otherwise, return a resolved Promise.
			return Promise.resolve();
		}
	}

	/*
	 * Run the command.
	 *
	 * @param msg The message that triggered the command.
	 * @param suffix The suffix of the command.
	 *
	 * @return A Promise after the command is finished.
	 */
	run(msg, suffix) {
		return co(function*() {
			// Check permissions.
			if (yield co(this.authorize.bind(this), msg, suffix)) {
				// Run.
				return co(this.process.bind(this), msg, suffix).catch((err) => {
					console.error(err);
					this.errorOccurred(msg);
				});
			} else {
				// Don't run.
				this.permissionDenied(msg);

				// Return a resolved Promise.
				return Promise.resolve();
			}
		}.bind(this));
	}

}
