'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Help = function (_Command) {
	_inherits(Help, _Command);

	function Help() {
		_classCallCheck(this, Help);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Help).apply(this, arguments));
	}

	_createClass(Help, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							return _context.abrupt('return', true);

						case 1:
						case 'end':
							return _context.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var entry, helpText, entries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, command, _entry;

			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!(suffix.length > 0)) {
								_context2.next = 7;
								break;
							}

							_context2.next = 3;
							return this.generateEntry(suffix);

						case 3:
							entry = _context2.sent;


							// Check if the entry actually exists.
							if (entry != null) {
								// Reply with the entry.a
								this.client.sendMessage(msg, entry);
							} else {
								// Error!
								this.client.sendMessage(msg, '`' + suffix + '` isn\'t an actual command, dumbass.');
							}
							_context2.next = 39;
							break;

						case 7:
							// Show all help entries.
							helpText = '**Available Directives:**\n';
							entries = [];
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context2.prev = 12;
							_iterator = Object.keys(this.bot.commands)[Symbol.iterator]();

						case 14:
							if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
								_context2.next = 23;
								break;
							}

							command = _step.value;
							_context2.next = 18;
							return this.generateEntry(msg, command);

						case 18:
							_entry = _context2.sent;

							if (_entry != null) {
								entries.push(_entry);
							}

						case 20:
							_iteratorNormalCompletion = true;
							_context2.next = 14;
							break;

						case 23:
							_context2.next = 29;
							break;

						case 25:
							_context2.prev = 25;
							_context2.t0 = _context2['catch'](12);
							_didIteratorError = true;
							_iteratorError = _context2.t0;

						case 29:
							_context2.prev = 29;
							_context2.prev = 30;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 32:
							_context2.prev = 32;

							if (!_didIteratorError) {
								_context2.next = 35;
								break;
							}

							throw _iteratorError;

						case 35:
							return _context2.finish(32);

						case 36:
							return _context2.finish(29);

						case 37:
							helpText += entries.join('\n');
							this.client.sendMessage(msg, helpText);

						case 39:
						case 'end':
							return _context2.stop();
					}
				}
			}, process, this, [[12, 25, 29, 37], [30,, 32, 36]]);
		})

		/*
   * Generates a help entry.
   *
   * @param msg The message that triggered the command.
   * @param command The name of the command to generate the entry from.
   *
   * @return The help entry if the command exists and the user is allowed, null otherwise.
   */

	}, {
		key: 'generateEntry',
		value: regeneratorRuntime.mark(function generateEntry(msg, command) {
			var cmd, entry;
			return regeneratorRuntime.wrap(function generateEntry$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							if (command in this.bot.commands) {
								_context3.next = 2;
								break;
							}

							return _context3.abrupt('return', null);

						case 2:
							_context3.next = 4;
							return this.bot.commands[command].authorize(msg, '');

						case 4:
							if (_context3.sent) {
								_context3.next = 6;
								break;
							}

							return _context3.abrupt('return', null);

						case 6:

							// Get the command.
							cmd = this.bot.commands[command];

							// Construct the entry.

							entry = '`' + this.config.COMMAND_PREFIX + command;

							if (cmd.usage) entry += ' ' + cmd.usage;
							entry += '`: ' + cmd.description;

							// Return the entry.
							return _context3.abrupt('return', entry);

						case 11:
						case 'end':
							return _context3.stop();
					}
				}
			}, generateEntry, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '[command]';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'show this helpful list!';
		}
	}]);

	return Help;
}(_plugin.Command);

exports.default = Help;