import { Command } from 'plugin';

export default class Help extends Command {

	get usage() { return '[command]'; }
	get description() { return 'show this helpful list!'; }

	*authorize(msg, suffix) {
		// Everyone is allowed to view help.
		return true;
	}

	*process(msg, suffix) {
		// Check if the suffix exists.
		if (suffix.length > 0) {
			// Show the help entry for a certain command.
			const entry = yield this.generateEntry(suffix);

			// Check if the entry actually exists.
			if (entry != null) {
				// Reply with the entry.a
				this.client.sendMessage(msg, entry);
			} else {
				// Error!
				this.client.sendMessage(msg, '`' + suffix + '` isn\'t an actual command, dumbass.');
			}
		} else {
			// Show all help entries.
			let helpText = '**Available Directives:**\n';
			const entries = [];
			for (const command of Object.keys(this.bot.commands)) {
				const entry = yield this.generateEntry(msg, command);
				if (entry != null) {
					entries.push(entry);
				}
			}
			helpText += entries.join('\n');
			this.client.sendMessage(msg, helpText);
		}
	}

	/*
	 * Generates a help entry.
	 *
	 * @param msg The message that triggered the command.
	 * @param command The name of the command to generate the entry from.
	 *
	 * @return The help entry if the command exists and the user is allowed, null otherwise.
	 */
	*generateEntry(msg, command) {
		// Check if the command exists.
		if (!(command in this.bot.commands)) {
			return null;
		}

		// Check if the user has permission.
		if (!(yield this.bot.commands[command].authorize(msg, ''))) {
			return null;
		}

		// Get the command.
		let cmd = this.bot.commands[command];

		// Construct the entry.
		let entry = '`' + this.config.COMMAND_PREFIX + command;
		if (cmd.usage) entry += ' ' + cmd.usage;
		entry += '`: ' + cmd.description;

		// Return the entry.
		return entry;
	}


}
