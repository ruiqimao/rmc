const Command = require('plugin').Command;
const Util = require('plugin').Util;

class ChangeDef extends Command {

	get usage() { return '<phrase>'; }
	get description() { return 'change the definition of something!'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		const commander = (yield this.bot.Commander.getEntry(msg.server.id, '')).val();
		return Util.checkRole(msg.server, msg.author, commander); // Must be a commander.
	}

	*process(msg, suffix) {
		// Check if the suffix exists.
		if (suffix.length == 0) return this.client.reply(msg, 'I can\'t change the definition of nothing, idiot.');

		// Look for a custom definition.
		const definitions = yield this.plugin.Definition.limit(1).find({
			'phrase': suffix.toLowerCase(),
			'server': msg.server.id
		});

		// Get a definition to change.
		let definition;
		if (definitions.length > 0) {
			// If there is a custom definition, use it.
			definition = definitions[0];
		} else {
			// Otherwise, create a new one.
			definition = new this.plugin.Definition({
				'phrase': suffix.toLowerCase(),
				'server': msg.server.id
			});
		}

		// Ask for a definition.
		const response = yield this.client.awaitResponse(msg, 'Okay, what do you want me to change the definition of `' + suffix + '` to? Say "nvm" if you change your mind!');
		if (response.content == 'nvm') {
			// If the response is empty, don't change the definition.
			return this.client.sendMessage(msg, 'Okay, I won\'t touch the definition!');
		}

		// Change and save the definition.
		definition.set('definition', response.content);
		yield definition.save();
		this.client.sendMessage(msg, 'Alright, definition saved!');
	}

}

module.exports = ChangeDef;
