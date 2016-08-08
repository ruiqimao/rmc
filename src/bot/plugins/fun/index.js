const Plugin = require('plugin').Plugin;

class Fun extends Plugin {

	*init() {
		this.addCommand('choose', require('./commands/choose'));
		this.addCommand('picture', require('./commands/picture'));
		this.addCommand('say', require('./commands/say'));
	}

}

module.exports = Fun;
