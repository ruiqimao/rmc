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
				var dashboards, id, data;
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

								if (dashboards.length == 0) {
									// If there is no valid id, 404.
									res.status(404).end();
								}
								id = dashboards[0].get('server');

								// Compile the data.

								data = {};

								// Get data from the bot.

								_context2.next = 8;
								return this.bot.getData(id);

							case 8:
								data._bot = _context2.sent;


								// Respond with the data.
								res.json(data);

							case 10:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee, this);
			}).bind(this)).catch(function () {
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
				var dashboards, id, data;
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

								res.end();

							case 9:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee2, this);
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