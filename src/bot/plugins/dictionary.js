import { Plugin, Command, Util } from 'plugin';

export default class extends Plugin {

	*init() {
		this.addCommand('define', Define);
		this.addCommand('chdef', ChDef);
	}

}

class Define extends Command {

	get usage() { return '<phrase>'; }
	get description() { return 'define something!'; }

	*authorize(msg, suffix) {
		// Everyone is allowed to look for definitions.
		return true;
	}

	*process(msg, suffix) {
		this.client.sendMessage(msg, 'no');
	}

}

class ChDef extends Command {

	get usage() { return '<phrase>'; }
	get description() { return 'change the definition of something!'; }

	*authorize(msg, suffix) {
		return Util.checkRole(msg.server, msg.author, this.config.COMMANDER); // Must be a commander.
	}

	*process(msg, suffix) {
		this.client.sendMessage(msg, 'k');
	}

}
