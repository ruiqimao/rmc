'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClearRSS = function (_Command) {
	_inherits(ClearRSS, _Command);

	function ClearRSS() {
		_classCallCheck(this, ClearRSS);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ClearRSS).apply(this, arguments));
	}

	_createClass(ClearRSS, [{
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
			var entries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry;

			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return this.plugin.Feed.find({
								channel: msg.channel.id
							});

						case 2:
							entries = _context2.sent;


							// Stop all of them and remove them.
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context2.prev = 6;
							_iterator = entries[Symbol.iterator]();

						case 8:
							if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
								_context2.next = 16;
								break;
							}

							entry = _step.value;

							this.plugin.stopFeed(entry);
							_context2.next = 13;
							return entry.remove();

						case 13:
							_iteratorNormalCompletion = true;
							_context2.next = 8;
							break;

						case 16:
							_context2.next = 22;
							break;

						case 18:
							_context2.prev = 18;
							_context2.t0 = _context2['catch'](6);
							_didIteratorError = true;
							_iteratorError = _context2.t0;

						case 22:
							_context2.prev = 22;
							_context2.prev = 23;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 25:
							_context2.prev = 25;

							if (!_didIteratorError) {
								_context2.next = 28;
								break;
							}

							throw _iteratorError;

						case 28:
							return _context2.finish(25);

						case 29:
							return _context2.finish(22);

						case 30:

							this.client.sendMessage(msg, 'Okay, all RSS feeds have been cleared!');

						case 31:
						case 'end':
							return _context2.stop();
					}
				}
			}, process, this, [[6, 18, 22, 30], [23,, 25, 29]]);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'remove all RSS feeds on this channel';
		}
	}]);

	return ClearRSS;
}(_plugin.Command);

exports.default = ClearRSS;