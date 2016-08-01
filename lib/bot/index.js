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

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

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
  * @param authorization The authorization data.
  * @param config The configuration for the bot.
  */
	function Bot(authorization, config) {
		_classCallCheck(this, Bot);

		// Assign the member variables.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bot).call(this));

		_this.token = authorization.DISCORD_TOKEN;
		_this.dbUri = authorization.MONGO_URI;
		_this.owners = authorization.OWNERS;
		_this.config = config;
		_this.client = new _discord.Client({
			forceFetchUsers: true
		});
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
					_this2.loadPlugins().then(function () {
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
				});
			}).catch(function (err) {
				console.error('Couldn\'t connect to the database.');
			});
		}

		/*
   * Load all the plugins in the config.
   *
   * @return A Promise after all the plugins have loaded.
   */

	}, {
		key: 'loadPlugins',
		value: function loadPlugins() {
			return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
				var _this3 = this;

				var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

				return regeneratorRuntime.wrap(function _callee$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								// Clear the plugin list.
								this.plugins = [];

								// Load the plugins.
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context2.prev = 4;
								_loop = regeneratorRuntime.mark(function _loop() {
									var plugin;
									return regeneratorRuntime.wrap(function _loop$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													plugin = _step.value;
													_context.next = 3;
													return _this3.loadPlugin(plugin).then(function () {
														console.log('Loaded plugin \'' + plugin + '\'.');
													}).catch(function (err) {
														console.error('Could not load plugin \'' + plugin + '\'.');
														console.error(err);
													});

												case 3:
												case 'end':
													return _context.stop();
											}
										}
									}, _loop, _this3);
								});
								_iterator = this.config.PLUGINS[Symbol.iterator]();

							case 7:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context2.next = 12;
									break;
								}

								return _context2.delegateYield(_loop(), 't0', 9);

							case 9:
								_iteratorNormalCompletion = true;
								_context2.next = 7;
								break;

							case 12:
								_context2.next = 18;
								break;

							case 14:
								_context2.prev = 14;
								_context2.t1 = _context2['catch'](4);
								_didIteratorError = true;
								_iteratorError = _context2.t1;

							case 18:
								_context2.prev = 18;
								_context2.prev = 19;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 21:
								_context2.prev = 21;

								if (!_didIteratorError) {
									_context2.next = 24;
									break;
								}

								throw _iteratorError;

							case 24:
								return _context2.finish(21);

							case 25:
								return _context2.finish(18);

							case 26:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee, this, [[4, 14, 18, 26], [19,, 21, 25]]);
			}).bind(this));
		}

		/*
   * Load a plugin.
   *
   * @param name The name of the plugin.
   *
   * @return A Promise after the plugin has loaded.
   */

	}, {
		key: 'loadPlugin',
		value: function loadPlugin(name) {
			// Check if the plugin has already been loaded.
			if (this.plugins.filter(function (p) {
				return p.name == name;
			}).length > 0) {
				// Reject if it has.
				return Promise.reject();
			}

			return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
				var Plugin, plugin;
				return regeneratorRuntime.wrap(function _callee2$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								Plugin = require('./plugins/' + name).default;
								plugin = new Plugin(this);
								_context3.next = 4;
								return plugin.load();

							case 4:
								this.plugins.push({
									name: name,
									plugin: plugin
								});

								// Rebuild the cache of commands.
								this.loadCommandCache();

							case 6:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee2, this);
			}).bind(this));
		}

		/*
   * Unload a plugin.
   *
   * @param name The name of the plugin.
   *
   * @return A Promise after the plugin has unloaded.
   */

	}, {
		key: 'unloadPlugin',
		value: function unloadPlugin(name) {
			return (0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
				var found, index, plugin, i;
				return regeneratorRuntime.wrap(function _callee3$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								// Find the plugin.
								found = false, index = null, plugin = null;
								_context4.t0 = regeneratorRuntime.keys(this.plugins);

							case 2:
								if ((_context4.t1 = _context4.t0()).done) {
									_context4.next = 11;
									break;
								}

								i = _context4.t1.value;

								if (!(this.plugins[i].name == name)) {
									_context4.next = 9;
									break;
								}

								found = true;
								index = i;
								plugin = this.plugins[i].plugin;
								return _context4.abrupt('break', 11);

							case 9:
								_context4.next = 2;
								break;

							case 11:
								if (found) {
									_context4.next = 13;
									break;
								}

								return _context4.abrupt('return', Promise.reject());

							case 13:
								_context4.next = 15;
								return plugin.unload();

							case 15:

								// Remove the plugin.
								this.plugins.splice(index, 1);

								// Rebuild the command cache.
								this.loadCommandCache();

							case 17:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee3, this);
			}).bind(this));
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
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _plugin = _step2.value;
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = _plugin.plugin.commands[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var command = _step3.value;

							this.commands[command.name] = command.command;
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
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

			// Handle special "load" command.
			if (command == 'load') {
				return this.handleLoad(msg, suffix);
			}

			// Handle special "unload" command.
			if (command == 'unload') {
				return this.handleUnload(msg, suffix);
			}

			// Handle special "plugins" command.
			if (command == 'plugins') {
				return this.handlePlugins(msg, suffix);
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
			var _this4 = this;

			/*
    * Generates a help entry.
    *
    * @param command The name of the command to generate the entry from.
    *
    * @return The help entry if the command exists, null otherwise.
    */
			var generateEntry = function generateEntry(command) {
				// Check if the command exists.
				if (command in _this4.commands) {
					// Get the command.
					var cmd = _this4.commands[command];

					// Construct the entry.
					var entry = '`' + _this4.config.COMMAND_PREFIX + command;
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

		/*
   * Handles the special "load" command.
   *
   * @param msg The message that triggered the command.
   * @param suffix The command suffix.
   */

	}, {
		key: 'handleLoad',
		value: function handleLoad(msg, suffix) {
			var _this5 = this;

			// Make sure the sender is a bot owner.
			if (this.owners.filter(function (i) {
				return i == msg.author.id;
			}).length == 0) {
				return this.client.reply(msg, 'Don\'t tell me what to do.');
			}

			// Make sure there is a plugin to load.
			if (suffix.length == 0) {
				return this.client.reply(msg, 'Um... Give me a plugin to load, maybe?');
			}

			// Load the plugin.
			return (0, _co2.default)(this.loadPlugin.bind(this), suffix).then(function () {
				_this5.client.sendMessage(msg, 'I loaded `' + suffix + '`!');
			}).catch(function () {
				_this5.client.sendMessage(msg, 'I couldn\'t load `' + suffix + '`. Check your code, dumbass.');
			});
		}

		/*
   * Handles the special "unload" command.
   *
   * @param msg The message that triggered the command.
   * @param suffix The command suffix.
   */

	}, {
		key: 'handleUnload',
		value: function handleUnload(msg, suffix) {
			var _this6 = this;

			// Make sure the sender is a bot owner.
			if (this.owners.filter(function (i) {
				return i == msg.author.id;
			}).length == 0) {
				return this.client.reply(msg, 'Don\'t tell me what to do.');
			}

			// Make sure there is a plugin to unload.
			if (suffix.length == 0) {
				return this.client.reply(msg, 'Um... Give me a plugin to unload, maybe?');
			}

			// Unload the plugin.
			return (0, _co2.default)(this.unloadPlugin.bind(this), suffix).then(function () {
				_this6.client.sendMessage(msg, 'I unloaded `' + suffix + '`!');
			}).catch(function () {
				_this6.client.sendMessage(msg, 'I couldn\'t unload `' + suffix + '`. Check your code, dumbass.');
			});
		}

		/*
   * Handles the special "plugins" command.
   *
   * @param msg The message that triggered the command.
   * @param suffix The command suffix.
   */

	}, {
		key: 'handlePlugins',
		value: function handlePlugins(msg, suffix) {
			// Respond with a list of plugins.
			var plugins = this.plugins.map(function (p) {
				return '`' + p.name + '`';
			}).join('\n');
			this.client.sendMessage(msg, '**Loaded Plugins:**\n' + plugins);
		}
	}]);

	return Bot;
}(_events2.default);

exports.default = Bot;