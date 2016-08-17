const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Ban extends Command {

	get usage() { return '<user>'; }
	get description() { return 'ban a user'; }

	*init() {
		// Create a model for bans.
		this.Ban = this.createModel('admin-ban');
	}

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		const commander = (yield this.bot.Commander.getEntry(msg.server.id, '')).val();
		return Util.checkRole(msg.server, msg.author, commander); // Must be a commander.
	}

	*process(msg, suffix) {
		// Check if any users were mentioned.
		if (msg.mentions.length === 0) {
			return this.client.reply(msg, 'You gotta tell me who to ban, dumbass.');
		}

		// Get the user to ban.
		const user = msg.mentions[0];

		// Make sure the user is actually in the server.
		if (msg.server.members.get('id', user.id) === null) return this.client.reply(msg, 'Who\'s that?');

		// Ask for the reason.
		const response = yield this.client.awaitResponse(msg, 'Okay, why?');

		// Ban the user.
		yield this.client.banMember(user, msg.server);

		// Save the ban log.
		const entry = new this.Ban({
			'server': msg.server.id,
			'user': user.id,
			'name': user.name,
			'banner': msg.author.id,
			'bannerName': msg.author.name,
			'reason': response.content,
			'timestamp': new Date().getTime()
		});
		yield entry.save();

		// Send a message.
		this.client.sendMessage(
			msg.server,
			'**@' + user.name +
			'** was banned by **@' + msg.author.name +
			'** for the reason ```' + response.content + '```');
	}

	*getData(id) {
		// Get last 100 bans in the server.
		const entries = yield this.Ban.limit(100).sort('timestamp', -1).find({
			'server': id
		});

		// Return the data.
		return entries.map(entry => ({
			user: entry.get('user'),
			name: entry.get('name'),
			banner: entry.get('banner'),
			bannerName: entry.get('bannerName'),
			reason: entry.get('reason'),
			timestamp: entry.get('timestamp')
		}));
	}

}

module.exports = Ban;
