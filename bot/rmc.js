'use strict';

var config = require('./config');

// Command config.
const COMMAND_PREFIX = config.COMMAND_PREFIX;
const COMMANDS = config.COMMANDS;

/*
 * Starts normal bot operations.
 *
 * @param client The Discord client.
 */
exports.start = function(client) {
	console.log('Beginning normal operations...');

	// Set the status and game.
	client.setStatus('online', config.GAME);

	// Read messages.
	client.on('message', handleMessage(client));

	// Handle a disconnection.
	client.on('disconnected', function() {
		console.error('Disconnected from Discord.');
		process.exit(1);
	});
};

/*
 * Generate a callback for handling a message.
 *
 * @param client The Discord client.
 *
 * @return A callback to be used with the Discord client "message" event.
 */
function handleMessage(client) {
	return function(msg) {
		// Ignore messages from herself.
		if (msg.author.equals(client.user)) return;

		// Ping.
		if (msg.content === 'ping') {
			return client.sendMessage(msg, 'pong');
		}

		// Trim the message and check if the message is a command.
		var message = msg.content.trim();
		if (message.startsWith(COMMAND_PREFIX)) {
			// Get the command.
			var command = message.substring(COMMAND_PREFIX.length).split(' ')[0];

			// Get the suffix.
			var suffix = message.substring(command.length + COMMAND_PREFIX.length).trim();

			// Handle the command.
			handleCommand(client, msg, command, suffix);
		}
	};
}

/*
 * Handle a command.
 *
 * @param client The Discord client.
 * @param msg The message that triggered the command.
 * @param command The command.
 * @param suffix The command suffix.
 */
function handleCommand(client, msg, command, suffix) {
	// Handle special "help" command.
	if (command == 'help') {
		return handleHelp(client, msg, suffix);
	}

	// Check if the command is valid.
	if (command in COMMANDS) {
		// Execute the command.
		COMMANDS[command].run(client, msg, suffix);
	}
}

/*
 * Handles the "help" command.
 *
 * @param client The Discord client.
 * @param msg The message that triggered the command.
 * @param suffix The command suffix.
 */
function handleHelp(client, msg, suffix) {
	/*
	 * Generates a help entry.
	 *
	 * @param command The name of the command to generate the entry from.
	 *
	 * @return The help entry if the command exists, null otherwise.
	 */
	function generateEntry(command) {
		// Check if the command exists.
		if (command in COMMANDS) {
			// Get the command.
			var cmd = COMMANDS[command];

			// Construct the entry.
			var entry = '`' + COMMAND_PREFIX + command;
			if (cmd.usage) entry += ' ' + cmd.usage;
			entry += '`: ' + cmd.description;

			// Return the entry.
			return entry;
		} else {
			// Return null.
			return null;
		}
	}

	// Check if the suffix exists.
	if (suffix.length > 0) {
		// Show the help entry for a certain command.
		var entry = generateEntry(suffix);

		// Check if the entry actually exists.
		if (entry != null) {
			// Reply with the entry.
			client.sendMessage(msg, entry);
		} else {
			// Error!
			client.sendMessage(msg, '`' + suffix + '` isn\'t an actual command, dumbass.');
		}
	} else {
		// Show all help entries.
		var entries = Object.keys(COMMANDS).map((cmd) => generateEntry(cmd)).join('\n');
		client.sendMessage(msg, entries);
	}
}
