import { Plugin, Command, Util } from 'plugin';

import co from 'co';

export default class extends Plugin {

	*init() {
		this.addCommand('stats', Stats);

		// Create a class for message counts.
		this.MessageCount = this.createModel('messagecount');

		// Listen for messages.
		this.client.on('message', (msg) => {
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

class Stats extends Command {

	get usage() { return '[clear]'; }
	get description() { return 'get the stats for the server'; }

	*authorize(msg, suffix) {
		// If the user wants to clear stats, they must have permission.
		if (suffix == 'clear') {
			return Util.checkPermission(msg.channel, msg.author, 'manageMessages');
		}

		// Everyone is allowed to look at stats.
		return true;
	}

	*process(msg, suffix) {
		// Get the suffix.
		if (suffix == 'clear') {
			// Clear the stats.
			yield this.plugin.MessageCount.remove({
				'server': msg.server.id
			});

			// Send a confirmation message.
			this.client.sendMessage(msg, 'Stats cleared!');

			return;
		}

		// Get the top 20 people.
		const counters = yield this.plugin.MessageCount.sort('count', -1).limit(20).find({
			'server': msg.server.id
		});

		// Output the top 20 people.
		let topMessages = '**Active Members:**\n';
		topMessages += counters
			.map((c) => {
				const count = c.get('count');
				const user = this.client.users.get('id', c.get('author'));
				const userDetails = msg.server.detailsOfUser(user);
				const name = (userDetails.nick === null ? user.username : userDetails.nick);
				return '`' + name + '`: ' + count + ' message' + (count == 1 ? '' : 's')
			})
			.join('\n');
		this.client.sendMessage(msg, topMessages);
	}

}
