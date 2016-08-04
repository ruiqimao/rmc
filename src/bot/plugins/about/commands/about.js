import { Command } from 'plugin';

const ABOUT =
	`I'm "Ruinous Might Cannon Type", or otherwise known as "RM-C". I was made by Ernesta Kuhne (read: Ruiqi Mao) and if you piss me off, I'll seriously hurt you. <3`;

export default class About extends Command {

	get usage() { return ''; }
	get description() { return 'about me!'; }

	*init() {
		// Create the model for about text.
		this.About = this.createModel('about-text');
	}

	*authorize(msg, suffix) {
		// Everyone is allowed ask about RM-C.
		return true;
	}

	*process(msg, suffix) {
		const text = (yield this.About.getEntry(msg.server.id, ABOUT)).val();
		this.client.sendMessage(msg, text);
	}

	*getData(id) {
		// Return the about text.
		return (yield this.About.getEntry(id, ABOUT)).val();
	}

	*saveData(id, data) {
		// Save the about text.
		const entry = yield this.About.getEntry(id, ABOUT);
		entry.val(data.trim());
		yield entry.save();
	}

}
