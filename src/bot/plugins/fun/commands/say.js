import { Command } from 'plugin';

export default class Say extends Command {

	get usage() { return '<text>'; }
	get description() { return 'make me say something'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		// Everyone is allowed to make RM-C say something.
		return true;
	}

	*process(msg, suffix) {
		// Make sure there actually is a message.
		if (!suffix) return this.client.reply(msg, 'Hurry up and tell me what to say already.');

		// Send the message.
		this.client.sendMessage(msg, suffix);

		// Delete the original message.
		this.client.deleteMessage(msg);
	}

}
