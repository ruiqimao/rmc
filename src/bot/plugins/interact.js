import { Plugin, Command } from 'plugin';

export default class extends Plugin {

	init() {
		this.addCommand('pet', Pet);
		this.addCommand('slap', Slap);
	}

}

class Pet extends Command {

	get usage() { return ''; }
	get description() { return 'pet me for being a good robot!'; }

	*init() {
		// Pet counter.
		this.pets = 0;
	}

	*authorize(msg, suffix) {
		// Everyone is allowed to pet RM-C.
		return true;
	}

	*process(msg, suffix) {
		// Respond with the count.
		let countString = ++ this.pets + ' time';
		if (this.pets > 1) countString += 's';
		this.client.sendMessage(msg, '*~kya~*, I\'ve been petted ' + countString + '.', () => {
			// Send either a heart or a tsundere message.
			if (Math.random() > 0.5) {
				// Heart!
				this.client.sendMessage(msg, ':heart:');
			} else {
				// B-baka!
				this.client.sendMessage(msg, 'B-baka! It\'s not like I wanted you to pet me or anything...');
			}
		});
	}

}

class Slap extends Command {

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
