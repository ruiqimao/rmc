'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactCustomScrollbars = require('react-custom-scrollbars');

var _reactCustomScrollbars2 = _interopRequireDefault(_reactCustomScrollbars);

var _scrollpane = require('./css/scrollpane.css');

var _scrollpane2 = _interopRequireDefault(_scrollpane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollPane = function (_React$Component) {
	_inherits(ScrollPane, _React$Component);

	function ScrollPane() {
		_classCallCheck(this, ScrollPane);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ScrollPane).apply(this, arguments));
	}

	_createClass(ScrollPane, [{
		key: 'render',
		value: function render() {
			var classes = (0, _classnames2.default)(_scrollpane2.default.scrollpane, this.props.className);

			return _react2.default.createElement(
				_reactCustomScrollbars2.default,
				{
					renderTrackHorizontal: function renderTrackHorizontal(props) {
						return _react2.default.createElement('div', _extends({}, props, { className: _scrollpane2.default.trackHorizontal }));
					},
					renderTrackVertical: function renderTrackVertical(props) {
						return _react2.default.createElement('div', _extends({}, props, { className: _scrollpane2.default.trackVertical }));
					},
					renderThumbHorizontal: function renderThumbHorizontal(props) {
						return _react2.default.createElement('div', _extends({}, props, { className: _scrollpane2.default.thumbHorizontal }));
					},
					renderThumbVertical: function renderThumbVertical(props) {
						return _react2.default.createElement('div', _extends({}, props, { className: _scrollpane2.default.thumbVertical }));
					},
					renderView: function renderView(props) {
						return _react2.default.createElement('div', _extends({}, props, { className: _scrollpane2.default.view }));
					},
					autoHide: this.props.autoHide,
					className: classes,
					style: this.props.style },
				this.props.children
			);
		}
	}]);

	return ScrollPane;
}(_react2.default.Component);

exports.default = ScrollPane;