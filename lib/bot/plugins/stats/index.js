'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _stats = require('./commands/stats');

var _stats2 = _interopRequireDefault(_stats);

var _profile = require('./commands/profile');

var _profile2 = _interopRequireDefault(_profile);

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
							this.addCommand('stats', _stats2.default);
							this.addCommand('profile', _profile2.default);

							// Create a class for message counts.
							this.MessageCount = this.createModel('messagecount');

							// Listen for messages.
							this.client.on('message', function (msg) {
								// Ignore if the message is private.
								if (msg.channel.isPrivate) return;

								(0, _co2.default)(_this2.incrementMessageCount.bind(_this2), msg);
							});

						case 4:
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
	}, {
		key: 'getData',
		value: regeneratorRuntime.mark(function getData(id) {
			var server, users, messageCounts, counts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, count, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, user, details, result;

			return regeneratorRuntime.wrap(function getData$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							// Get the server.
							server = this.client.servers.get('id', id);

							// Get all the users from the server.

							users = server.members;

							// Get all message counts.

							_context3.next = 4;
							return this.MessageCount.find({
								'server': id
							});

						case 4:
							messageCounts = _context3.sent;
							counts = {};
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context3.prev = 9;

							for (_iterator = messageCounts[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								count = _step.value;

								counts[count.get('author')] = count.get('count');
							}

							// Create a list of results.
							_context3.next = 17;
							break;

						case 13:
							_context3.prev = 13;
							_context3.t0 = _context3['catch'](9);
							_didIteratorError = true;
							_iteratorError = _context3.t0;

						case 17:
							_context3.prev = 17;
							_context3.prev = 18;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 20:
							_context3.prev = 20;

							if (!_didIteratorError) {
								_context3.next = 23;
								break;
							}

							throw _iteratorError;

						case 23:
							return _context3.finish(20);

						case 24:
							return _context3.finish(17);

						case 25:
							results = [];

							// Iterate through all the users.

							_iteratorNormalCompletion2 = true;
							_didIteratorError2 = false;
							_iteratorError2 = undefined;
							_context3.prev = 29;
							for (_iterator2 = users[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								user = _step2.value;
								details = server.detailsOfUser(user);
								result = {
									id: user.id,
									username: user.username,
									nick: details.nick,
									avatar: user.avatarURL,
									messages: 0,
									bot: user.bot
								};


								if (counts[user.id] !== undefined) result.messages = counts[user.id];

								// Add to the results.
								results.push(result);
							}

							// Return the sorted results (by message count).
							_context3.next = 37;
							break;

						case 33:
							_context3.prev = 33;
							_context3.t1 = _context3['catch'](29);
							_didIteratorError2 = true;
							_iteratorError2 = _context3.t1;

						case 37:
							_context3.prev = 37;
							_context3.prev = 38;

							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}

						case 40:
							_context3.prev = 40;

							if (!_didIteratorError2) {
								_context3.next = 43;
								break;
							}

							throw _iteratorError2;

						case 43:
							return _context3.finish(40);

						case 44:
							return _context3.finish(37);

						case 45:
							return _context3.abrupt('return', results.sort(function (a, b) {
								return b.messages - a.messages;
							}));

						case 46:
						case 'end':
							return _context3.stop();
					}
				}
			}, getData, this, [[9, 13, 17, 25], [18,, 20, 24], [29, 33, 37, 45], [38,, 40, 44]]);
		})
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;