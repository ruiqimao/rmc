import { Command } from 'plugin';

export default class Slap extends Command {

	get usage() { return ''; }
	get description() { return 'slap me for being a bad robot :('; }

	*init() {
		// Any of the responses RM-C can give when slapped.
		this.responses = [
			'Don\'t touch me.',
			'No.',
			'Stop it.',
			'Why?',
			'Get away from me.',
			'I hate you.',
			'Do you want to die?',
			'I\'ll seriously get angry!'
		];
	}

	*authorize(msg, suffix) {
		// Everyone is allowed to slap RM-C.
		return true;
	}

	*process(msg, suffix) {
		// Respond with a random message.
		const index = Math.floor(Math.random() * this.responses.length);
		this.client.sendMessage(msg, this.responses[index]);
	}

}
