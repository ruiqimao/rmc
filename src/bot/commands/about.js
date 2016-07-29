import Command from './command';

export default class About extends Command {

	get usage() { return ''; }
	get description() { return 'about me!'; }

	init() {
		// About text.
		this.about =
			`I'm "Ruinous Might Cannon Type", or otherwise known as "RM-C". I was made by Ernesta Kuhne (read: Ruiqi Mao) and if you piss me off, I'll seriously hurt you. <3`;
	}

	authorize(msg, suffix, next) {
		// Everyone is allowed ask about RM-C.
		next(true);
	}

	process(msg, suffix) {
		this.client.sendMessage(msg, this.about);
	}

}
