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

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _button = require('ui/form/button');

var _button2 = _interopRequireDefault(_button);

var _dashboard = require('./css/dashboard.css');

var _dashboard2 = _interopRequireDefault(_dashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dashboard = function (_React$Component) {
	_inherits(Dashboard, _React$Component);

	function Dashboard(props) {
		_classCallCheck(this, Dashboard);

		// Define the state.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dashboard).call(this, props));

		_this.state = {
			loaded: false,
			saving: false,
			data: {}
		};

		// Bind the listeners.
		_this.save = _this.save.bind(_this);
		return _this;
	}

	/*
  * Load data from the server.
  */


	_createClass(Dashboard, [{
		key: 'loadData',
		value: regeneratorRuntime.mark(function loadData() {
			var _this2 = this;

			var data;
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
									data: _this2.state.data
								});
							};

							// Update the state.
							this.setState({
								loaded: true,
								data: data
							});

						case 7:
						case 'end':
							return _context.stop();
					}
				}
			}, loadData, this);
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
			var _this3 = this;

			(0, _co2.default)(regeneratorRuntime.mark(function _callee() {
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

								alert('Settings saved!');

								this.setState({
									saving: false
								});

							case 7:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee, this);
			}).bind(this)).catch(function () {
				_this3.setState({
					saving: false
				});
			});
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			// Load the data.
			(0, _co2.default)(this.loadData.bind(this));
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(Loading, { visible: !this.state.loaded }),
				function () {
					if (_this4.state.loaded) {
						return _react2.default.createElement(
							'div',
							{ className: _dashboard2.default.dashboard },
							_react2.default.createElement(Header, { data: _this4.state.data }),
							_react2.default.createElement(_bot2.default, { data: _this4.state.data }),
							_react2.default.createElement(
								_button2.default,
								{
									block: true,
									className: _dashboard2.default.saveButton,
									onClick: _this4.save,
									disabled: _this4.state.saving },
								'Save'
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

var Loading = function (_React$Component2) {
	_inherits(Loading, _React$Component2);

	function Loading() {
		_classCallCheck(this, Loading);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Loading).apply(this, arguments));
	}

	_createClass(Loading, [{
		key: 'render',
		value: function render() {
			var classes = (0, _classnames2.default)(_dashboard2.default.loading, _defineProperty({}, _dashboard2.default.visible, this.props.visible));

			// Show the loading screen.
			return _react2.default.createElement(
				'div',
				{ className: classes },
				_react2.default.createElement(
					'div',
					{ className: _dashboard2.default.loadingCenter },
					_react2.default.createElement(
						'h1',
						null,
						'Loading...'
					),
					_react2.default.createElement(
						'h2',
						null,
						'Please Wait'
					)
				)
			);
		}
	}]);

	return Loading;
}(_react2.default.Component);

var Header = function (_React$Component3) {
	_inherits(Header, _React$Component3);

	function Header() {
		_classCallCheck(this, Header);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Header).apply(this, arguments));
	}

	_createClass(Header, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: _dashboard2.default.header },
				_react2.default.createElement(
					'div',
					{ className: _dashboard2.default.headerTitles },
					_react2.default.createElement(
						'h2',
						null,
						'RM-C Control Panel'
					),
					_react2.default.createElement(
						'h1',
						null,
						this.props.data._bot.name
					)
				)
			);
		}
	}]);

	return Header;
}(_react2.default.Component);