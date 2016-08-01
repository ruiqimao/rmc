import { Command } from 'plugin';

export default class Pet extends Command {

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
