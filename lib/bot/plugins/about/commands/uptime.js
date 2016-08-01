'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Uptime = function (_Command) {
	_inherits(Uptime, _Command);

	function Uptime() {
		_classCallCheck(this, Uptime);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Uptime).apply(this, arguments));
	}

	_createClass(Uptime, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix, next) {
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
			var uptime, date, days, hours, minutes, seconds, segments, dateString;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
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
							return _context2.stop();
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

exports.default = Uptime;