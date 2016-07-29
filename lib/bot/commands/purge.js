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

var Purge = function (_Command) {
	_inherits(Purge, _Command);

	function Purge() {
		_classCallCheck(this, Purge);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Purge).apply(this, arguments));
	}

	_createClass(Purge, [{
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			var allowed = !msg.channel.isPrivate && // No clearing messages in PMs.
			_command.Util.checkPermission(msg.channel, msg.author, 'manageMessages'); // User must have permission to delete messages.
			next(allowed);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			var _this2 = this;

			// Confirm the command.
			this.client.awaitResponse(msg, 'Are you sure you want to delete the last 1000 messages in this channel?', function (err, msg) {
				if (err) return _this2.errorOccurred(msg);

				// Check whether the response was affirmative.
				if (_command.Util.checkAffirmative(msg.content)) {
					// Tell the user the messages are being deleted.
					_this2.client.sendMessage(msg, 'Alright, I\'m deleting 1000 messages!', function () {
						// Delete all messages!
						_this2.purgeMessages(msg.channel);
					});
				} else {
					// Tell the user the response was negative.
					_this2.client.sendMessage(msg, 'Okay, I won\'t touch the messages.');
				}
			});
		}

		/*
   * Delete the last 1000 messages.
   *
   * @param channel The channel.
   */

	}, {
		key: 'purgeMessages',
		value: function purgeMessages(channel) {
			var _this3 = this;

			// Get the message logs.
			this.client.getChannelLogs(channel, 1000, function (err, messages) {
				if (err) return;

				// Delete them all!
				_this3.client.deleteMessages(messages);
			});
		}
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
}(_command2.default);

exports.default = Purge;