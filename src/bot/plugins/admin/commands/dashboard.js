import { Command, Util } from 'plugin';

import Crypto from 'crypto';

export default class Dashboard extends Command {

	get usage() { return '[generate]'; }
	get description() { return 'View the admin dashboard or regenerate the link for one.'; }

	*authorize(msg, suffix) {
		const allowed =
			!msg.channel.isPrivate && // Cannot be a PM.
			Util.checkPermission(msg.channel, msg.author, 'administrator'); // Must be an admin.
		return allowed;
	}

	*process(msg, suffix) {
		// Check if the user is requesting to generate a new dashboard.
		if (suffix == 'generate') {
			// Generate a new dashboard.
			let dashboard;
			const dashboards = yield this.plugin.Dash.limit(1).find({
				'server': msg.server.id
			});
			if (dashboards.length > 0) {
				dashboard = dashboards[0];
			} else {
				dashboard = new this.plugin.Dash({
					'server': msg.server.id
				});
			}

			// Generate the new token.
			const token = Crypto
				.createHash('md5')
				.update(msg.server.id + '' + Math.floor(Math.random() * 65535))
				.digest('hex');

			// Set the new token and save it.
			dashboard.set('token', token);
			yield dashboard.save();

			// Let the user know the new dashboard link in a PM.
			this.client.sendMessage(msg.author, this.config.DASHBOARD_URL + '/' + token);
			this.client.sendMessage(msg, 'Check your PMs.');

			return;
		}

		// Get the dashboard token.
		let token;
		const dashboards = yield this.plugin.Dash.limit(1).find({
			'server': msg.server.id
		});
		if (dashboards.length > 0) {
			// Dashboard exists, so get the token.
			token = dashboards[0].get('token');
		} else {
			// Dashboard doesn't exist, so create one.
			const dashboard = new this.plugin.Dash({
				'server': msg.server.id
			});

			// Generate the new token.
			token = Crypto
				.createHash('md5')
				.update(msg.server.id + '' + Math.floor(Math.random() * 65535))
				.digest('hex');

			// Set the dashboard and save.
			dashboard.set('token', token);
			yield dashboard.save();
		}

		// Let the user know the dashboard link in a PM.
		this.client.sendMessage(msg.author, this.config.DASHBOARD_URL + '/' + token);
		this.client.sendMessage(msg, 'Check your PMs.');
	}

}
