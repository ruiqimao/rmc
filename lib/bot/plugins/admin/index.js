'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _dashboard = require('./commands/dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _purge = require('./commands/purge');

var _purge2 = _interopRequireDefault(_purge);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

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
							this.addCommand('dashboard', _dashboard2.default);
							this.addCommand('purge', _purge2.default);

							// Generate classes.
							this.Dash = this.createModel('dashboard');

							// Create a router for the dashboard.
							this.router = _express2.default.Router();

							// Add the dashboard path.
							this.router.get('/dashboard/data/:id', this.loadData.bind(this));
							this.router.post('/dashboard/data/:id', this.saveData.bind(this));
							this.router.get('/dashboard/:id', this.renderDashboard.bind(this));

							// Add the router to the web server.
							this.bot.express.use(this.router);

						case 8:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})

		/*
   * Load the bot data.
   *
   * @param req The Express request.
   * @param res The Express response.
   */

	}, {
		key: 'loadData',
		value: function loadData(req, res) {
			(0, _co2.default)(regeneratorRuntime.mark(function _callee() {
				var dashboards, id, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, plugin;

				return regeneratorRuntime.wrap(function _callee$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.Dash.find({
									'value': req.params.id
								});

							case 2:
								dashboards = _context2.sent;

								if (!(dashboards.length == 0)) {
									_context2.next = 6;
									break;
								}

								// If there is no valid id, 404.
								res.status(404).end();
								return _context2.abrupt('return');

							case 6:
								id = dashboards[0].get('server');

								// Make sure the server exists.

								if (!(this.client.servers.get('id', id) == null)) {
									_context2.next = 12;
									break;
								}

								_context2.next = 10;
								return dashboards[0].remove();

							case 10:
								res.status(404).end();
								return _context2.abrupt('return');

							case 12:

								// Compile the data.
								data = {};

								// Get data from the bot.

								_context2.next = 15;
								return this.bot.getData(id);

							case 15:
								data._bot = _context2.sent;


								// Get data from all plugins.
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context2.prev = 19;
								_iterator = this.bot.plugins[Symbol.iterator]();

							case 21:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context2.next = 29;
									break;
								}

								plugin = _step.value;
								_context2.next = 25;
								return plugin.plugin._getData(id);

							case 25:
								data[plugin.name] = _context2.sent;

							case 26:
								_iteratorNormalCompletion = true;
								_context2.next = 21;
								break;

							case 29:
								_context2.next = 35;
								break;

							case 31:
								_context2.prev = 31;
								_context2.t0 = _context2['catch'](19);
								_didIteratorError = true;
								_iteratorError = _context2.t0;

							case 35:
								_context2.prev = 35;
								_context2.prev = 36;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 38:
								_context2.prev = 38;

								if (!_didIteratorError) {
									_context2.next = 41;
									break;
								}

								throw _iteratorError;

							case 41:
								return _context2.finish(38);

							case 42:
								return _context2.finish(35);

							case 43:

								// Respond with the data.
								res.json(data);

							case 44:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee, this, [[19, 31, 35, 43], [36,, 38, 42]]);
			}).bind(this)).catch(function (err) {
				console.error(err);
				res.status(500).end();
			});
		}

		/*
   * Save the bot data.
   *
   * @param req The Express request.
   * @param res The Express response.
   */

	}, {
		key: 'saveData',
		value: function saveData(req, res) {
			(0, _co2.default)(regeneratorRuntime.mark(function _callee2() {
				var dashboards, id, data, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, plugin;

				return regeneratorRuntime.wrap(function _callee2$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return this.Dash.find({
									'value': req.params.id
								});

							case 2:
								dashboards = _context3.sent;

								if (dashboards.length == 0) {
									// If there is no valid id, 404.
									res.status(404).end();
								}
								id = dashboards[0].get('server');

								// Get the data.

								data = req.body;

								// Save the bot data.

								_context3.next = 8;
								return this.bot.saveData(id, data._bot);

							case 8:

								// Save data to all plugins.
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context3.prev = 11;
								_iterator2 = this.bot.plugins[Symbol.iterator]();

							case 13:
								if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
									_context3.next = 21;
									break;
								}

								plugin = _step2.value;

								if (!data[plugin.name]) {
									_context3.next = 18;
									break;
								}

								_context3.next = 18;
								return plugin.plugin._saveData(id, data[plugin.name]);

							case 18:
								_iteratorNormalCompletion2 = true;
								_context3.next = 13;
								break;

							case 21:
								_context3.next = 27;
								break;

							case 23:
								_context3.prev = 23;
								_context3.t0 = _context3['catch'](11);
								_didIteratorError2 = true;
								_iteratorError2 = _context3.t0;

							case 27:
								_context3.prev = 27;
								_context3.prev = 28;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 30:
								_context3.prev = 30;

								if (!_didIteratorError2) {
									_context3.next = 33;
									break;
								}

								throw _iteratorError2;

							case 33:
								return _context3.finish(30);

							case 34:
								return _context3.finish(27);

							case 35:

								res.end();

							case 36:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee2, this, [[11, 23, 27, 35], [28,, 30, 34]]);
			}).bind(this));
		}

		/*
   * Render the dashboard.
   *
   * @param req The Express request.
   * @param res The Express response.
   */

	}, {
		key: 'renderDashboard',
		value: function renderDashboard(req, res) {
			(0, _co2.default)(regeneratorRuntime.mark(function _callee3() {
				var dashboards;
				return regeneratorRuntime.wrap(function _callee3$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return this.Dash.find({
									'value': req.params.id
								});

							case 2:
								dashboards = _context4.sent;

								if (dashboards.length > 0) {
									// Render the dashboard.
									res.render(__dirname + '/../../dashboard/views/dashboard.html', { token: req.params.id });
								} else {
									// Dashboard doesn't exist.
									res.status(404).end();
								}

							case 4:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee3, this);
			}).bind(this));
		}
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;