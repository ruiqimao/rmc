const Plugin = require('plugin').Plugin;

class Dictionary extends Plugin {

	*init() {
		this.addCommand('define', require('./commands/define'));
		this.addCommand('changedef', require('./commands/changedef'));
		this.addCommand('cleardef', require('./commands/cleardef'));

		// Create a class for definitions.
		this.Definition = this.createModel('definition');
	}

	*getData(id) {
		// Get all definitions for the server.
		const entries = yield this.Definition.find({
			'server': id
		});

		// Map the entries to their phrases and definitions and sort them.
		const definitions = entries
			.map(entry => {
				return {
					phrase: entry.get('phrase'),
					definition: entry.get('definition')
				};
			})
			.sort((a, b) => a.phrase.localeCompare(b.phrase));

		// Return the definitions.
		return definitions;
	}

	*saveData(id, data) {
		// Convert the data into an object.
		const updated = {};
		for (const entry of data) {
			updated[entry.phrase] = entry.definition.trim();
		}

		// Get all definitions for the server.
		const entries = yield this.Definition.find({
			'server': id
		});

		// Update all the definitions.
		for (const entry of entries) {
			const phrase = entry.get('phrase');
			const definition = entry.get('definition');
			if (updated[phrase] === undefined) {
				// Remove entry if it is no longer defined.
				yield entry.remove();
			} else {
				if (updated[phrase] !== definition) {
					// Update the definition if it is different.
					entry.set('definition', updated[phrase]);
					yield entry.save();
				}
			}
		}
	}

}

module.exports = Dictionary;
