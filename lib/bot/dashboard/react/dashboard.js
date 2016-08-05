'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _bot = require('./settings/_bot');

var _bot2 = _interopRequireDefault(_bot);

var _about = require('./settings/about');

var _about2 = _interopRequireDefault(_about);

var _dictionary = require('./settings/dictionary');

var _dictionary2 = _interopRequireDefault(_dictionary);

var _interact = require('./settings/interact');

var _interact2 = _interopRequireDefault(_interact);

var _stats = require('./settings/stats');

var _stats2 = _interopRequireDefault(_stats);

var _loading = require('./loading');

var _loading2 = _interopRequireDefault(_loading);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _sidebar = require('./sidebar');

var _sidebar2 = _interopRequireDefault(_sidebar);

var _scrollpane = require('ui/scrollpane');

var _scrollpane2 = _interopRequireDefault(_scrollpane);

var _dashboard = require('./css/dashboard.css');

var _dashboard2 = _interopRequireDefault(_dashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dashboard = function (_React$Component) {
	_inherits(Dashboard, _React$Component);

	function Dashboard(props) {
		_classCallCheck(this, Dashboard);

		// Set the available settings UIs.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dashboard).call(this, props));

		_this.availableUIs = [{
			id: '_bot',
			name: 'Bot Settings',
			ui: _bot2.default
		}, {
			id: 'about',
			name: 'About',
			ui: _about2.default
		}, {
			id: 'dictionary',
			name: 'Dictionary',
			ui: _dictionary2.default,
			state: {
				selected: 0
			}
		}, {
			id: 'interact',
			name: 'Interact',
			ui: _interact2.default
		}, {
			id: 'stats',
			name: 'Stats',
			ui: _stats2.default,
			state: {
				selected: 0
			}
		}];

		// Set an update function for all UIs that have a state.
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _this.availableUIs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var ui = _step.value;

				if (ui.state !== undefined) {
					ui.state._update = function () {
						_this.setState({
							uis: _this.state.uis
						});
					};
				}
			}

			// Define the state.
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		_this.state = {
			loaded: false,
			saving: false,
			saved: false,
			dirty: false,
			currentUI: 0,
			uis: [],
			data: {}
		};

		// Bind the listeners.
		_this.save = _this.save.bind(_this);
		_this.changeUI = _this.changeUI.bind(_this);
		_this.onBeforeUnload = _this.onBeforeUnload.bind(_this);
		return _this;
	}

	/*
  * Load data from the server.
  */


	_createClass(Dashboard, [{
		key: 'loadData',
		value: regeneratorRuntime.mark(function loadData() {
			var _this2 = this;

			var data, uis, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, ui;

			return regeneratorRuntime.wrap(function loadData$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.t0 = JSON;
							_context.next = 3;
							return _requestPromise2.default.get(window.location.origin + '/dashboard/data/' + RMC_TOKEN);

						case 3:
							_context.t1 = _context.sent;
							data = _context.t0.parse.call(_context.t0, _context.t1);


							// Set the update function.
							data._update = function () {
								_this2.setState({
									dirty: true,
									data: _this2.state.data
								});
							};

							// Get the set of UIs to show.
							uis = [];
							_iteratorNormalCompletion2 = true;
							_didIteratorError2 = false;
							_iteratorError2 = undefined;
							_context.prev = 10;

							for (_iterator2 = this.availableUIs[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								ui = _step2.value;

								if (data[ui.id] !== undefined) {
									uis.push(ui);
								}
							}

							// Update the state.
							_context.next = 18;
							break;

						case 14:
							_context.prev = 14;
							_context.t2 = _context['catch'](10);
							_didIteratorError2 = true;
							_iteratorError2 = _context.t2;

						case 18:
							_context.prev = 18;
							_context.prev = 19;

							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}

						case 21:
							_context.prev = 21;

							if (!_didIteratorError2) {
								_context.next = 24;
								break;
							}

							throw _iteratorError2;

						case 24:
							return _context.finish(21);

						case 25:
							return _context.finish(18);

						case 26:
							this.setState({
								loaded: true,
								dirty: false,
								uis: uis,
								data: data
							});

						case 27:
						case 'end':
							return _context.stop();
					}
				}
			}, loadData, this, [[10, 14, 18, 26], [19,, 21, 25]]);
		})

		/*
   * Save data to the server.
   */

	}, {
		key: 'saveData',
		value: regeneratorRuntime.mark(function saveData() {
			var data, options;
			return regeneratorRuntime.wrap(function saveData$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							data = this.state.data;

							// Send the data to the server.

							options = {
								method: 'POST',
								uri: window.location.origin + '/dashboard/data/' + RMC_TOKEN,
								body: data,
								json: true
							};
							_context2.next = 4;
							return (0, _requestPromise2.default)(options);

						case 4:
						case 'end':
							return _context2.stop();
					}
				}
			}, saveData, this);
		})

		/*
   * Handler for save button click.
   */

	}, {
		key: 'save',
		value: function save(evt) {
			var _this4 = this;

			(0, _co2.default)(regeneratorRuntime.mark(function _callee() {
				var _this3 = this;

				return regeneratorRuntime.wrap(function _callee$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								this.setState({
									saving: true
								});

								// Save the data.
								_context3.next = 3;
								return this.saveData();

							case 3:
								_context3.next = 5;
								return this.loadData();

							case 5:

								this.setState({
									saved: true,
									saving: false
								});

								// Remove the saved message after 3 seconds.
								setTimeout(function () {
									_this3.setState({
										saved: false
									});
								}, 3000);

							case 7:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee, this);
			}).bind(this)).catch(function () {
				_this4.setState({
					saving: false
				});
			});
		}

		/*
   * Change the current UI.
   */

	}, {
		key: 'changeUI',
		value: function changeUI(ui) {
			// Change the UI.
			this.setState({
				currentUI: ui
			});
		}

		/*
   * Called before the page is unloaded.
   */

	}, {
		key: 'onBeforeUnload',
		value: function onBeforeUnload(evt) {
			// Check if the data is dirty.
			if (this.state.dirty) {
				// Confirm that the user wants to leave.
				return 'You have unsaved data. Are you sure you want to leave?';
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			// Load the data.
			(0, _co2.default)(this.loadData.bind(this));

			// Listen for a page close.
			window.onbeforeunload = this.onBeforeUnload;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this5 = this;

			var data = this.state.data;
			var currentUI = this.state.currentUI;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(_loading2.default, { visible: !this.state.loaded }),
				function () {
					if (_this5.state.loaded) {
						// Get the UI to show.
						var UI = _this5.state.uis[currentUI].ui;
						var UIstate = _this5.state.uis[currentUI].state;

						return _react2.default.createElement(
							'div',
							{ className: _dashboard2.default.dashboard },
							_react2.default.createElement(_sidebar2.default, {
								data: data,
								selected: currentUI,
								names: _this5.state.uis.map(function (ui) {
									return ui.name;
								}),
								onChange: _this5.changeUI }),
							_react2.default.createElement(_header2.default, {
								selected: currentUI,
								uis: _this5.state.uis,
								onSave: _this5.save,
								saving: _this5.state.saving,
								saved: _this5.state.saved }),
							_react2.default.createElement(
								'div',
								{ className: _dashboard2.default.content },
								_react2.default.createElement(
									_scrollpane2.default,
									null,
									_react2.default.createElement(
										'div',
										{ className: _dashboard2.default.ui },
										_react2.default.createElement(UI, { data: data, state: UIstate })
									)
								)
							)
						);
					}
				}()
			);
		}
	}]);

	return Dashboard;
}(_react2.default.Component);

exports.default = Dashboard;