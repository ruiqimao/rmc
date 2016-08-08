const Plugin = require('plugin').Plugin;

class About extends Plugin {

	*init() {
		this.addCommand('about', require('./commands/about'));
		this.addCommand('source', require('./commands/source'));
		this.addCommand('uptime', require('./commands/uptime'));
	}

}

module.exports = About;
