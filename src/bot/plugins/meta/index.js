const Plugin = require('plugin').Plugin;

class Meta extends Plugin {

	*init() {
		this.addCommand('help', require('./commands/help'));
	}

}

module.exports = Meta;
