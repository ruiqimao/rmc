const Command = require('plugin').Command;
const Util = require('plugin').Util;

class ClearRSS extends Command {

	get usage() { return ''; }
	get description() { return 'remove all RSS feeds on this channel'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		const commander = (yield this.bot.Commander.getEntry(msg.server.id, '')).val();
		return Util.checkRole(msg.server, msg.author, commander); // Must be a commander.
	}

	*process(msg, suffix) {
		// Get all Feeds in the channel.
		const entries = yield this.plugin.Feed.find({
			channel: msg.channel.id
		});

		// Stop all of them and remove them.
		for (const entry of entries) {
			this.plugin.stopFeed(entry);
			yield entry.remove();
		}

		this.client.sendMessage(msg, 'Okay, all RSS feeds have been cleared!');
	}

}

module.exports = ClearRSS;
