const Command = require('plugin').Command;

const RESPONSES = [
	'Don\'t touch me.',
	'No.',
	'Stop it.',
	'Why?',
	'Get away from me.',
	'I hate you.',
	'Do you want to die?',
	'I\'ll seriously get angry!'
];

class Slap extends Command {

	get usage() { return ''; }
	get description() { return 'slap me for being a bad robot :('; }

	*init() {
		this.Responses = this.createModel('interact-slap-responses');
	}

	*authorize(msg, suffix) {
		// Everyone is allowed to slap RM-C.
		return true;
	}

	*process(msg, suffix) {
		// Respond with a random message.
		const responses = (yield this.Responses.getEntry(msg.server.id, RESPONSES)).val();
		const index = Math.floor(Math.random() * responses.length);
		this.client.sendMessage(msg, responses[index]);
	}

	*getData(id) {
		// Return the responses.
		const data = (yield this.Responses.getEntry(id, RESPONSES)).val();

		return data;
	}

	*saveData(id, data) {
		// Get the responses.
		const responses = yield this.Responses.getEntry(id, RESPONSES);

		// Remove empty responses.
		data = data.filter(response => response.trim().length > 0);
		responses.val(data);

		// Save.
		yield responses.save();
	}

}

module.exports = Slap;
