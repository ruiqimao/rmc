const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Kick extends Command {

	get usage() { return '<user>'; }
	get description() { return 'kick a user'; }

	*init() {
		// Create a model for kicks.
		this.Kick = this.createModel('admin-kick');
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
			return this.client.reply(msg, 'You gotta tell me who to kick, you numbnut.');
		}

		// Get the user to kick.
		const user = msg.mentions[0];

		// Make sure the user is actually in the server.
		if (msg.server.members.get('id', user.id) === null) return this.client.reply(msg, 'Who\'s that?');

		// Ask for the reason.
		const response = yield this.client.awaitResponse(msg, 'Okay, why?');

		// Kick the user.
		yield this.client.kickMember(user, msg.server);

		// Save the kick log.
		const entry = new this.Kick({
			'server': msg.server.id,
			'user': user.id,
			'name': user.name,
			'kicker': msg.author.id,
			'kickerName': msg.author.name,
			'reason': response.content,
			'timestamp': new Date().getTime()
		});
		yield entry.save();

		// Send a message.
		this.client.sendMessage(
			msg.server,
			'**@' + user.name +
			'** was kicked by **@' + msg.author.name +
			'** for the reason ```' + response.content + '```');
	}

	*getData(id) {
		// Get last 100 kicks in the server.
		const entries = yield this.Kick.limit(100).sort('timestamp', -1).find({
			'server': id
		});

		// Return the data.
		return entries.map(entry => ({
			user: entry.get('user'),
			name: entry.get('name'),
			kicker: entry.get('kicker'),
			kickerName: entry.get('kickerName'),
			reason: entry.get('reason'),
			timestamp: entry.get('timestamp')
		}));
	}

}

module.exports = Kick;
