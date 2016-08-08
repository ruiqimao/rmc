const Plugin = require('plugin').Plugin;

class Voice extends Plugin {

	*init() {
		this.addCommand('join', require('./commands/join'));
		this.addCommand('leave', require('./commands/leave'));
	}

}

module.exports = Voice;
