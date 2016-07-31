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
							this.addCommand('about', About);
							this.addCommand('source', Source);
							this.addCommand('uptime', Uptime);

						case 3:
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

var About = function (_Command) {
	_inherits(About, _Command);

	function About() {
		_classCallCheck(this, About);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(About).apply(this, arguments));
	}

	_createClass(About, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							// About text.
							this.ABOUT = 'I\'m "Ruinous Might Cannon Type", or otherwise known as "RM-C". I was made by Ernesta Kuhne (read: Ruiqi Mao) and if you piss me off, I\'ll seriously hurt you. <3';

						case 1:
						case 'end':
							return _context2.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							return _context3.abrupt('return', true);

						case 1:
						case 'end':
							return _context3.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			return regeneratorRuntime.wrap(function process$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							this.client.sendMessage(msg, this.ABOUT);

						case 1:
						case 'end':
							return _context4.stop();
					}
				}
			}, process, this);
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

var Source = function (_Command2) {
	_inherits(Source, _Command2);

	function Source() {
		_classCallCheck(this, Source);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Source).apply(this, arguments));
	}

	_createClass(Source, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							// Source code URL.
							this.SOURCE = 'https://github.com/ruiqimao/rmc';

						case 1:
						case 'end':
							return _context5.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context6) {
				while (1) {
					switch (_context6.prev = _context6.next) {
						case 0:
							return _context6.abrupt('return', true);

						case 1:
						case 'end':
							return _context6.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			return regeneratorRuntime.wrap(function process$(_context7) {
				while (1) {
					switch (_context7.prev = _context7.next) {
						case 0:
							this.client.sendMessage(msg, this.SOURCE);

						case 1:
						case 'end':
							return _context7.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'see my source code';
		}
	}]);

	return Source;
}(_plugin.Command);

var Uptime = function (_Command3) {
	_inherits(Uptime, _Command3);

	function Uptime() {
		_classCallCheck(this, Uptime);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Uptime).apply(this, arguments));
	}

	_createClass(Uptime, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix, next) {
			return regeneratorRuntime.wrap(function authorize$(_context8) {
				while (1) {
					switch (_context8.prev = _context8.next) {
						case 0:
							return _context8.abrupt('return', true);

						case 1:
						case 'end':
							return _context8.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var uptime, date, days, hours, minutes, seconds, segments, dateString;
			return regeneratorRuntime.wrap(function process$(_context9) {
				while (1) {
					switch (_context9.prev = _context9.next) {
						case 0:
							// Get the client uptime.
							uptime = this.client.uptime;

							// Convert the time to a readable format.

							date = new Date(uptime);
							days = date.getUTCDate() - 1, hours = date.getUTCHours(), minutes = date.getUTCMinutes(), seconds = date.getUTCSeconds();
							segments = [];

							if (days > 0) segments.push(days + ' day' + (days == 1 ? '' : 's'));
							if (hours > 0) segments.push(hours + ' hour' + (hours == 1 ? '' : 's'));
							if (minutes > 0) segments.push(minutes + ' minute' + (minutes == 1 ? '' : 's'));
							if (seconds > 0) segments.push(seconds + ' second' + (seconds == 1 ? '' : 's'));
							dateString = segments.join(', ');

							// Return the choice.

							this.client.sendMessage(msg, 'I\'ve been running for **' + dateString + '**!');

						case 10:
						case 'end':
							return _context9.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'find out how long I\'ve been running';
		}
	}]);

	return Uptime;
}(_plugin.Command);