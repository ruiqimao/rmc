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
		this.db = bot.db;
		this.commands = [];

		// Import functions from the bot.
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = bot.exportFunctions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var func = _step.value;

				this[func] = bot[func].bind(bot);
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

		this.exportFunctions = bot.exportFunctions;
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
				var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, command;

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
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context.prev = 6;
								_iterator2 = this.commands[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
									_context.next = 15;
									break;
								}

								command = _step2.value;
								_context.next = 12;
								return command.command.load();

							case 12:
								_iteratorNormalCompletion2 = true;
								_context.next = 8;
								break;

							case 15:
								_context.next = 21;
								break;

							case 17:
								_context.prev = 17;
								_context.t0 = _context['catch'](6);
								_didIteratorError2 = true;
								_iteratorError2 = _context.t0;

							case 21:
								_context.prev = 21;
								_context.prev = 22;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 24:
								_context.prev = 24;

								if (!_didIteratorError2) {
									_context.next = 27;
									break;
								}

								throw _iteratorError2;

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
				var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, command;

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
								_iteratorNormalCompletion3 = true;
								_didIteratorError3 = false;
								_iteratorError3 = undefined;
								_context2.prev = 6;
								_iterator3 = this.commands[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
									_context2.next = 15;
									break;
								}

								command = _step3.value;
								_context2.next = 12;
								return command.command.unload();

							case 12:
								_iteratorNormalCompletion3 = true;
								_context2.next = 8;
								break;

							case 15:
								_context2.next = 21;
								break;

							case 17:
								_context2.prev = 17;
								_context2.t0 = _context2['catch'](6);
								_didIteratorError3 = true;
								_iteratorError3 = _context2.t0;

							case 21:
								_context2.prev = 21;
								_context2.prev = 22;

								if (!_iteratorNormalCompletion3 && _iterator3.return) {
									_iterator3.return();
								}

							case 24:
								_context2.prev = 24;

								if (!_didIteratorError3) {
									_context2.next = 27;
									break;
								}

								throw _iteratorError3;

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
	}]);

	return Plugin;
}();

exports.default = Plugin;