'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Class for RMC bot.
 */
var Bot = function () {

	/*
  * Constructor.
  *
  * @param client The Discord client.
  * @param config The configuration for the bot.
  */
	function Bot(client, config) {
		_classCallCheck(this, Bot);

		// Assign the member variables.
		this.client = client;
		this.config = config;

		// Initialize all the commands.
		this.commands = {};
		for (var command in config.COMMANDS) {
			var Command = config.COMMANDS[command];
			this.commands[command.toLowerCase()] = new Command(client, config);
		}
	}

	/*
  * Starts normal bot operations.
  */


	_createClass(Bot, [{
		key: 'start',
		value: function start() {
			var _this = this;

			console.log('Beginning normal operations...');

			// Set the status and game.
			this.client.setStatus('online', this.config.GAME);

			// Read messages.
			this.client.on('message', function (msg) {
				_this.handleMessage(msg);
			});

			// Handle a disconnection.
			this.client.on('disconnected', function () {
				console.error('Disconnected from Discord.');
				process.exit(_this.client.graceful ? 0 : 1);
			});
		}

		/*
   * Handle a message.
   *
   * @param msg The message.
   */

	}, {
		key: 'handleMessage',
		value: function handleMessage(msg) {
			// Ignore messages from herself.
			if (msg.author.equals(this.client.user)) return;

			// Ping.
			if (msg.content === 'ping') {
				return this.client.sendMessage(msg, 'pong');
			}

			// Trim the message and check if the message is a command.
			var message = msg.content.trim();
			if (message.startsWith(this.config.COMMAND_PREFIX)) {
				// Get the command.
				var command = message.substring(this.config.COMMAND_PREFIX.length).split(' ')[0];

				// Get the suffix.
				var suffix = message.substring(command.length + this.config.COMMAND_PREFIX.length).trim();

				// Handle the command.
				this.handleCommand(msg, command, suffix);
			}
		}

		/*
   * Handle a command.
   *
   * @param msg The message that triggered the command.
   * @param command The command.
   * @param suffix The command suffix.
   */

	}, {
		key: 'handleCommand',
		value: function handleCommand(msg, command, suffix) {
			// Handle special "help" command.
			if (command == 'help') {
				return this.handleHelp(msg, suffix);
			}

			// Check if the command is valid.
			if (command in this.commands) {
				// Execute the command.
				this.commands[command].run(msg, suffix);
			}
		}

		/*
   * Handles the "help" command.
   *
   * @param msg The message that triggered the command.
   * @param suffix The command suffix.
   */

	}, {
		key: 'handleHelp',
		value: function handleHelp(msg, suffix) {
			var _this2 = this;

			/*
    * Generates a help entry.
    *
    * @param command The name of the command to generate the entry from.
    *
    * @return The help entry if the command exists, null otherwise.
    */
			var generateEntry = function generateEntry(command) {
				// Check if the command exists.
				if (command in _this2.commands) {
					// Get the command.
					var cmd = _this2.commands[command];

					// Construct the entry.
					var entry = '`' + _this2.config.COMMAND_PREFIX + command;
					if (cmd.usage) entry += ' ' + cmd.usage;
					entry += '`: ' + cmd.description;

					// Return the entry.
					return entry;
				} else {
					// Return null.
					return null;
				}
			};

			// Check if the suffix exists.
			if (suffix.length > 0) {
				// Show the help entry for a certain command.
				var entry = generateEntry(suffix);

				// Check if the entry actually exists.
				if (entry != null) {
					// Reply with the entry.
					this.client.sendMessage(msg, entry);
				} else {
					// Error!
					this.client.sendMessage(msg, '`' + suffix + '` isn\'t an actual command, dumbass.');
				}
			} else {
				// Show all help entries.
				var entries = '**Available Directives:**\n' + Object.keys(this.commands).map(function (cmd) {
					return generateEntry(cmd);
				}).join('\n');
				this.client.sendMessage(msg, entries);
			}
		}
	}]);

	return Bot;
}();

exports.default = Bot;