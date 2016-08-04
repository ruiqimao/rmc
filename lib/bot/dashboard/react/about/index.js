'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _panel = require('ui/panel');

var _panel2 = _interopRequireDefault(_panel);

var _label = require('ui/form/label');

var _label2 = _interopRequireDefault(_label);

var _input = require('ui/form/input');

var _input2 = _interopRequireDefault(_input);

var _textarea = require('ui/form/textarea');

var _textarea2 = _interopRequireDefault(_textarea);

var _space = require('ui/form/space');

var _space2 = _interopRequireDefault(_space);

var _index = require('./css/index.css');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BotSettings = function (_React$Component) {
	_inherits(BotSettings, _React$Component);

	function BotSettings(props) {
		_classCallCheck(this, BotSettings);

		// Bind all listeners.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BotSettings).call(this, props));

		_this.updateText = _this.updateText.bind(_this);
		return _this;
	}

	/*
  * Update the about text.
  */


	_createClass(BotSettings, [{
		key: 'updateText',
		value: function updateText(evt) {
			// Get the text.
			var text = evt.target.value;

			// Set the text in the state.
			this.props.data.about.about = text;
			this.props.data._update();
		}
	}, {
		key: 'render',
		value: function render() {
			var data = this.props.data.about;

			return _react2.default.createElement(
				_panel2.default,
				{ title: 'About' },
				_react2.default.createElement(
					_label2.default,
					null,
					'About Text'
				),
				_react2.default.createElement(_space2.default, { height: '1' }),
				_react2.default.createElement(_textarea2.default, {
					elastic: true,
					style: { minHeight: '10rem' },
					value: data.about,
					onChange: this.updateText })
			);
		}
	}]);

	return BotSettings;
}(_react2.default.Component);

exports.default = BotSettings;