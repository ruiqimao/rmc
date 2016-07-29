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
			this.addCommand('join', Join);
			this.addCommand('leave', Leave);
		}
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;

var Join = function (_Command) {
	_inherits(Join, _Command);

	function Join() {
		_classCallCheck(this, Join);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Join).apply(this, arguments));
	}

	_createClass(Join, [{
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			var allowed = !msg.channel.isPrivate && // Cannot be PM.
			_plugin.Util.checkRole(msg.server, msg.author, this.config.COMMANDER); // Must be a commander.
			next(allowed);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			// Get the voice channel to join.
			var channel = msg.author.voiceChannel;

			// If the channel is null, don't do anything.
			if (channel == null) {
				return this.client.reply(msg, 'You\'re not in a voice channel, dummy.');
			}

			// Join the channel.
			this.client.joinVoiceChannel(channel);
		}
	}, {
		key: 'usage',
		get: function get() {
			return '';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'join a voice channel';
		}
	}]);

	return Join;
}(_plugin.Command);

var Leave = function (_Command2) {
	_inherits(Leave, _Command2);

	function Leave() {
		_classCallCheck(this, Leave);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Leave).apply(this, arguments));
	}

	_createClass(Leave, [{
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			var allowed = !msg.channel.isPrivate && // Cannot be PM.
			_plugin.Util.checkRole(msg.server, msg.author, this.config.COMMANDER); // Must be a commander.
			next(allowed);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			var connection = this.getVoiceConnection(msg.server);

			// If not connected to a voice channel on the server, don't do anything.
			if (connection == null) {
				return this.client.reply(msg, 'I\'m not in a voice channel, dummy.');
			}

			// Stop playing if doing so.
			if (connection.playing) connection.stopPlaying();

			// Leave the voice channel.
			this.client.leaveVoiceChannel(connection.voiceChannel);
		}
	}, {
		key: 'usage',
		get: function get() {
			return '';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'leave a voice channel';
		}
	}]);

	return Leave;
}(_plugin.Command);