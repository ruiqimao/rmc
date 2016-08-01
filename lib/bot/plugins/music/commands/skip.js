'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Skip = function (_Command) {
	_inherits(Skip, _Command);

	function Skip() {
		_classCallCheck(this, Skip);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Skip).apply(this, arguments));
	}

	_createClass(Skip, [{
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
			var connection, number, queue, skipString;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							// Get the voice connection.
							connection = this.getVoiceConnection(msg.server);

							// Check the number.

							if (!(suffix == 'all')) {
								_context2.next = 5;
								break;
							}

							// Skip everthing.
							this.plugin.clearQueue(msg.server);
							_context2.next = 13;
							break;

						case 5:
							if (!(suffix == '')) {
								_context2.next = 8;
								break;
							}

							_context2.next = 13;
							break;

						case 8:
							// Check if the number is valid and positive.
							number = void 0;

							if (!(isNaN(suffix) || (number = parseInt(suffix)) < 0)) {
								_context2.next = 12;
								break;
							}

							this.client.reply(msg, 'Are you serious? Go back to school and learn math again, please.');
							return _context2.abrupt('return');

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
							return _context2.stop();
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

exports.default = Skip;