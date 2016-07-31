'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Plugin.
 */
var Plugin = function () {

	/*
  * Constructor.
  *
  * @bot The bot.
  */
	function Plugin(bot) {
		_classCallCheck(this, Plugin);

		// Set the member variables.
		this.bot = bot;
		this.client = bot.client;
		this.config = bot.config;
		this.commands = [];
	}

	/*
  * Load the plugin.
  *
  * @return A Promise after the plugin has loaded.
  */


	_createClass(Plugin, [{
		key: 'load',
		value: function load() {
			return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
				var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, command;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (!this.init) {
									_context.next = 3;
									break;
								}

								_context.next = 3;
								return (0, _co2.default)(this.init.bind(this));

							case 3:

								// Load the commands.
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 6;
								_iterator = this.commands[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context.next = 15;
									break;
								}

								command = _step.value;
								_context.next = 12;
								return command.command.load();

							case 12:
								_iteratorNormalCompletion = true;
								_context.next = 8;
								break;

							case 15:
								_context.next = 21;
								break;

							case 17:
								_context.prev = 17;
								_context.t0 = _context['catch'](6);
								_didIteratorError = true;
								_iteratorError = _context.t0;

							case 21:
								_context.prev = 21;
								_context.prev = 22;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 24:
								_context.prev = 24;

								if (!_didIteratorError) {
									_context.next = 27;
									break;
								}

								throw _iteratorError;

							case 27:
								return _context.finish(24);

							case 28:
								return _context.finish(21);

							case 29:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[6, 17, 21, 29], [22,, 24, 28]]);
			}).bind(this));
		}

		/*
   * Unload the plugin.
   *
   * @return A Promise after the plugin has been unloaded.
   */

	}, {
		key: 'unload',
		value: function unload() {
			return (0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
				var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, command;

				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (!this.destroy) {
									_context2.next = 3;
									break;
								}

								_context2.next = 3;
								return this.destroy.bind(this);

							case 3:

								// Unload the commands.
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context2.prev = 6;
								_iterator2 = this.commands[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
									_context2.next = 15;
									break;
								}

								command = _step2.value;
								_context2.next = 12;
								return command.command.unload();

							case 12:
								_iteratorNormalCompletion2 = true;
								_context2.next = 8;
								break;

							case 15:
								_context2.next = 21;
								break;

							case 17:
								_context2.prev = 17;
								_context2.t0 = _context2['catch'](6);
								_didIteratorError2 = true;
								_iteratorError2 = _context2.t0;

							case 21:
								_context2.prev = 21;
								_context2.prev = 22;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 24:
								_context2.prev = 24;

								if (!_didIteratorError2) {
									_context2.next = 27;
									break;
								}

								throw _iteratorError2;

							case 27:
								return _context2.finish(24);

							case 28:
								return _context2.finish(21);

							case 29:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this, [[6, 17, 21, 29], [22,, 24, 28]]);
			}).bind(this));
		}

		/*
   * Add a command.
   *
   * @param name Name of the command.
   * @param command Prototype of the command to add.
   */

	}, {
		key: 'addCommand',
		value: function addCommand(name, command) {
			this.commands.push({
				name: name,
				command: new command(this)
			});
		}

		/*
   * Remove a command.
   *
   * @param name Name of the command.
   */

	}, {
		key: 'removeCommand',
		value: function removeCommand(name) {
			this.commands = this.commands.filter(function (command) {
				return command.name != name;
			});
		}

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
	}]);

	return Plugin;
}();

exports.default = Plugin;