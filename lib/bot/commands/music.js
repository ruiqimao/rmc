'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Skip = exports.Play = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _youtubeDl = require('youtube-dl');

var _youtubeDl2 = _interopRequireDefault(_youtubeDl);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bufferStream = require('buffer-stream');

var _bufferStream2 = _interopRequireDefault(_bufferStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var musicSingleton = Symbol();

var Music = function () {
	_createClass(Music, null, [{
		key: 'instance',


		/*
   * Get the instance of the singleton.
   */
		get: function get() {
			if (!this[musicSingleton]) {
				this[musicSingleton] = new Music();
			}
			return this[musicSingleton];
		}

		/*
   * Constructor.
   */

	}]);

	function Music() {
		_classCallCheck(this, Music);

		this.queues = {}; // All queues.
		this.playing = {}; // All servers that are playing.
	}

	_createClass(Music, [{
		key: 'addToQueue',


		/*
   * Add a video to the queue.
   *
   * @param command The command.
   * @param channel A channel.
   * @param vid The URL and title of the video.
   * @param queue The queue to add to.
   */
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
			var _this = this;

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
			var buffer = new _bufferStream2.default(Music.INITIAL_BUFFER, Music.MAX_BUFFER);
			_request2.default.get(vid.url).pipe(buffer);

			// Start streaming.
			connection.playRawStream(buffer, function (err, intent) {
				if (err) return command.errorOccurred(msg);

				// Catch EPIPE in the connection.
				connection.streamProc.stdin.on('error', function () {});

				// Catch all errors.
				intent.on('error', function () {});

				// Catch the end event.
				intent.on('end', function () {
					setTimeout(function () {
						// Play the next song in the queue.
						_this.playQueue(command, channel, queue);
					}, 2000); // But first wait 2 seconds.
				});
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
	}], [{
		key: 'authorize',
		// Maximum buffer size (1MB).

		/*
   * Common authorization requirements.
   */
		value: function authorize(command, msg, next) {
			var connection = command.getVoiceConnection(msg.server);
			var allowed = connection != null && // Must be connected to a voice channel.
			msg.author.voiceChannel != null && // User must be connected to a voice channel.
			connection.voiceChannel.equals(msg.author.voiceChannel); // Must be connected to the same voice channel.
			next(allowed);
		}
	}, {
		key: 'MAX_QUEUE',
		get: function get() {
			return 20;
		} // Maximum queue size.

	}, {
		key: 'INITIAL_BUFFER',
		get: function get() {
			return 262144;
		} // Initial buffer pass condition (256KB).

	}, {
		key: 'MAX_BUFFER',
		get: function get() {
			return 1048576;
		}
	}]);

	return Music;
}();

var Play = exports.Play = function (_Command) {
	_inherits(Play, _Command);

	function Play() {
		_classCallCheck(this, Play);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Play).apply(this, arguments));
	}

	_createClass(Play, [{
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			Music.authorize(this, msg, next);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			var _this3 = this;

			// Get the queue.
			if (!(msg.server.id in Music.instance.queues)) {
				Music.instance.queues[msg.server.id] = [];
			}
			var queue = Music.instance.queues[msg.server.id];

			// Check the queue size.
			if (queue.length >= Music.MAX_QUEUE) {
				return this.client.reply(msg, 'Overload! I can\'t queue that many songs. Feed me more RAM.');
			}

			// Validate the argument.
			if (suffix.length == 0) {
				return this.client.reply(msg, 'Give me a video, dumbass.');
			}

			// Send a confirmation message.
			this.client.sendMessage(msg, 'Okay, I\'m looking for that video.', function (err, response) {
				if (err) return _this3.errorOccured(msg);

				// If the suffix doesn't start with http, assume it's a search.
				if (!suffix.startsWith('http')) {
					suffix = 'gvsearch1:' + suffix;
				}

				// Get the video info.
				_youtubeDl2.default.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], function (err, info) {
					if (err || info.format_id.startsWith('0')) {
						// Unknown format is invalid.
						return _this3.client.updateMessage(response, msg.author + ', that\'s not a real video, stupid.');
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
					_this3.client.updateMessage(response, 'I\'ve queued up `' + title + '`.');

					// Add the video to queue.
					Music.instance.addToQueue(_this3, msg.channel, info, queue);
				});
			});
		}
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
}(_command2.default);

var Skip = exports.Skip = function (_Command2) {
	_inherits(Skip, _Command2);

	function Skip() {
		_classCallCheck(this, Skip);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Skip).apply(this, arguments));
	}

	_createClass(Skip, [{
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			Music.authorize(this, msg, next);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			// Get the voice connection.
			var connection = this.getVoiceConnection(msg.server);

			// Check the number.
			if (suffix == 'all') {
				// Skip everthing.
				Music.instance.clearQueue(msg.server);
			} else if (suffix == '') {
				// Just skip one, so do nothing here.
			} else {
				// Check if the number is valid and positive.
				var number = void 0;
				if (isNaN(suffix) || (number = parseInt(suffix)) < 0) {
					this.client.reply(msg, 'Are you serious? Go back to school and learn math again, please.');
					return;
				}

				// Remove the appropriate number of entries from the queue.
				if (msg.server.id in Music.instance.queues) {
					var queue = Music.instance.queues[msg.server.id];
					while (queue.length > 0 && number-- > 1) {
						queue.shift();
					}
				}
			}

			// Stop playback.
			connection.stopPlaying();

			// Send a message.
			var skipString = 'Okay, skipped';
			if (suffix) skipString += ' ' + suffix;
			skipString += '!';
			this.client.sendMessage(msg, skipString);
		}
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
}(_command2.default);