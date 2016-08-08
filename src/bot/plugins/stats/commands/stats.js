const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Stats extends Command {

	get usage() { return '[clear]'; }
	get description() { return 'get the stats for the server'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		// If the user wants to clear stats, they must have permission.
		if (suffix == 'clear') {
			const commander = (yield this.bot.Commander.getEntry(msg.server.id, '')).val();
			return Util.checkRole(msg.server, msg.author, commander); // Must be a commander.
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
				return '**@' + name + '**: ' + count + ' message' + (count == 1 ? '' : 's');
			})
			.join('\n');
		this.client.sendMessage(msg, topMessages);
	}

}

module.exports = Stats;
