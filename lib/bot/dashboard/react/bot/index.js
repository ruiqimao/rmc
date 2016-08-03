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

var _space = require('ui/form/space');

var _space2 = _interopRequireDefault(_space);

var _checkbox = require('ui/form/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _col = require('ui/col');

var _col2 = _interopRequireDefault(_col);

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

		_this.updatePrefix = _this.updatePrefix.bind(_this);
		return _this;
	}

	/*
  * Update the command prefix.
  */


	_createClass(BotSettings, [{
		key: 'updatePrefix',
		value: function updatePrefix(evt) {
			// Get the prefix.
			var prefix = evt.target.value.trim();

			// Reject prefixes under 1 or over 3 characters.
			if (prefix.length < 1 || prefix.length > 3) return;

			// Set the prefix in the state.
			this.props.data._bot.prefix = prefix;
			this.props.data._update();
		}

		/*
   * Update whether a command is enabled.
   */

	}, {
		key: 'updateCommand',
		value: function updateCommand(evt, command) {
			// Update whether the command is enabled.
			this.props.data._bot.commands[command] = evt.target.checked;
			this.props.data._update();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var data = this.props.data._bot;

			// Generate 2 columns of command checkboxes.
			var commandsCol1 = [],
			    commandsCol2 = [];
			Object.keys(data.commands).map(function (command, index) {
				var enabled = data.commands[command];
				var checkbox = _react2.default.createElement(_checkbox2.default, {
					key: command,
					label: command,
					checked: enabled,
					onChange: function onChange(evt) {
						return _this2.updateCommand(evt, command);
					} });
				if (index < Object.keys(data.commands).length / 2) {
					commandsCol1.push(checkbox);
				} else {
					commandsCol2.push(checkbox);
				}
			});

			return _react2.default.createElement(
				_panel2.default,
				{ title: 'Bot Settings' },
				_react2.default.createElement(
					_label2.default,
					null,
					'Command Prefix'
				),
				_react2.default.createElement(_space2.default, { height: '0.5' }),
				_react2.default.createElement(_input2.default, {
					centered: true,
					value: data.prefix,
					style: {
						width: '2rem'
					},
					onChange: this.updatePrefix }),
				_react2.default.createElement(_space2.default, { height: '2' }),
				_react2.default.createElement(
					_label2.default,
					null,
					'Enabled Commands'
				),
				_react2.default.createElement(
					'div',
					{ className: _index2.default.commandCols },
					_react2.default.createElement(
						_col2.default,
						{ w: '6', className: _index2.default.commandCol },
						commandsCol1
					),
					_react2.default.createElement(
						_col2.default,
						{ w: '6', className: _index2.default.commandCol },
						commandsCol2
					)
				)
			);
		}
	}]);

	return BotSettings;
}(_react2.default.Component);

exports.default = BotSettings;