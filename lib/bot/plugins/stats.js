'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

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
			var _this2 = this;

			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							this.addCommand('stats', Stats);

							// Create a class for message counts.
							this.MessageCount = this.createModel('messagecount');

							// Listen for messages.
							this.client.on('message', function (msg) {
								(0, _co2.default)(_this2.incrementMessageCount.bind(_this2), msg);
							});

						case 3:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})

		/*
   * Increment message count.
   *
   * @param The message that triggered the counter.
   */

	}, {
		key: 'incrementMessageCount',
		value: regeneratorRuntime.mark(function incrementMessageCount(msg) {
			var count, counters;
			return regeneratorRuntime.wrap(function incrementMessageCount$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							// Get the message count for the author.
							count = void 0;
							_context2.next = 3;
							return this.MessageCount.limit(1).find({
								'server': msg.server.id,
								'author': msg.author.id
							});

						case 3:
							counters = _context2.sent;

							if (counters.length > 0) {
								count = counters[0];
							} else {
								count = new this.MessageCount({
									'server': msg.server.id,
									'author': msg.author.id,
									'count': 0
								});
							}

							// Increment the count.
							count.set('count', count.get('count') + 1);

							// Save the counter.
							_context2.next = 8;
							return count.save();

						case 8:
						case 'end':
							return _context2.stop();
					}
				}
			}, incrementMessageCount, this);
		})
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;

var Stats = function (_Command) {
	_inherits(Stats, _Command);

	function Stats() {
		_classCallCheck(this, Stats);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Stats).apply(this, arguments));
	}

	_createClass(Stats, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							if (!(suffix == 'clear')) {
								_context3.next = 2;
								break;
							}

							return _context3.abrupt('return', _plugin.Util.checkPermission(msg.channel, msg.author, 'manageMessages'));

						case 2:
							return _context3.abrupt('return', true);

						case 3:
						case 'end':
							return _context3.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var _this4 = this;

			var counters, topMessages;
			return regeneratorRuntime.wrap(function process$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							if (!(suffix == 'clear')) {
								_context4.next = 5;
								break;
							}

							_context4.next = 3;
							return this.plugin.MessageCount.remove({
								'server': msg.server.id
							});

						case 3:

							// Send a confirmation message.
							this.client.sendMessage(msg, 'Stats cleared!');

							return _context4.abrupt('return');

						case 5:
							_context4.next = 7;
							return this.plugin.MessageCount.sort('count', -1).limit(20).find({
								'server': msg.server.id
							});

						case 7:
							counters = _context4.sent;


							// Output the top 20 people.
							topMessages = '**Active Members:**\n';

							topMessages += counters.map(function (c) {
								var count = c.get('count');
								var user = _this4.client.users.get('id', c.get('author'));
								var userDetails = msg.server.detailsOfUser(user);
								var name = userDetails.nick === null ? user.username : userDetails.nick;
								return '`' + name + '`: ' + count + ' message' + (count == 1 ? '' : 's');
							}).join('\n');
							this.client.sendMessage(msg, topMessages);

						case 11:
						case 'end':
							return _context4.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '[clear]';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'get the stats for the server';
		}
	}]);

	return Stats;
}(_plugin.Command);