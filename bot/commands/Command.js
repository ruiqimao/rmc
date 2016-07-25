'use strict';

let AFFIRMATIVE_WORDS = [
	'yes', 'yeah', 'sure', 'of course', 'mhmm', 'okay', 'ok', 'y', 'yep', 'yea',
	'oh yes', 'hell yeah', 'hell yea', 'no shit'
];

/*
 * Prototype for Command object.
 */
class Command {

	/*
	 * Constructor.
	 *
	 * @param props The properties of the command. Should contain:
	 *                - usage: String: The usage string for the command.
	 *                - description: String: The description for the command.
	 *                - authorize: function(client, msg, suffix, next): The function to call
	 *                                                                  to ensure the user is
	 *                                                                  authorized.
	 *                - process: function(client, msg, suffix): The function to be called
	 *                                                          when the command is run.
	 */
	constructor(props) {
		this.usage = props.usage;
		this.description = props.description;
		this.authorize = props.authorize;
		this.process = props.process;
	}

	/*
	 * Runs the command.
	 *
	 * @param client The Discord client.
	 * @param msg The message that triggered the command.
	 * @param suffix The suffix of the command.
	 */
	run(client, msg, suffix) {
		// Check permissions.
		this.authorize(client, msg, suffix, function(allowed) {
			if (allowed) {
				// Run.
				this.process(client, msg, suffix);
			} else {
				// Don't run.
				Command.permissionDenied(client, msg);
			}
		}.bind(this));
	}

	/*
	 * Check whether a message is affirmative.
	 *
	 * @param msg The string contents of the message.
	 *
	 * @return Whether the message is affirmative.
	 */
	static checkAffirmative(msg) {
		// Set the message to lowercase and trim it.
		msg = msg.toLowerCase().trim();

		// Get whether the message is affirmative.
		return AFFIRMATIVE_WORDS.indexOf(msg) != -1;
	}


	/*
	 * Check if a user has a given permission.
	 *
	 * @param msg The message that triggered the command.
	 * @param permission The permission to check.
	 *
	 * @return Whether the user has permission.
	 */
	static checkPermission(msg, permission) {
		// If the channel is private, all permissions are granted.
		if (msg.channel.isPrivate) return true;

		// Get whether the user has permission.
		return msg.channel.permissionsOf(msg.author).hasPermission(permission);
	}

	/*
	 * Check if a user has a given role.
	 *
	 * @param msg The message that triggered the command.
	 * @param role The role to check.
	 *
	 * @return Whether the user has the role.
	 */
	static checkRole(msg, role) {
		// If the channel is private, all permissions are granted.
		if (msg.channel.isPrivate) return true;

		// Get whether the user has the role.
		return msg.server.rolesOfUser(msg.author).reduce((p, c, i) => p || c.name == role, false);
	}

	/*
	 * Get the voice connection RM-C is connected to.
	 *
	 * @param client The Discord client.
	 * @param msg The message that triggered the command.
	 *
	 * @return The voice connection associated with the server, null if it doesn't exist.
	 */
	static getVoiceConnection(client, msg) {
		// Get all connections associated with the server.
		var connections = client.voiceConnections.filter((v) => v.voiceChannel.server.equals(msg.server));

		// Return the connection.
		if (connections.length == 0) return null;
		return connections[0];
	}

	/*
	 * Sends a permission denied reply.
	 *
	 * @param client The Discord client.
	 * @param msg The message that triggered the command.
	 */
	static permissionDenied(client, msg) {
		client.reply(msg, 'I don\'t recognize your authority.');
	}

	/*
	 * Sends a message saying something went wrong.
	 *
	 * @param client The Discord client.
	 * @param msg The message that triggered the command.
	 */
	static errorOccurred(client, msg) {
		client.sendMessage(msg, 'My creator is an idiot. Something went wrong!');
	}
}

module.exports = Command;
