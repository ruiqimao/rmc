'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _label = require('ui/form/label');

var _label2 = _interopRequireDefault(_label);

var _input = require('ui/form/input');

var _input2 = _interopRequireDefault(_input);

var _textarea = require('ui/form/textarea');

var _textarea2 = _interopRequireDefault(_textarea);

var _button = require('ui/form/button');

var _button2 = _interopRequireDefault(_button);

var _space = require('ui/form/space');

var _space2 = _interopRequireDefault(_space);

var _index = require('./css/index.css');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InteractSettings = function (_React$Component) {
	_inherits(InteractSettings, _React$Component);

	function InteractSettings(props) {
		_classCallCheck(this, InteractSettings);

		// Bind all listeners.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InteractSettings).call(this, props));

		_this.onPetChange = _this.onPetChange.bind(_this);
		_this.onPetResponsesChange = _this.onPetResponsesChange.bind(_this);
		_this.onSlapResponsesChange = _this.onSlapResponsesChange.bind(_this);
		return _this;
	}

	/*
  * Called when the pet number is changed.
  */


	_createClass(InteractSettings, [{
		key: 'onPetChange',
		value: function onPetChange(evt) {
			var value = evt.target.value;
			if (isNaN(value)) return;

			// Update the value.
			if (value.length == 0) value = 0;
			this.props.data.interact.pet.count = parseInt(value);
			this.props.data._update();
		}

		/*
   * Called when the pet responses are changed.
   */

	}, {
		key: 'onPetResponsesChange',
		value: function onPetResponsesChange(evt) {
			var value = evt.target.value;
			var responses = value.split("\n");

			// Remove all empty responses.
			responses = responses.filter(function (response) {
				return response.length > 0;
			});

			// Add an empty response at the end if there is a newline.
			if (value.endsWith("\n")) responses.push('');

			// Set the responses.
			this.props.data.interact.pet.responses = responses;
			this.props.data._update();
		}

		/*
   * Called when the slap responses are changed.
   */

	}, {
		key: 'onSlapResponsesChange',
		value: function onSlapResponsesChange(evt) {
			var value = evt.target.value;
			var responses = value.split("\n");

			// Remove all empty responses.
			responses = responses.filter(function (response) {
				return response.length > 0;
			});

			// Add an empty response at the end if there is a newline.
			if (value.endsWith("\n")) responses.push('');

			// Set the responses.
			this.props.data.interact.slap = responses;
			this.props.data._update();
		}
	}, {
		key: 'render',
		value: function render() {
			var data = this.props.data.interact;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					_label2.default,
					null,
					'Number of Pets'
				),
				_react2.default.createElement(_space2.default, { height: '0.5' }),
				_react2.default.createElement(_input2.default, {
					centered: true,
					style: {
						width: '5rem'
					},
					value: data.pet.count,
					onChange: this.onPetChange }),
				_react2.default.createElement(_space2.default, { height: '2' }),
				_react2.default.createElement(
					_label2.default,
					null,
					'Pet Responses (One per Line)'
				),
				_react2.default.createElement(_space2.default, { height: '1' }),
				_react2.default.createElement(_textarea2.default, {
					elastic: true,
					value: data.pet.responses.join("\n"),
					onChange: this.onPetResponsesChange }),
				_react2.default.createElement(_space2.default, { height: '2' }),
				_react2.default.createElement(
					_label2.default,
					null,
					'Slap Responses (One per Line)'
				),
				_react2.default.createElement(_space2.default, { height: '1' }),
				_react2.default.createElement(_textarea2.default, {
					elastic: true,
					value: data.slap.join("\n"),
					onChange: this.onSlapResponsesChange })
			);
		}
	}]);

	return InteractSettings;
}(_react2.default.Component);

exports.default = InteractSettings;