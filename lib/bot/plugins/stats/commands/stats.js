'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stats = function (_Command) {
	_inherits(Stats, _Command);

	function Stats() {
		_classCallCheck(this, Stats);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Stats).apply(this, arguments));
	}

	_createClass(Stats, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
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
							if (!(suffix == 'clear')) {
								_context.next = 4;
								break;
							}

							return _context.abrupt('return', _plugin.Util.checkPermission(msg.channel, msg.author, 'manageMessages'));

						case 4:
							return _context.abrupt('return', true);

						case 5:
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

			var counters, topMessages;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!(suffix == 'clear')) {
								_context2.next = 5;
								break;
							}

							_context2.next = 3;
							return this.plugin.MessageCount.remove({
								'server': msg.server.id
							});

						case 3:

							// Send a confirmation message.
							this.client.sendMessage(msg, 'Stats cleared!');

							return _context2.abrupt('return');

						case 5:
							_context2.next = 7;
							return this.plugin.MessageCount.sort('count', -1).limit(20).find({
								'server': msg.server.id
							});

						case 7:
							counters = _context2.sent;


							// Output the top 20 people.
							topMessages = '**Active Members:**\n';

							topMessages += counters.map(function (c) {
								var count = c.get('count');
								var user = _this2.client.users.get('id', c.get('author'));
								var userDetails = msg.server.detailsOfUser(user);
								var name = userDetails.nick === null ? user.username : userDetails.nick;
								return '`' + name + '`: ' + count + ' message' + (count == 1 ? '' : 's');
							}).join('\n');
							this.client.sendMessage(msg, topMessages);

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

exports.default = Stats;