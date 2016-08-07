import { Command, Util } from 'plugin';

export default class RSS extends Command {

	get usage() { return '<feed URL>'; }
	get description() { return 'start an RSS feed'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		const commander = (yield this.bot.Commander.getEntry(msg.server.id, '')).val();
		return Util.checkRole(msg.server, msg.author, commander); // Must be a commander.
	}

	*process(msg, suffix) {
		// Check if the suffix is empty.
		if (suffix.length == 0) {
			return this.client.reply(msg, 'Give me a feed to read, idiot.');
		}

		// Create a new Feed.
		const feed = new this.plugin.Feed({
			server: msg.server.id,
			feed: suffix,
			channel: msg.channel.id,
			lastGUID: '',
			refresh: 5,
			running: false
		});
		yield feed.save();

		yield this.client.sendMessage(msg, 'Okay, I\'ve started an RSS feed!');

		// Start the feed.
		this.plugin.startFeed(feed);
	}

}
