const Command = require('plugin').Command;

class Source extends Command {

	get usage() { return ''; }
	get description() { return 'see my source code'; }

	*init() {
		// Source code URL.
		this.SOURCE = 'https://github.com/ruiqimao/rmc';
	}

	*authorize(msg, suffix) {
		// Everyone is allowed to see the source.
		return true;
	}

	*process(msg, suffix) {
		this.client.sendMessage(msg, this.SOURCE);
	}

}

module.exports = Source;
