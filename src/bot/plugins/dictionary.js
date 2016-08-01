import { Plugin, Command, Util } from 'plugin';

import requestPromise from 'request-promise';

export default class extends Plugin {

	*init() {
		this.addCommand('define', Define);
		this.addCommand('changedef', ChangeDef);
		this.addCommand('cleardef', ClearDef);

		// Create a class for definitions.
		this.Definition = this.createModel('definition');
	}

}

class Define extends Command {

	get usage() { return '<phrase>'; }
	get description() { return 'define something!'; }

	*authorize(msg, suffix) {
		// Everyone is allowed to look for definitions.
		return true;
	}

	*process(msg, suffix) {
		// Check if the suffix exists.
		if (suffix.length == 0) return this.client.reply(msg, 'So... what do you want me to define, dipshit?');

		// Look for a custom definition.
		const definitions = yield this.plugin.Definition.limit(1).find({
			'phrase': suffix.toLowerCase(),
			'server': msg.server.id
		});

		// If there is a custom definition, return it.
		if (definitions.length > 0) {
			const definition = definitions[0].get('definition');
			return this.client.sendMessage(msg, definition);
		}

		// Otherwise, look for the definition on Urban Dictionary.
		const results = JSON.parse(yield requestPromise('http://api.urbandictionary.com/v0/define?term=' + suffix));

		// Check if there is a result.
		if (results.list.length == 0) {
			return this.client.reply(msg, 'I couldn\'t find anything for that. Next.');
		}

		// Return the first result.
		this.client.sendMessage(msg, results.list[0].definition);
	}

}

class ChangeDef extends Command {

	get usage() { return '<phrase>'; }
	get description() { return 'change the definition of something!'; }

	*authorize(msg, suffix) {
		return Util.checkRole(msg.server, msg.author, this.config.COMMANDER); // Must be a commander.
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

class ClearDef extends Command {

	get usage() { return '[phrase]'; }
	get description() { return 'clear a custom definition.'; }

	*authorize(msg, suffix) {
		return Util.checkRole(msg.server, msg.author, this.config.COMMANDER); // Must be a commander.
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
