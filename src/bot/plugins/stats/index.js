import { Plugin } from 'plugin';

import Stats from './commands/stats';
import Profile from './commands/profile';

import co from 'co';

export default class extends Plugin {

	*init() {
		this.addCommand('stats', Stats);
		this.addCommand('profile', Profile);

		// Create a class for message counts.
		this.MessageCount = this.createModel('messagecount');

		// Listen for messages.
		this.client.on('message', (msg) => {
			// Ignore if the message is private.
			if (msg.channel.isPrivate) return;

			co(this.incrementMessageCount.bind(this), msg);
		});
	}

	/*
	 * Increment message count.
	 *
	 * @param The message that triggered the counter.
	 */
	*incrementMessageCount(msg) {
		// Get the message count for the author.
		let count;
		const counters = yield this.MessageCount.limit(1).find({
			'server': msg.server.id,
			'author': msg.author.id
		});
		if (counters.length > 0) {
			count = counters[0];
		} else {
			count = new this.MessageCount({
				'server': msg.server.id,
				'author': msg.author.id,
				'count': 0
			});
		}

		// Increment the count.
		count.set('count', count.get('count') + 1);

		// Save the counter.
		yield count.save();
	}

	*getData(id) {
		// Get the server.
		const server = this.client.servers.get('id', id);

		// Get all the users from the server.
		const users = server.members;

		// Get all message counts.
		const messageCounts = yield this.MessageCount.find({
			'server': id
		});
		const counts = {};
		for (const count of messageCounts) {
			counts[count.get('author')] = count.get('count');
		}

		// Create a list of results.
		const results = [];

		// Iterate through all the users.
		for (const user of users) {
			const details = server.detailsOfUser(user);
			const result = {
				id: user.id,
				username: user.username,
				nick: details.nick,
				avatar: user.avatarURL,
				messages: 0,
				bot: user.bot
			};

			if (counts[user.id] !== undefined) result.messages = counts[user.id];

			// Add to the results.
			results.push(result);
		}

		// Return the sorted results (by message count).
		return results.sort((a, b) => b.messages - a.messages);
	}

}
