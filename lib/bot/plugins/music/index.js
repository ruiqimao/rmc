'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _play = require('./commands/play');

var _play2 = _interopRequireDefault(_play);

var _skip = require('./commands/skip');

var _skip2 = _interopRequireDefault(_skip);

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
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							this.addCommand('play', _play2.default);
							this.addCommand('skip', _skip2.default);

							// Set the constants.
							this.MAX_QUEUE = 20; // Maximum queue size.
							this.INITIAL_BUFFER = 262144; // Initial buffer pass condition (256KB).
							this.MAX_BUFFER = 1048576; // Maximum buffer size (1MB).

							// Set the member variables.
							this.queues = {}; // All queues.
							this.playing = {}; // All servers that are playing.

						case 7:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'destroy',
		value: regeneratorRuntime.mark(function destroy() {
			var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, server, connection;

			return regeneratorRuntime.wrap(function destroy$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							// Stop playing on all servers.
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context2.prev = 3;
							for (_iterator = Object.keys(this.playing)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								server = _step.value;
								connection = this.getVoiceConnection(server);

								if (connection) connection.stopPlaying();
							}
							_context2.next = 11;
							break;

						case 7:
							_context2.prev = 7;
							_context2.t0 = _context2['catch'](3);
							_didIteratorError = true;
							_iteratorError = _context2.t0;

						case 11:
							_context2.prev = 11;
							_context2.prev = 12;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 14:
							_context2.prev = 14;

							if (!_didIteratorError) {
								_context2.next = 17;
								break;
							}

							throw _iteratorError;

						case 17:
							return _context2.finish(14);

						case 18:
							return _context2.finish(11);

						case 19:
						case 'end':
							return _context2.stop();
					}
				}
			}, destroy, this, [[3, 7, 11, 19], [12,, 14, 18]]);
		})

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