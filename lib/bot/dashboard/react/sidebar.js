'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _listselect = require('ui/listselect');

var _listselect2 = _interopRequireDefault(_listselect);

var _scrollpane = require('ui/scrollpane');

var _scrollpane2 = _interopRequireDefault(_scrollpane);

var _sidebar = require('./css/sidebar.css');

var _sidebar2 = _interopRequireDefault(_sidebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sidebar = function (_React$Component) {
	_inherits(Sidebar, _React$Component);

	function Sidebar(props) {
		_classCallCheck(this, Sidebar);

		// Bind the listeners.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sidebar).call(this, props));

		_this.onChange = _this.onChange.bind(_this);
		return _this;
	}

	/*
  * Called when the user changes the selected entry.
  */


	_createClass(Sidebar, [{
		key: 'onChange',
		value: function onChange(index) {
			this.props.onChange(index);
		}

		/*
   * Render the list of UI choices in the sidebar.
   */

	}, {
		key: 'renderUIs',
		value: function renderUIs() {
			var names = this.props.names;
			var selected = this.props.selected;

			return _react2.default.createElement(
				'div',
				{ className: _sidebar2.default.uis },
				_react2.default.createElement(
					_scrollpane2.default,
					null,
					_react2.default.createElement(_listselect2.default, {
						dark: true,
						values: names,
						selected: selected,
						onChange: this.onChange })
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var data = this.props.data;

			var classes = (0, _classnames2.default)(_sidebar2.default.sidebar);

			return _react2.default.createElement(
				'div',
				{ className: classes },
				_react2.default.createElement(
					'h1',
					{ className: _sidebar2.default.serverName },
					data._bot.name
				),
				this.renderUIs()
			);
		}
	}]);

	return Sidebar;
}(_react2.default.Component);

exports.default = Sidebar;