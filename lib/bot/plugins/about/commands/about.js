'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ABOUT = 'I\'m "Ruinous Might Cannon Type", or otherwise known as "RM-C". I was made by Ernesta Kuhne (read: Ruiqi Mao) and if you piss me off, I\'ll seriously hurt you. <3';

var About = function (_Command) {
	_inherits(About, _Command);

	function About() {
		_classCallCheck(this, About);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(About).apply(this, arguments));
	}

	_createClass(About, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							// Create the model for about text.
							this.About = this.createModel('about-text');

						case 1:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
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
			var text;
			return regeneratorRuntime.wrap(function process$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							_context3.next = 2;
							return this.About.getEntry(msg.server.id, ABOUT);

						case 2:
							text = _context3.sent.val();

							this.client.sendMessage(msg, text);

						case 4:
						case 'end':
							return _context3.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'getData',
		value: regeneratorRuntime.mark(function getData(id) {
			return regeneratorRuntime.wrap(function getData$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							_context4.next = 2;
							return this.About.getEntry(id, ABOUT);

						case 2:
							return _context4.abrupt('return', _context4.sent.val());

						case 3:
						case 'end':
							return _context4.stop();
					}
				}
			}, getData, this);
		})
	}, {
		key: 'saveData',
		value: regeneratorRuntime.mark(function saveData(id, data) {
			var entry;
			return regeneratorRuntime.wrap(function saveData$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							_context5.next = 2;
							return this.About.getEntry(id, ABOUT);

						case 2:
							entry = _context5.sent;

							entry.val(data.trim());
							_context5.next = 6;
							return entry.save();

						case 6:
						case 'end':
							return _context5.stop();
					}
				}
			}, saveData, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'about me!';
		}
	}]);

	return About;
}(_plugin.Command);

exports.default = About;