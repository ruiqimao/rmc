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
		this.client = plugin.client;
		this.config = plugin.config;

		// Make sure the proper virtual methods exist.
		if (this.usage === undefined)       throw new TypeError('Must have a usage.');
		if (this.description === undefined) throw new TypeError('Must have a description.');
		if (this.authorize === undefined)   throw new TypeError('Must implement authorize().');
		if (this.process === undefined)     throw new TypeError('Must implement process().');

		// Call init() if it exists.
		if (this.init) co(this.init.bind(this));
	}

	/*
	 * Run the command.
	 *
	 * @param msg The message that triggered the command.
	 * @param suffix The suffix of the command.
	 */
	run(msg, suffix) {
		// Check permissions.
		co(this.authorize.bind(this), msg, suffix).then((allowed) => {
			if (allowed) {
				// Run.
				co(this.process.bind(this), msg, suffix).catch(() => {
					this.errorOccurred(msg);
				});
			} else {
				// Don't run.
				this.permissionDenied(msg);
			}
		}).catch(() => {
			this.errorOccurred(msg);
		});
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
		const connections = this.client.voiceConnections.filter((v) => v.voiceChannel.server.equals(server));

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
		this.client.reply(channel, 'I don\'t recognize your authority.');
	}

	/*
	 * Sends a message saying something went wrong.
	 *
	 * @param chanel A channel resolvable.
	 */
	errorOccurred(channel) {
		this.client.sendMessage(channel, 'My creator is an idiot. Something went wrong!');
	}

}
