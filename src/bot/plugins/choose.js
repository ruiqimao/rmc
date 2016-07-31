import { Plugin, Command } from 'plugin';

export default class extends Plugin {

	*init() {
		this.addCommand('choose', Choose);
	}

}

class Choose extends Command {

	get usage() { return '<choice1>;[choice2];...'; }
	get description() { return 'randomly choose something'; }

	*authorize(msg, suffix, next) {
		// Everyone is allowed to use choose.
		return true;
	}

	*process(msg, suffix) {
		// Get all the choices and weed out the blank ones.
		const choices = suffix.split(';').map((c) => c.trim()).filter((c) => c.length > 0);

		// Make sure there is at least one choice.
		if (choices.length == 0) {
			this.client.reply(msg, 'You have to give me at least one choice, idiot.');
			return;
		}

		// Generate a random number and turn it into an index.
		const index = Math.floor(Math.random() * choices.length);

		// Return the choice.
		this.client.sendMessage(msg, choices[index]);
	}

}
