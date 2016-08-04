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

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _hoganExpress = require('hogan-express');

var _hoganExpress2 = _interopRequireDefault(_hoganExpress);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

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

		// Set constants.
		_this.PERMISSION_DENIED_RESPONSES = ['I don\'t recognize your authority.', 'No.', 'Fuck off.', 'No, fuck you.', 'Who do you think you are, telling me what to do?', 'Don\'t tell me what to do.', 'HAHAHA no.', 'Ehhh...', 'Nah.', 'Yeah no.', 'Screw that.', 'Beep boop, permission denied, fucker!'];

		// Set functions to export to children.
		_this.exportFunctions = ['getVoiceConnection', 'permissionDenied', 'errorOccurred', 'createModel'];

		// Bind functions.
		_this.handleCommand = _this.handleCommand.bind(_this);
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

				// Create models.
				_this2.Prefix = _this2.createModel('_bot-command-prefix');
				_this2.EnabledCommands = _this2.createModel('_bot-enabled-commands');

				// Create a web server.
				_this2.express = (0, _express2.default)();

				// Set up body parser.
				_this2.express.use(_bodyParser2.default.json());
				_this2.express.use(_bodyParser2.default.urlencoded({ extended: true }));

				// Set up templates.
				_this2.express.engine('html', _hoganExpress2.default);

				// Set up static files.
				_this2.express.use(_express2.default.static(__dirname + '/dashboard/public'));

				// Start listening on the server.
				_this2.server = _http2.default.createServer(_this2.express);
				_this2.server.listen(_this2.config.SERVER_PORT, function (err) {
					if (err) return console.error('Could not start web server.');
					console.log('Started web server on port ' + _this2.config.SERVER_PORT + '!');

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
			this.enabledCommands = {};

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
							this.enabledCommands[command.name] = true;
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

			// Close the server.
			if (this.server) this.server.close();
		}

		/*
   * Handle a message.
   *
   * @param msg The message.
   */

	}, {
		key: 'handleMessage',
		value: function handleMessage(msg) {
			(0, _co2.default)(regeneratorRuntime.mark(function _callee4() {
				var message, prefix, command, suffix;
				return regeneratorRuntime.wrap(function _callee4$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								if (!msg.author.equals(this.client.user)) {
									_context5.next = 2;
									break;
								}

								return _context5.abrupt('return');

							case 2:
								if (!(msg.content === 'ping')) {
									_context5.next = 4;
									break;
								}

								return _context5.abrupt('return', this.client.sendMessage(msg, 'pong'));

							case 4:

								// Trim the message and check if the message is a command.
								message = msg.content.trim();

								// Get the prefix.

								prefix = void 0;

								if (!msg.channel.isPrivate) {
									_context5.next = 10;
									break;
								}

								prefix = this.config.COMMAND_PREFIX;
								_context5.next = 13;
								break;

							case 10:
								_context5.next = 12;
								return this.Prefix.getEntry(msg.server.id, this.config.COMMAND_PREFIX);

							case 12:
								prefix = _context5.sent.val();

							case 13:
								if (!message.startsWith(prefix)) {
									_context5.next = 18;
									break;
								}

								// Get the command.
								command = message.substring(prefix.length).split(' ')[0];

								// Get the suffix.

								suffix = message.substring(command.length + prefix.length).trim();

								// Handle the command.

								_context5.next = 18;
								return this.handleCommand(msg, command, suffix);

							case 18:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee4, this);
			}).bind(this));
		}

		/*
   * Get data for the dashboard.
   *
   * @param server The server id.
   *
   * @return The relevant information.
   */

	}, {
		key: 'getData',
		value: regeneratorRuntime.mark(function getData(server) {
			return regeneratorRuntime.wrap(function getData$(_context6) {
				while (1) {
					switch (_context6.prev = _context6.next) {
						case 0:
							_context6.t0 = this.client.servers.get('id', server).name;
							_context6.next = 3;
							return this.Prefix.getEntry(server, this.config.COMMAND_PREFIX);

						case 3:
							_context6.t1 = _context6.sent.val();
							_context6.next = 6;
							return this.EnabledCommands.getEntry(server, this.enabledCommands);

						case 6:
							_context6.t2 = _context6.sent.val();
							return _context6.abrupt('return', {
								'name': _context6.t0,
								'prefix': _context6.t1,
								'commands': _context6.t2
							});

						case 8:
						case 'end':
							return _context6.stop();
					}
				}
			}, getData, this);
		})

		/*
   * Save data for the dashboard.
   *
   * @param server The server id.
   * @param data The data to save.
   *
   * @return The relevant information.
   */

	}, {
		key: 'saveData',
		value: regeneratorRuntime.mark(function saveData(server, data) {
			var entry, _entry;

			return regeneratorRuntime.wrap(function saveData$(_context7) {
				while (1) {
					switch (_context7.prev = _context7.next) {
						case 0:
							if (!(data.prefix.length > 0 && data.prefix.length < 4)) {
								_context7.next = 7;
								break;
							}

							_context7.next = 3;
							return this.Prefix.getEntry(server, this.config.COMMAND_PREFIX);

						case 3:
							entry = _context7.sent;

							entry.val(data.prefix);
							_context7.next = 7;
							return entry.save();

						case 7:
							_context7.next = 9;
							return this.EnabledCommands.getEntry(server, this.enabledCommands);

						case 9:
							_entry = _context7.sent;

							_entry.val(data.commands);
							_context7.next = 13;
							return _entry.save();

						case 13:
						case 'end':
							return _context7.stop();
					}
				}
			}, saveData, this);
		})

		/*
   * Handle a command.
   *
   * @param msg The message that triggered the command.
   * @param command The command.
   * @param suffix The command suffix.
   */

	}, {
		key: 'handleCommand',
		value: regeneratorRuntime.mark(function handleCommand(msg, command, suffix) {
			var commands;
			return regeneratorRuntime.wrap(function handleCommand$(_context8) {
				while (1) {
					switch (_context8.prev = _context8.next) {
						case 0:
							_context8.next = 2;
							return this.EnabledCommands.getEntry(msg.server.id, this.enabledCommands);

						case 2:
							commands = _context8.sent.val();

							if (!commands[command]) {
								_context8.next = 6;
								break;
							}

							_context8.next = 6;
							return this.commands[command].run(msg, suffix);

						case 6:
						case 'end':
							return _context8.stop();
					}
				}
			}, handleCommand, this);
		})

		/*
   * Get the voice connection RM-C is connected to.
   *
   * @param server The server to look for.
   *
   * @return The voice connection associated with the server, null if it doesn't exist.
   */

	}, {
		key: 'getVoiceConnection',
		value: function getVoiceConnection(server) {
			// Get all connections associated with the server.
			var connections = this.client.voiceConnections.filter(function (v) {
				return v.voiceChannel.server.equals(server) || v.voiceChannel.server.id == server;
			});

			// Return the connection.
			if (connections.length == 0) return null;
			return connections[0];
		}

		/*
   * Sends a permission denied reply.
   *
   * @param channel A Channel resolvable.
   */

	}, {
		key: 'permissionDenied',
		value: function permissionDenied(channel) {
			var index = Math.floor(Math.random() * this.PERMISSION_DENIED_RESPONSES.length);
			this.client.reply(channel, this.PERMISSION_DENIED_RESPONSES[index]);
		}

		/*
   * Sends a message saying something went wrong.
   *
   * @param chanel A channel resolvable.
   */

	}, {
		key: 'errorOccurred',
		value: function errorOccurred(channel) {
			this.client.sendMessage(channel, 'My creator is an idiot. Something went wrong!');
		}

		/*
   * Create a Mongorito model using a collection name.
   *
   * @param collection The collection name to use.
   *
   * @return A Mongorito Model.
   */

	}, {
		key: 'createModel',
		value: function createModel(_collection) {
			var _db = this.db;
			var _bot = this;
			return function (_Model) {
				_inherits(_class, _Model);

				function _class() {
					_classCallCheck(this, _class);

					return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
				}

				_createClass(_class, [{
					key: 'db',
					value: function db() {
						return _db;
					}
				}, {
					key: 'collection',
					value: function collection() {
						return _collection;
					}
				}, {
					key: 'bot',
					value: function bot() {
						return _bot;
					}

					/*
      * Get the entry for the server. For models with exactly one entry per server.
      *
      * @param server The server id.
      * @param def The default value.
      *
      * @return The entry.
      */

				}, {
					key: 'val',


					/*
      * Get or set the 'value' field.
      *
      * @param val The val to set, if needed.
      *
      * @return The value.
      */
					value: function val(_val) {
						if (_val !== undefined) {
							this.set('value', _val);
						}
						return this.get('value');
					}
				}], [{
					key: 'getEntry',
					value: regeneratorRuntime.mark(function getEntry(server, def) {
						var entries;
						return regeneratorRuntime.wrap(function getEntry$(_context9) {
							while (1) {
								switch (_context9.prev = _context9.next) {
									case 0:
										_context9.next = 2;
										return this.limit(1).find({
											'server': server
										});

									case 2:
										entries = _context9.sent;

										if (!(entries.length > 0)) {
											_context9.next = 7;
											break;
										}

										return _context9.abrupt('return', entries[0]);

									case 7:
										return _context9.abrupt('return', new this({
											'server': server,
											'value': def
										}));

									case 8:
									case 'end':
										return _context9.stop();
								}
							}
						}, getEntry, this);
					})
				}]);

				return _class;
			}(_mongorito.Model);
		}
	}]);

	return Bot;
}(_events2.default);

exports.default = Bot;