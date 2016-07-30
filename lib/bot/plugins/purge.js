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
			this.addCommand('purge', Purge);
		}
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;

var Purge = function (_Command) {
	_inherits(Purge, _Command);

	function Purge() {
		_classCallCheck(this, Purge);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Purge).apply(this, arguments));
	}

	_createClass(Purge, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			var allowed;
			return regeneratorRuntime.wrap(function authorize$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							allowed = !msg.channel.isPrivate && // No clearing messages in PMs.
							_plugin.Util.checkPermission(msg.channel, msg.author, 'manageMessages'); // User must have permission to delete messages.

							return _context.abrupt('return', allowed);

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var response, messages;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return this.client.awaitResponse(msg, 'Are you sure you want to delete the last 1000 messages in this channel?');

						case 2:
							response = _context2.sent;

							if (!_plugin.Util.checkAffirmative(response.content)) {
								_context2.next = 12;
								break;
							}

							_context2.next = 6;
							return this.client.sendMessage(msg, 'Alright, I\'m deleting 1000 messages!');

						case 6:
							_context2.next = 8;
							return this.client.getChannelLogs(msg, 1000);

						case 8:
							messages = _context2.sent;


							// Delete them all!
							this.client.deleteMessages(messages);
							_context2.next = 13;
							break;

						case 12:
							// Tell the user the response was negative.
							this.client.sendMessage(msg, 'Okay, I won\'t touch the messages.');

						case 13:
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
			return 'erase the last 1000 messages in the channel';
		}
	}]);

	return Purge;
}(_plugin.Command);