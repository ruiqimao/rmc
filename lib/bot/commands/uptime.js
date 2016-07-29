'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
		value: function authorize(msg, suffix, next) {
			// Everyone is allowed to check uptime.
			next(true);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			// Get the client uptime.
			var uptime = this.client.uptime;

			// Convert the time to a readable format.
			var date = new Date(uptime);
			var days = date.getUTCDate() - 1,
			    hours = date.getUTCHours(),
			    minutes = date.getUTCMinutes(),
			    seconds = date.getUTCSeconds();
			var segments = [];
			if (days > 0) segments.push(days + ' day' + (days == 1 ? '' : 's'));
			if (hours > 0) segments.push(hours + ' hour' + (hours == 1 ? '' : 's'));
			if (minutes > 0) segments.push(minutes + ' minute' + (minutes == 1 ? '' : 's'));
			if (seconds > 0) segments.push(seconds + ' second' + (seconds == 1 ? '' : 's'));
			var dateString = segments.join(', ');

			// Return the choice.
			this.client.sendMessage(msg, 'I\'ve been running for **' + dateString + '**!');
		}
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
}(_command2.default);

exports.default = Uptime;