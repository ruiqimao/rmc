const Command = require('plugin').Command;
const Util = require('plugin').Util;

const Crypto = require('crypto');

class Dashboard extends Command {

	get usage() { return '[generate]'; }
	get description() { return 'View the admin dashboard or regenerate the link for one.'; }

	*authorize(msg, suffix) {
		const allowed =
			!msg.channel.isPrivate && // Cannot be a PM.
			Util.checkPermission(msg.channel, msg.author, 'administrator'); // Must be an admin.
		return allowed;
	}

	*process(msg, suffix) {
		// Get the dashboard.
		const dashboard = yield this.plugin.Dash.getEntry(msg.server.id, null);

		// Check if the user is requesting to generate a new dashboard.
		if (suffix == 'generate') {
			// Generate the new token and save it.
			dashboard.val(this.generateRandomToken(msg.server.id));
			yield dashboard.save();
		}

		// Get the dashboard token.
		let token;
		if (dashboard.val() !== null) {
			// Dashboard exists, so get the token.
			token = dashboard.val();
		} else {
			// Dashboard doesn't exist, so create one.
			token = this.generateRandomToken(msg.server.id);

			// Set the dashboard and save.
			dashboard.val(token);
			yield dashboard.save();
		}

		// Let the user know the dashboard link in a PM.
		this.client.sendMessage(msg.author, this.config.SERVER_URL + '/dashboard/' + token);
		this.client.sendMessage(msg, 'Check your PMs.');
	}

	/*
	 * Generate a new random token.
	 *
	 * @param id The server id.
	 *
	 * @return The random token.
	 */
	generateRandomToken(id) {
		return Crypto
			.createHash('md5')
			.update(id + Crypto.randomBytes(128).toString('hex'))
			.digest('hex');
	}

}

module.exports = Dashboard;
