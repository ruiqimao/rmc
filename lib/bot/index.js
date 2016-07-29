'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _discord = require('discord.js');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Class for RMC bot.
 */
var Bot = function (_EventEmitter) {
	_inherits(Bot, _EventEmitter);

	/*
  * Constructor.
  *
  * @param token The authorization token.
  * @param config The configuration for the bot.
  */
	function Bot(token, config) {
		_classCallCheck(this, Bot);

		// Assign the member variables.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bot).call(this));

		_this.token = token;
		_this.config = config;
		_this.client = new _discord.Client();
		_this.commands = {};
		_this.loggedIn = false;
		_this.gracefulShutdown = false;
		return _this;
	}

	/*
  * Starts normal bot operations.
  */


	_createClass(Bot, [{
		key: 'start',
		value: function start() {
			var _this2 = this;

			// Login.
			this.client.loginWithToken(this.token);

			// Wait for the client to be ready.
			this.client.on('ready', function () {

				// Set the logged in flag.
				_this2.loggedIn = true;
				_this2.emit('connected');

				// Initialize all the commands.
				for (var command in _this2.config.COMMANDS) {
					var Command = _this2.config.COMMANDS[command];
					_this2.commands[command.toLowerCase()] = new Command(_this2.client, _this2.config);
				}

				// Set the status and game.
				_this2.client.setStatus('online', _this2.config.GAME);

				// Read messages.
				_this2.client.on('message', function (msg) {
					_this2.handleMessage(msg);
				});

				// Handle a disconnection.
				_this2.client.on('disconnected', function () {
					_this2.emit('disconnected', _this2.gracefulShutdown);
				});

				// Emit a ready event.
				_this2.emit('ready');
			});
		}

		/*
   * Gracefully shut down the bot.
   */

	}, {
		key: 'shutdown',
		value: function shutdown() {
			// Set the graceful shutdown flag.
			this.gracefulShutdown = true;

			// Log out.
			if (this.loggedIn) this.client.logout();
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
			var _this3 = this;

			/*
    * Generates a help entry.
    *
    * @param command The name of the command to generate the entry from.
    *
    * @return The help entry if the command exists, null otherwise.
    */
			var generateEntry = function generateEntry(command) {
				// Check if the command exists.
				if (command in _this3.commands) {
					// Get the command.
					var cmd = _this3.commands[command];

					// Construct the entry.
					var entry = '`' + _this3.config.COMMAND_PREFIX + command;
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
}(_events2.default);

exports.default = Bot;