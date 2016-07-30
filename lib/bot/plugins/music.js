'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _youtubeDl = require('youtube-dl');

var _youtubeDl2 = _interopRequireDefault(_youtubeDl);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bufferStream = require('buffer-stream');

var _bufferStream2 = _interopRequireDefault(_bufferStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
			this.addCommand('play', Play);
			this.addCommand('skip', Skip);

			// Set the constants.
			this.MAX_QUEUE = 20; // Maximum queue size.
			this.INITIAL_BUFFER = 262144; // Initial buffer pass condition (256KB).
			this.MAX_BUFFER = 1048576; // Maximum buffer size (1MB).

			// Set the member variables.
			this.queues = {}; // All queues.
			this.playing = {}; // All servers that are playing.
		}

		/*
   * Common authorization requirements.
   */

	}, {
		key: 'authorize',
		value: function authorize(command, msg) {
			var connection = command.getVoiceConnection(msg.server);
			var allowed = connection != null && // Must be connected to a voice channel.
			msg.author.voiceChannel != null && // User must be connected to a voice channel.
			connection.voiceChannel.equals(msg.author.voiceChannel); // Must be connected to the same voice channel.
			return allowed;
		}

		/*
   * Add a video to the queue.
   *
   * @param command The command.
   * @param channel A channel.
   * @param vid The URL and title of the video.
   * @param queue The queue to add to.
   */

	}, {
		key: 'addToQueue',
		value: function addToQueue(command, channel, vid, queue) {
			// Add to the queue.
			queue.push(vid);

			// Start playing if not currently playing and the queue size is 1.
			if (!(channel.server.id in this.playing) && queue.length == 1) this.playQueue(command, channel, queue);
		}

		/*
   * Play the first song in the queue.
   *
   * @param command The command.
   * @param channel A channel.
   * @param queue The queue to play from.
   */

	}, {
		key: 'playQueue',
		value: function playQueue(command, channel, queue) {
			var _this2 = this;

			// Get the voice connection.
			var connection = command.getVoiceConnection(channel.server);

			// If the queue is empty or the connection doesn't exist, delete the queue.
			if (queue.length == 0 || connection == null) {
				// Not playing anymore.
				this.clearQueue(channel.server);

				// Send a message if still connected to the voice channel.
				if (connection != null) command.client.sendMessage(channel, 'I\'m all out of songs to play!');
				return;
			}

			// Get the first video from the queue.
			var vid = queue.shift();

			// Set the server to playing.
			this.playing[channel.server.id] = true;

			// Send a message saying what is being played.
			command.client.sendMessage(channel, 'I\'m now playing `' + vid.title + '`.');

			// Pipe the video into a buffer stream.
			var buffer = new _bufferStream2.default(this.INITIAL_BUFFER, this.MAX_BUFFER);
			_request2.default.get(vid.url).pipe(buffer);

			// Start streaming.
			connection.playRawStream(buffer).then(function (intent) {
				// Catch EPIPE in the connection.
				connection.streamProc.stdin.on('error', function () {});

				// Catch all errors.
				intent.on('error', function (err) {});

				// Catch the end event.
				intent.on('end', function () {
					setTimeout(function () {
						// Play the next song in the queue.
						_this2.playQueue(command, channel, queue);
					}, 2000); // But first wait 2 seconds.
				});
			}).catch(function () {
				command.errorOccurred();
			});
		}

		/*
   * Clear a queue.
   *
   * @param server The server whose queue to clear.
   */

	}, {
		key: 'clearQueue',
		value: function clearQueue(server) {
			if (server.id in this.queues) this.queues[server.id].length = 0;
			delete this.queues[server.id];
			delete this.playing[server.id];
		}
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;

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
			var _this4 = this;

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
							_context2.next = 8;
							return this.client.sendMessage(msg, 'Okay, I\'m looking for that video.');

						case 8:
							response = _context2.sent;


							// If the suffix doesn't start with http, assume it's a search.
							if (!suffix.startsWith('http')) {
								suffix = 'gvsearch1:' + suffix;
							}

							// Get the video info.
							_youtubeDl2.default.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], function (err, info) {
								if (err || info.format_id.startsWith('0')) {
									// Unknown format is invalid.
									return _this4.client.updateMessage(response, msg.author + ', that\'s not a real video, stupid.');
								}

								// Get an audio-only format if possible.
								if (info.formats) {
									var audioFormats = info.formats.filter(function (f) {
										return f.vcodec == 'none';
									});
									if (audioFormats.length > 0) info.url = audioFormats[0].url;
								}

								// Send a message confirming the video's been added.
								var title = info.title.replace(/`/g, '\\`');
								_this4.client.updateMessage(response, 'I\'ve queued up `' + title + '`.');

								// Add the video to queue.
								_this4.plugin.addToQueue(_this4, msg.channel, info, queue);
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

var Skip = function (_Command2) {
	_inherits(Skip, _Command2);

	function Skip() {
		_classCallCheck(this, Skip);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Skip).apply(this, arguments));
	}

	_createClass(Skip, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							return _context3.abrupt('return', this.plugin.authorize(this, msg));

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
			var connection, number, queue, skipString;
			return regeneratorRuntime.wrap(function process$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							// Get the voice connection.
							connection = this.getVoiceConnection(msg.server);

							// Check the number.

							if (!(suffix == 'all')) {
								_context4.next = 5;
								break;
							}

							// Skip everthing.
							this.plugin.clearQueue(msg.server);
							_context4.next = 13;
							break;

						case 5:
							if (!(suffix == '')) {
								_context4.next = 8;
								break;
							}

							_context4.next = 13;
							break;

						case 8:
							// Check if the number is valid and positive.
							number = void 0;

							if (!(isNaN(suffix) || (number = parseInt(suffix)) < 0)) {
								_context4.next = 12;
								break;
							}

							this.client.reply(msg, 'Are you serious? Go back to school and learn math again, please.');
							return _context4.abrupt('return');

						case 12:

							// Remove the appropriate number of entries from the queue.
							if (msg.server.id in this.plugin.queues) {
								queue = this.plugin.queues[msg.server.id];

								while (queue.length > 0 && number-- > 1) {
									queue.shift();
								}
							}

						case 13:

							// Stop playback.
							connection.stopPlaying();

							// Send a message.
							skipString = 'Okay, skipped';

							if (suffix) skipString += ' ' + suffix;
							skipString += '!';
							this.client.sendMessage(msg, skipString);

						case 18:
						case 'end':
							return _context4.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '[number|all]';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'skip 1 or more songs';
		}
	}]);

	return Skip;
}(_plugin.Command);