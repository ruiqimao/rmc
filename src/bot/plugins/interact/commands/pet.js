import { Command } from 'plugin';

const RESPONSES = [
	':heart:',
	'B-baka! It\'s not like I wanted you to pet me or anything...'
];

export default class Pet extends Command {

	get usage() { return ''; }
	get description() { return 'pet me for being a good robot!'; }

	*init() {
		// Pet counter model and response model.
		this.Pets = this.createModel('interact-pets');
		this.Responses = this.createModel('interact-pet-responses');
	}

	*authorize(msg, suffix) {
		// Everyone is allowed to pet RM-C.
		return true;
	}

	*process(msg, suffix) {
		// Get the current count.
		let count = yield this.Pets.getEntry(msg.server.id, 0);

		// Increment the count and save.
		count.val(count.val() + 1);
		yield count.save();

		// Respond with the count.
		let countString = count.val() + ' time';
		if (count.val() > 1) countString += 's';
		yield this.client.sendMessage(msg, '*~kya~*, I\'ve been petted ' + countString + '.');

		// Send a random response.
		const responses = (yield this.Responses.getEntry(msg.server.id, RESPONSES)).val();
		if (responses.length == 0) return; // Don't do anything if there are no responses.
		const index = Math.floor(Math.random() * responses.length);
		this.client.sendMessage(msg, responses[index]);
	}

	*getData(id) {
		const data = {};

		// Return the pets and responses.
		data.count = (yield this.Pets.getEntry(id, 0)).val();
		data.responses = (yield this.Responses.getEntry(id, RESPONSES)).val();

		return data;
	}

	*saveData(id, data) {
		// Get the pets and responses.
		const pets = yield this.Pets.getEntry(id, 0);
		const responses = yield this.Responses.getEntry(id, RESPONSES);

		// Validate the pet count.
		if (!isNaN(data.count)) pets.val(parseInt(data.count));

		// Remove empty responses.
		data.responses = data.responses.filter(response => response.trim().length > 0);
		responses.val(data.responses);

		// Save.
		yield pets.save();
		yield responses.save();
	}

}
