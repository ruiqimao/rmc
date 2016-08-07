'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RSS = function (_Command) {
	_inherits(RSS, _Command);

	function RSS() {
		_classCallCheck(this, RSS);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RSS).apply(this, arguments));
	}

	_createClass(RSS, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			var commander;
			return regeneratorRuntime.wrap(function authorize$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							if (!msg.channel.isPrivate) {
								_context.next = 2;
								break;
							}

							return _context.abrupt('return', false);

						case 2:
							_context.next = 4;
							return this.bot.Commander.getEntry(msg.server.id, '');

						case 4:
							commander = _context.sent.val();
							return _context.abrupt('return', _plugin.Util.checkRole(msg.server, msg.author, commander));

						case 6:
						case 'end':
							return _context.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var feed;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context2.next = 2;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'Give me a feed to read, idiot.'));

						case 2:

							// Create a new Feed.
							feed = new this.plugin.Feed({
								server: msg.server.id,
								feed: suffix,
								channel: msg.channel.id,
								lastGUID: '',
								refresh: 5,
								running: false
							});
							_context2.next = 5;
							return feed.save();

						case 5:
							_context2.next = 7;
							return this.client.sendMessage(msg, 'Okay, I\'ve started an RSS feed!');

						case 7:

							// Start the feed.
							this.plugin.startFeed(feed);

						case 8:
						case 'end':
							return _context2.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '<feed URL>';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'start an RSS feed';
		}
	}]);

	return RSS;
}(_plugin.Command);

exports.default = RSS;