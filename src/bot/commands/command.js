/*
 * Class for Command.
 */
export default class Command {

	/*
	 * Constructor.
	 *
	 * @param client The Discord client.
	 * @param config The configuration.
	 */
	constructor(client, config) {
		// Assign the member variables.
		this.client = client;
		this.config = config;

		// Make sure the proper virtual methods exist.
		if (this.usage === undefined)       throw new TypeError('Must have a usage.');
		if (this.description === undefined) throw new TypeError('Must have a description.');
		if (this.authorize === undefined)   throw new TypeError('Must implement authorize().');
		if (this.process === undefined)     throw new TypeError('Must implement process().');

		// Call init() if it exists.
		if (this.init) this.init();
	}

	/*
	 * Run the command.
	 *
	 * @param msg The message that triggered the command.
	 * @param suffix The suffix of the command.
	 */
	run(msg, suffix) {
		// Check permissions.
		this.authorize(msg, suffix, (allowed) => {
			if (allowed) {
				// Run.
				this.process(msg, suffix);
			} else {
				// Don't run.
				this.permissionDenied(msg);
			}
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

/*
 * Other utilities.
 */
export class Util {

	/*
	 * Check whether a message is affirmative.
	 *
	 * @param msg The string contents of the message.
	 *
	 * @return Whether the message is affirmative.
	 */
	static checkAffirmative(msg) {
		const affirmativeWords = [
			'yes', 'yeah', 'sure', 'of course', 'mhmm', 'okay', 'ok', 'y', 'yep', 'yea',
			'oh yes', 'hell yeah', 'hell yea', 'no shit'
		];

		// Set the message to lowercase and trim it.
		msg = msg.toLowerCase().trim();

		// Get whether the message is affirmative.
		return affirmativeWords.indexOf(msg) != -1;
	}

	/*
	 * Check if a user has a given permission.
	 *
	 * @param channel A channel.
	 * @param user A user.
	 * @param permission The permission to check.
	 *
	 * @return Whether the user has permission.
	 */
	static checkPermission(channel, user, permission) {
		// If the channel is private, all permissions are granted.
		if (channel.isPrivate) return true;

		// Get whether the user has permission.
		return channel.permissionsOf(user).hasPermission(permission);
	}

	/*
	 * Check if a user has a given role.
	 *
	 * @param server A server.
	 * @param user A user.
	 * @param role The role to check.
	 *
	 * @return Whether the user has the role.
	 */
	static checkRole(server, user, role) {
		// If the channel is private, all permissions are granted.
		if (!server) return true;

		// Get whether the user has the role.
		return server.rolesOfUser(user).reduce((p, c, i) => p || c.name == role, false);
	}

}
