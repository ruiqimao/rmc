import { Plugin } from 'plugin';

import Stats from './commands/stats';

import co from 'co';

export default class extends Plugin {

	*init() {
		this.addCommand('stats', Stats);

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

}
