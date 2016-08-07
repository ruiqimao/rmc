'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _feedparser = require('feedparser');

var _feedparser2 = _interopRequireDefault(_feedparser);

var _rss = require('./commands/rss');

var _rss2 = _interopRequireDefault(_rss);

var _clearrss = require('./commands/clearrss');

var _clearrss2 = _interopRequireDefault(_clearrss);

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
							// Add commands.
							this.addCommand('rss', _rss2.default);
							this.addCommand('clearrss', _clearrss2.default);

							// Create models.
							this.Feed = this.createModel('rss-feed');

							// Create an object of feeds.
							this.feeds = {};

							// Start all feeds.
							_context.next = 6;
							return this.Feed.find();

						case 6:
							_context.t0 = function (feed) {
								return _this2.startFeed(feed);
							};

							_context.sent.map(_context.t0);

						case 8:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'getData',
		value: regeneratorRuntime.mark(function getData(id) {
			var entries, feeds;
			return regeneratorRuntime.wrap(function getData$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return this.Feed.find({
								'server': id
							});

						case 2:
							entries = _context2.sent;
							feeds = entries.map(function (entry) {
								return {
									id: entry.get('_id'),
									feed: entry.get('feed'),
									channel: entry.get('channel'),
									refresh: entry.get('refresh'),
									running: entry.get('running')
								};
							});

							// Return the feeds.

							return _context2.abrupt('return', feeds);

						case 5:
						case 'end':
							return _context2.stop();
					}
				}
			}, getData, this);
		})
	}, {
		key: 'saveData',
		value: regeneratorRuntime.mark(function saveData(id, data) {
			var feeds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, feed, entries, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, entry, updated;

			return regeneratorRuntime.wrap(function saveData$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							// Turn the data into an object.
							feeds = {};
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context3.prev = 4;

							for (_iterator = data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								feed = _step.value;

								feeds[feed.id] = feed;
							}

							// Find all the Feeds.
							_context3.next = 12;
							break;

						case 8:
							_context3.prev = 8;
							_context3.t0 = _context3['catch'](4);
							_didIteratorError = true;
							_iteratorError = _context3.t0;

						case 12:
							_context3.prev = 12;
							_context3.prev = 13;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 15:
							_context3.prev = 15;

							if (!_didIteratorError) {
								_context3.next = 18;
								break;
							}

							throw _iteratorError;

						case 18:
							return _context3.finish(15);

						case 19:
							return _context3.finish(12);

						case 20:
							_context3.next = 22;
							return this.Feed.find({
								'server': id
							});

						case 22:
							entries = _context3.sent;


							// Update all the Feeds.
							_iteratorNormalCompletion2 = true;
							_didIteratorError2 = false;
							_iteratorError2 = undefined;
							_context3.prev = 26;
							_iterator2 = entries[Symbol.iterator]();

						case 28:
							if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
								_context3.next = 46;
								break;
							}

							entry = _step2.value;
							updated = feeds[entry.get('_id')];

							if (!(updated === undefined)) {
								_context3.next = 37;
								break;
							}

							// Removed.
							this.stopFeed(entry);
							_context3.next = 35;
							return entry.remove();

						case 35:
							_context3.next = 43;
							break;

						case 37:
							// Set the properties.
							entry.set('feed', updated.feed);
							entry.set('channel', updated.channel);
							entry.set('refresh', updated.refresh);
							_context3.next = 42;
							return entry.save();

						case 42:

							// Restart the feed.
							this.startFeed(entry);

						case 43:
							_iteratorNormalCompletion2 = true;
							_context3.next = 28;
							break;

						case 46:
							_context3.next = 52;
							break;

						case 48:
							_context3.prev = 48;
							_context3.t1 = _context3['catch'](26);
							_didIteratorError2 = true;
							_iteratorError2 = _context3.t1;

						case 52:
							_context3.prev = 52;
							_context3.prev = 53;

							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}

						case 55:
							_context3.prev = 55;

							if (!_didIteratorError2) {
								_context3.next = 58;
								break;
							}

							throw _iteratorError2;

						case 58:
							return _context3.finish(55);

						case 59:
							return _context3.finish(52);

						case 60:
						case 'end':
							return _context3.stop();
					}
				}
			}, saveData, this, [[4, 8, 12, 20], [13,, 15, 19], [26, 48, 52, 60], [53,, 55, 59]]);
		})

		/*
   * Starts an RSS feed.
   *
   * @param The Feed object.
   */

	}, {
		key: 'startFeed',
		value: function startFeed(feed) {
			var _this3 = this;

			// Get the feed properties.
			var id = feed.get('_id');
			var refresh = feed.get('refresh');
			var channel = feed.get('channel');

			// Stop the feed if there is one already going.
			this.stopFeed(feed);

			// Create a refresh timer.
			var timer = setInterval(function () {
				return _this3.refreshFeed(feed).then(_this3.sendRSSPosts.bind(_this3)).catch(function () {
					feed.set('running', false);
					feed.save();
				});
			}, refresh * 60000);

			// Add to the list of feeds.
			this.feeds[id] = {
				timer: timer
			};

			// Refresh immediately.
			this.refreshFeed(feed).then(this.sendRSSPosts.bind(this)).catch(function () {
				// Set the feed to not running.
				feed.set('running', false);
				feed.save().then(function () {
					_this3.client.sendMessage(channel, 'I couldn\'t get the RSS feed for `' + feed.get('feed') + '`. Sucks.');
				});
			});
		}

		/*
   * Sends RSS feed data.
   *
   * @param data Data returned from refreshing the feed.
   */

	}, {
		key: 'sendRSSPosts',
		value: function sendRSSPosts(data) {
			var feed = data.feed;
			var posts = data.posts;
			var channel = feed.get('channel');

			(0, _co2.default)(regeneratorRuntime.mark(function _callee() {
				var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, post, title, date, link, author, message;

				return regeneratorRuntime.wrap(function _callee$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								// Set the feed to running.
								feed.set('running', true);
								_context4.next = 3;
								return feed.save();

							case 3:

								// Send all the posts.
								_iteratorNormalCompletion3 = true;
								_didIteratorError3 = false;
								_iteratorError3 = undefined;
								_context4.prev = 6;
								_iterator3 = posts[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
									_context4.next = 20;
									break;
								}

								post = _step3.value;
								title = post.title;
								date = post.date;
								link = post.link;
								author = post.author;
								message = '**' + title + '** ' + '`' + date + '` ' + '*' + author + '*\n' + link;
								_context4.next = 17;
								return this.client.sendMessage(channel, message);

							case 17:
								_iteratorNormalCompletion3 = true;
								_context4.next = 8;
								break;

							case 20:
								_context4.next = 26;
								break;

							case 22:
								_context4.prev = 22;
								_context4.t0 = _context4['catch'](6);
								_didIteratorError3 = true;
								_iteratorError3 = _context4.t0;

							case 26:
								_context4.prev = 26;
								_context4.prev = 27;

								if (!_iteratorNormalCompletion3 && _iterator3.return) {
									_iterator3.return();
								}

							case 29:
								_context4.prev = 29;

								if (!_didIteratorError3) {
									_context4.next = 32;
									break;
								}

								throw _iteratorError3;

							case 32:
								return _context4.finish(29);

							case 33:
								return _context4.finish(26);

							case 34:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee, this, [[6, 22, 26, 34], [27,, 29, 33]]);
			}).bind(this));
		}

		/*
   * Refreshes a feed.
   *
   * @param feed The Feed to refresh.
   *
   * @return A Promise.
   */

	}, {
		key: 'refreshFeed',
		value: function refreshFeed(feed) {
			var _this4 = this;

			// Get the properties.
			var url = feed.get('feed');
			var lastGUID = feed.get('lastGUID');

			return new Promise(function (resolve, reject) {
				// Create a request for the feed.
				var request = (0, _request2.default)(url, { timeout: 10000, pool: false });
				request.setMaxListeners(50);
				request.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
				request.setHeader('accept', 'text/html,application/xhtml+xml');

				// Create a parser.
				var parser = new _feedparser2.default();

				// Create a list of posts.
				var posts = [];
				var reached = false;
				var newLast = '';

				// Start piping.
				request.on('error', function () {
					reject();
				}).on('response', function (res) {
					if (res.statusCode !== 200) {
						reject();
						return;
					}
					res.pipe(parser);
				});
				parser.on('error', function () {
					reject();
				}).on('end', function () {
					(0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
						return regeneratorRuntime.wrap(function _callee2$(_context5) {
							while (1) {
								switch (_context5.prev = _context5.next) {
									case 0:
										feed.set('lastGUID', newLast);
										_context5.next = 3;
										return feed.save();

									case 3:

										// Return the reversed posts array.
										resolve({
											feed: feed,
											posts: posts.reverse()
										});

									case 4:
									case 'end':
										return _context5.stop();
								}
							}
						}, _callee2, this);
					}).bind(_this4));
				}).on('readable', function () {
					var post = void 0;
					while (post = parser.read()) {
						if (newLast === '') newLast = post.guid;
						if (post.guid == lastGUID) reached = true;
						if (!reached) posts.push(post);
					}
				});
			});
		}

		/*
   * Stops an RSS feed.
   *
   * @param The Feed object.
   */

	}, {
		key: 'stopFeed',
		value: function stopFeed(feed) {
			// Don't do anything if there is no such feed.
			if (!this.feeds[feed.get('_id')]) return;

			// Clear the timer.
			clearInterval(this.feeds[feed.get('_id')].timer);

			// Remove from the feed list.
			delete this.feeds[feed.get('_id')];
		}
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;