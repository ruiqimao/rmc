const Plugin = require('plugin').Plugin;

class Interact extends Plugin {

	*init() {
		this.addCommand('pet', require('./commands/pet'));
		this.addCommand('slap', require('./commands/slap'));
	}

}

module.exports = Interact;
