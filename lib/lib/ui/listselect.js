'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _listselect = require('./css/listselect.css');

var _listselect2 = _interopRequireDefault(_listselect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListSelect = function (_React$Component) {
	_inherits(ListSelect, _React$Component);

	function ListSelect() {
		_classCallCheck(this, ListSelect);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ListSelect).apply(this, arguments));
	}

	_createClass(ListSelect, [{
		key: 'onChange',
		value: function onChange(index) {
			// Call the actual onChange listener.
			if (this.props.onChange) this.props.onChange(index);
		}
	}, {
		key: 'render',
		value: function render() {
			var _classNames,
			    _this2 = this;

			var selected = this.props.selected;

			var classes = (0, _classnames2.default)(_listselect2.default.listselect, (_classNames = {}, _defineProperty(_classNames, _listselect2.default.dark, this.props.dark), _defineProperty(_classNames, _listselect2.default.light, this.props.light), _classNames), this.props.className);

			return _react2.default.createElement(
				'div',
				{
					className: classes,
					style: this.props.style },
				this.props.values.map(function (value, index) {
					var classes = (0, _classnames2.default)(_listselect2.default.entry, _defineProperty({}, _listselect2.default.selected, index == selected));

					return _react2.default.createElement(
						'div',
						{
							className: classes,
							key: index,
							onClick: _this2.onChange.bind(_this2, index) },
						value
					);
				})
			);
		}
	}]);

	return ListSelect;
}(_react2.default.Component);

exports.default = ListSelect;