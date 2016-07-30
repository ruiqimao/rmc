'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _discord = require('discord.js');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _mongorito = require('mongorito');

var _mongorito2 = _interopRequireDefault(_mongorito);

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
  * @param dbUri The database URI.
  * @param config The configuration for the bot.
  */
	function Bot(token, dbUri, config) {
		_classCallCheck(this, Bot);

		// Assign the member variables.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bot).call(this));

		_this.token = token;
		_this.dbUri = dbUri;
		_this.config = config;
		_this.client = new _discord.Client();
		_this.db = null;
		_this.plugins = [];
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

			// Connect to the database.
			_mongorito2.default.connect(this.dbUri).then(function (db) {
				_this2.db = db;
				console.log('Connected to database!');

				// Login.
				_this2.client.loginWithToken(_this2.token);

				// Wait for the client to be ready.
				_this2.client.on('ready', function () {

					// Set the logged in flag.
					_this2.loggedIn = true;
					_this2.emit('connected');

					// Initialize all the plugins.
					_this2.loadPlugins();

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
			}).catch(function (err) {
				console.error('Couldn\'t connect to the database.');
			});
		}

		/*
   * Load all the plugins in the config.
   */

	}, {
		key: 'loadPlugins',
		value: function loadPlugins() {
			// Clear the plugin list.
			this.plugins = [];

			// Load the plugins.
			for (var plugin in this.config.PLUGINS) {
				var Plugin = this.config.PLUGINS[plugin];
				this.plugins.push(new Plugin(this));
			}

			// Build a cache of commands.
			this.loadCommandCache();
		}

		/*
   * Build a cache of all commands.
   */

	}, {
		key: 'loadCommandCache',
		value: function loadCommandCache() {
			// Clear the command cache.
			this.commands = {};

			// Load all the commands and store them in the cache.
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var plugin = _step.value;
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = plugin.commands[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var command = _step2.value;

							this.commands[command.name] = command.command;
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
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

			// Close the database connection.
			if (this.db) this.db.close();
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