'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Plugin) {
	_inherits(_class, _Plugin);

	function _class() {
		_classCallCheck(this, _class);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	}

	_createClass(_class, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							this.addCommand('choose', Choose);

						case 1:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;

var Choose = function (_Command) {
	_inherits(Choose, _Command);

	function Choose() {
		_classCallCheck(this, Choose);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Choose).apply(this, arguments));
	}

	_createClass(Choose, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix, next) {
			return regeneratorRuntime.wrap(function authorize$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							return _context2.abrupt('return', true);

						case 1:
						case 'end':
							return _context2.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var choices, index;
			return regeneratorRuntime.wrap(function process$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							// Get all the choices and weed out the blank ones.
							choices = suffix.split(';').map(function (c) {
								return c.trim();
							}).filter(function (c) {
								return c.length > 0;
							});

							// Make sure there is at least one choice.

							if (!(choices.length == 0)) {
								_context3.next = 4;
								break;
							}

							this.client.reply(msg, 'You have to give me at least one choice, idiot.');
							return _context3.abrupt('return');

						case 4:

							// Generate a random number and turn it into an index.
							index = Math.floor(Math.random() * choices.length);

							// Return the choice.

							this.client.sendMessage(msg, choices[index]);

						case 6:
						case 'end':
							return _context3.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '<choice1>;[choice2];...';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'randomly choose something';
		}
	}]);

	return Choose;
}(_plugin.Command);