import { Command, Util } from 'plugin';

export default class Profile extends Command {

	get usage() { return '<user>'; }
	get description() { return 'get a user\'s profile'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		// Everyone is allowed to check profiles.
		return true;
	}

	*process(msg, suffix) {
		// Make sure the suffix isn't empty.
		if (suffix.length == 0) {
			return this.client.reply(msg, 'Yeah I\'d do that for you... if you actually gave me someone to look up. Dumbass.');
		}

		// Get the user mentioned.
		const user = this.getUserFromMention(suffix);
		if (user === null) {
			return this.client.reply(msg, 'I dunno who that is... too bad.');
		}

		// Get the user's info in the server.
		const details = msg.server.detailsOfUser(user);

		// Get the message count.
		let count = 0;
		const entries = yield this.plugin.MessageCount.find({
			'server': msg.server.id,
			'author': user.id
		});
		if (entries[0]) count = entries[0].get('count');

		// Construct the response.
		let response = '**@' + (details.nick || user.username) + '**';
		if (user.bot) response += ' (Bot)';
		response += ':\n';
		response += 'ID: ' + user.id + '\n';
		response += 'Username: ' + user.username + '\n';
		if (details.nick) response += 'Nickname: ' + details.nick + '\n';
		response += 'Avatar: ' + user.avatarURL + '\n';
		if (details.roles) response += 'Roles: ' + details.roles.map(role => role.name).join(', ') + '\n',
		response += 'Messages: ' + count;

		// Respond.
		this.client.sendMessage(msg, response);
	}

}
