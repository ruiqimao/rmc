'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _loading = require('./css/loading.css');

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = function (_React$Component) {
	_inherits(Loading, _React$Component);

	function Loading() {
		_classCallCheck(this, Loading);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Loading).apply(this, arguments));
	}

	_createClass(Loading, [{
		key: 'render',
		value: function render() {
			var classes = (0, _classnames2.default)(_loading2.default.loading, _defineProperty({}, _loading2.default.visible, this.props.visible));

			// Show the loading screen.
			return _react2.default.createElement(
				'div',
				{ className: classes },
				_react2.default.createElement(
					'div',
					{ className: _loading2.default.loadingCenter },
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

exports.default = Loading;