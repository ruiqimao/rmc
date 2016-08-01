import { Command } from 'plugin';

import requestPromise from 'request-promise';

export default class Define extends Command {

	get usage() { return '<phrase>'; }
	get description() { return 'define something!'; }

	*authorize(msg, suffix) {
		// Cannot be private.
		if (msg.channel.isPrivate) return false;

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
