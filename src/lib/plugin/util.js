/*
 * Utilities.
 */
class Util {

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

		// Check if the role is a resolvable that matches.
		try {
			if (user.hasRole(role)) return true;
		} catch (e) { }

		// Get whether the user has a role with the given name.
		return server.rolesOfUser(user).reduce((p, c, i) => p || c.name == role, false);
	}

	/*
	 * Serializing functions.
	 */
	static serializeServer(server) {
		return {
			id: server.id,
			name: server.name
		};
	}
	static serializeUser(user) {
		return {
			id: user.id,
			name: user.name
		};
	}
	static serializeMessage(message) {
		return {
			id: message.id,
			content: message.cleanContent
		};
	}
	static serializeServerChannel(channel) {
		return {
			id: channel.id,
			name: channel.name
		};
	}
	static serializeRole(role) {
		return {
			id: role.id,
			name: role.name,
			permissions: role.serialize()
		};
	}

}

module.exports = Util;
