import { Plugin, Command } from 'plugin';

export default class extends Plugin {

	init() {
		this.addCommand('say', Say);
	}

}

class Say extends Command {

	get usage() { return '<text>'; }
	get description() { return 'make me say something'; }

	authorize(msg, suffix, next) {
		// Everyone is allowed to make RM-C say something.
		next(true);
	}

	process(msg, suffix) {
		// Make sure there actually is a message.
		if (!suffix) return this.client.reply(msg, 'Hurry up and tell me what to say already.');

		this.client.sendMessage(msg, suffix, () => {
			// Delete the original message.
			this.client.deleteMessage(msg);
		});
	}

}
