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
		value: function init() {
			this.addCommand('about', About);
			this.addCommand('source', Source);
			this.addCommand('uptime', Uptime);
		}
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
		value: function init() {
			// About text.
			this.ABOUT = 'I\'m "Ruinous Might Cannon Type", or otherwise known as "RM-C". I was made by Ernesta Kuhne (read: Ruiqi Mao) and if you piss me off, I\'ll seriously hurt you. <3';
		}
	}, {
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			// Everyone is allowed ask about RM-C.
			next(true);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			this.client.sendMessage(msg, this.ABOUT);
		}
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
		value: function init() {
			// Source code URL.
			this.SOURCE = 'https://github.com/ruiqimao/rmc';
		}
	}, {
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			// Everyone is allowed to see the source.
			next(true);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			this.client.sendMessage(msg, this.SOURCE);
		}
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
}(_plugin.Command);