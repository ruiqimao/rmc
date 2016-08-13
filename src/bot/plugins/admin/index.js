const Plugin = require('plugin').Plugin;
const Util = require('plugin').Util;

const LOG_PURGE = 6 * 60 * 60 * 1000; // Purge the logs every 6 hours. Cannot be changed.

class Admin extends Plugin {

	*init() {
		this.addCommand('purge', require('./commands/purge'));

		// Listen for all events.
		this.log = this.log.bind(this);
		this.client.on('message', this.log('message'));
		this.client.on('messageDeleted', this.log('message deleted'));
		this.client.on('messageUpdated', this.log('message updated'));
		this.client.on('serverNewMember', this.log('user new'));
		this.client.on('serverMemberRemoved', this.log('user removed'));
		this.client.on('serverMemberUpdated', this.log('user updated'));
		this.client.on('userBanned', this.log('user banned'));
		this.client.on('userUnbanned', this.log('user unbanned'));

		// Set a timer to purge the logs.
		setInterval(this.purge.bind(this), LOG_PURGE);

		// Create a model to store logs.
		this.Log = this.createModel('admin-log');
	}

	*getData(id) {
		// Get all logs from within the last purge period.
		const logs = (yield this.Log.sort('timestamp', -1).find({
			'data.server.id': id,
			timestamp: { $gte: new Date().getTime() - LOG_PURGE }
		})).map(entry => ({
			type: entry.get('type'),
			timestamp: entry.get('timestamp'),
			data: entry.get('data')
		}));

		// Return the data.
		return {
			logs: logs
		};
	}

	/*
	 * Create a log.
	 */
	log(type) {
		return function() {
			// Create a new log.
			const log = new this.Log({
				timestamp: new Date().getTime(),
				type: type
			});

			// Log information accordingly.
			const data = {};
			switch (type) {
				case 'message': {
					const message = arguments[0];
					// Ignore if PM.
					if (message.channel.isPrivate) return;

					data.message = Util.serializeMessage(message);
					data.user = Util.serializeUser(message.author);
					data.channel = Util.serializeServerChannel(message.channel);
					data.server = Util.serializeServer(message.server);
				} break;

				case 'message deleted': {
					const message = arguments[0];
					// Ignore if message is null.
					if (message === null) return;

					data.message = Util.serializeMessage(message);
					data.user = Util.serializeUser(message.author);
					data.channel = Util.serializeServerChannel(message.channel);
					data.server = Util.serializeServer(message.server);
				} break;

				case 'message updated': {
					const old = arguments[0];
					const updated = arguments[1];
					// Ignore if PM.
					if (old.channel.isPrivate) return;

					data.old = Util.serializeMessage(old);
					data.updated = Util.serializeMessage(updated);
					data.user = Util.serializeUser(old.author);
					data.channel = Util.serializeServerChannel(old.channel);
					data.server = Util.serializeServer(old.server);
				} break;

				case 'user new': {
					const server = arguments[0];
					const user = arguments[1];
					data.user = Util.serializeUser(user);
					data.server = Util.serializeServer(server);
				} break;

				case 'user removed': {
					const server = arguments[0];
					const user = arguments[1];
					data.user = Util.serializeUser(user);
					data.server = Util.serializeServer(server);
				} break;

				case 'user updated': {
					const server = arguments[0];
					const old = arguments[1];
					const updated = arguments[2];
					data.old = Util.serializeUser(old);
					data.updated = Util.serializeUser(updated);
					data.server = Util.serializeServer(server);
				} break;

				case 'user banned': {
					const user = arguments[0];
					const server = arguments[1];
					data.user = Util.serializeUser(user);
					data.server = Util.serializeServer(server);
				} break;

				case 'user unbanned': {
					const user = arguments[0];
					const server = arguments[1];
					data.user = Util.serializeUser(user);
					data.server = Util.serializeServer(server);
				} break;
			}

			// Save the log.
			log.set('data', data);
			log.save();
		}.bind(this);
	}

	/*
	 * Purges logs.
	 */
	purge() {
		// Find all logs outside the purge period and remov them.
		const now = new Date().getTime();
		this.Log.remove({
			timestamp: { $lt: now - LOG_PURGE }
		}).catch(err => {});
	}

}

module.exports = Admin;
