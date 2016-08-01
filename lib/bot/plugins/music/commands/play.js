'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _youtubeDl = require('youtube-dl');

var _youtubeDl2 = _interopRequireDefault(_youtubeDl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Play = function (_Command) {
	_inherits(Play, _Command);

	function Play() {
		_classCallCheck(this, Play);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Play).apply(this, arguments));
	}

	_createClass(Play, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							return _context.abrupt('return', this.plugin.authorize(this, msg));

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
			var _this2 = this;

			var queue, response;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							// Get the queue.
							if (!(msg.server.id in this.plugin.queues)) {
								this.plugin.queues[msg.server.id] = [];
							}
							queue = this.plugin.queues[msg.server.id];

							// Check the queue size.

							if (!(queue.length >= this.plugin.MAX_QUEUE)) {
								_context2.next = 4;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'Overload! I can\'t queue that many songs. Feed me more RAM.'));

						case 4:
							if (!(suffix.length == 0)) {
								_context2.next = 6;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'Give me a video, dumbass.'));

						case 6:

							// If the suffix doesn't start with http, assume it's a search.
							if (!suffix.startsWith('http')) {
								suffix = 'gvsearch1:' + suffix;
							}

							// Send a confirmation message.
							_context2.next = 9;
							return this.client.sendMessage(msg, 'Okay, I\'m looking for that video.');

						case 9:
							response = _context2.sent;


							// Get the video info.
							_youtubeDl2.default.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], function (err, info) {
								if (err || info.format_id.startsWith('0')) {
									// Unknown format is invalid.
									return _this2.client.updateMessage(response, msg.author + ', that\'s not a real video, stupid.');
								}

								// Send a message confirming the video's been added.
								var title = info.title.replace(/`/g, '\\`');
								_this2.client.updateMessage(response, 'I\'ve queued up `' + title + '`.');

								// Add the video to queue.
								_this2.plugin.addToQueue(_this2, msg.channel, info, queue);
							});

						case 11:
						case 'end':
							return _context2.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '<video-url>|<search>';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'play audio from a video (YouTube, Vimeo, Youku, etc.)';
		}
	}]);

	return Play;
}(_plugin.Command);

exports.default = Play;