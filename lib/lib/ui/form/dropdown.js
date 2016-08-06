'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _dropdown = require('./css/dropdown.css');

var _dropdown2 = _interopRequireDefault(_dropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dropdown = function (_React$Component) {
	_inherits(Dropdown, _React$Component);

	function Dropdown(props) {
		_classCallCheck(this, Dropdown);

		// Set the initial state.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dropdown).call(this, props));

		_this.state = {
			expanded: false
		};

		// Bind the listeners.
		_this.onSelectedClick = _this.onSelectedClick.bind(_this);
		_this.onWindowClick = _this.onWindowClick.bind(_this);
		_this.onOptionClick = _this.onOptionClick.bind(_this);
		return _this;
	}

	/*
  * Triggered when anywhere in the window is clicked.
  */


	_createClass(Dropdown, [{
		key: 'onWindowClick',
		value: function onWindowClick(evt) {
			// Set expanded to false.
			this.setState({
				expanded: false
			});

			// Remove the listener.
			window.removeEventListener('click', this.onWindowClick);
		}

		/*
   * Triggered when the dropdown is clicked to be expanded.
   */

	}, {
		key: 'onSelectedClick',
		value: function onSelectedClick(evt) {
			// Toggle the expanded state.
			var wasExpanded = this.state.expanded;
			this.setState({
				expanded: !this.state.expanded
			});

			// Set a listener to hide the list if expanded.
			if (!wasExpanded) window.addEventListener('click', this.onWindowClick);

			// Stop propagation.
			evt.stopPropagation();
		}

		/*
   * Triggered when an option is clicked.
   */

	}, {
		key: 'onOptionClick',
		value: function onOptionClick(index, evt) {
			// Trigger onChange.
			if (this.props.onChange) this.props.onChange(index);
		}

		/*
   * Render the options.
   */

	}, {
		key: 'renderOptions',
		value: function renderOptions() {
			var _this2 = this;

			if (!this.props.values) return;

			// Get the selected index.
			var selected = this.props.selected || 0;

			return this.props.values.map(function (value, index) {
				return _react2.default.createElement(
					'div',
					{
						className: _dropdown2.default.option,
						key: index,
						onClick: _this2.onOptionClick.bind(_this2, index) },
					value
				);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			if (!this.props.values) return;

			// Get the selected index and value.
			var selected = this.props.selected || 0;
			var selectedVal = this.props.values[selected] || _react2.default.createElement('span', null);

			var classes = (0, _classnames2.default)(_dropdown2.default.dropdown, _defineProperty({}, _dropdown2.default.expanded, this.state.expanded), this.props.className);

			return _react2.default.createElement(
				'div',
				{ className: classes },
				_react2.default.createElement(
					'div',
					{ className: _dropdown2.default.dropdownContent },
					_react2.default.createElement('div', { className: _dropdown2.default.triangle }),
					_react2.default.createElement(
						'div',
						{
							className: _dropdown2.default.selected,
							onClick: this.onSelectedClick },
						selectedVal
					),
					_react2.default.createElement(
						'div',
						{ className: _dropdown2.default.options },
						this.renderOptions()
					)
				)
			);
		}
	}]);

	return Dropdown;
}(_react2.default.Component);

exports.default = Dropdown;