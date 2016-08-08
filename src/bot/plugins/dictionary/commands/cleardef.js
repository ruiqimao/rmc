const Command = require('plugin').Command;
const Util = require('plugin').Util;

class ClearDef extends Command {

	get usage() { return '[phrase]'; }
	get description() { return 'clear a custom definition.'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

		const commander = (yield this.bot.Commander.getEntry(msg.server.id, '')).val();
		return Util.checkRole(msg.server, msg.author, commander); // Must be a commander.
	}

	*process(msg, suffix) {
		// Check if the suffix exists.
		if (suffix.length == 0) {
			// Ask if the user wants to clear all custom definitions.
			const response = yield this.client.awaitResponse(msg, 'Are you sure you want to clear *all* custom definitions?');

			// Check whether the response was affirmative.
			if (Util.checkAffirmative(response.content)) {
				// Clear the definitions.
				yield this.plugin.Definition.remove({
					'server': msg.server.id
				});

				// Tell the user the definitions were cleared.
				yield this.client.sendMessage(msg, 'Okay, I cleared all the custom definitions!');
			} else {
				// Tell the user the response was negative.
				this.client.sendMessage(msg, 'Okay, I won\'t touch the definitions.');
			}

			return;
		}

		// Clear the definition.
		yield this.plugin.Definition.remove({
			'phrase': suffix.toLowerCase(),
			'server': msg.server.id
		});
		this.client.sendMessage(msg, 'Okay, I cleared the definition for `' + suffix + '`!');
	}

}

module.exports = ClearDef;
