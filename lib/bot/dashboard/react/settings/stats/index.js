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

var _text = require('ui/form/text');

var _text2 = _interopRequireDefault(_text);

var _space = require('ui/form/space');

var _space2 = _interopRequireDefault(_space);

var _scrollpane = require('ui/scrollpane');

var _scrollpane2 = _interopRequireDefault(_scrollpane);

var _listselect = require('ui/listselect');

var _listselect2 = _interopRequireDefault(_listselect);

var _index = require('./css/index.css');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatsSettings = function (_React$Component) {
	_inherits(StatsSettings, _React$Component);

	function StatsSettings(props) {
		_classCallCheck(this, StatsSettings);

		// Bind all listeners.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StatsSettings).call(this, props));

		_this.onSelectChange = _this.onSelectChange.bind(_this);
		return _this;
	}

	_createClass(StatsSettings, [{
		key: 'onSelectChange',
		value: function onSelectChange(index) {
			// Update the selected phrase.
			var state = this.props.state;
			state.selected = index;
			state._update();
		}

		/*
   * Render the user details.
   */

	}, {
		key: 'renderDetails',
		value: function renderDetails() {
			var data = this.props.data.stats;
			var state = this.props.state;

			var entry = data._[state.selected];

			return _react2.default.createElement(
				'div',
				{ className: _index2.default.details, key: entry.id },
				_react2.default.createElement(
					_scrollpane2.default,
					null,
					_react2.default.createElement(
						'div',
						{ className: _index2.default.detailsContent },
						_react2.default.createElement(
							'h1',
							{ className: _index2.default.detailsUsername },
							entry.nick || entry.username,
							entry.bot && _react2.default.createElement(
								'div',
								{ className: _index2.default.detailsBot },
								'Bot'
							)
						),
						_react2.default.createElement(
							_label2.default,
							null,
							'User ID'
						),
						_react2.default.createElement(_space2.default, { height: '0.5' }),
						_react2.default.createElement(
							_text2.default,
							{ selectable: true },
							entry.id
						),
						_react2.default.createElement(_space2.default, { height: '2' }),
						_react2.default.createElement(
							_label2.default,
							null,
							'Username'
						),
						_react2.default.createElement(_space2.default, { height: '0.5' }),
						_react2.default.createElement(
							_text2.default,
							{ selectable: true },
							entry.username
						),
						_react2.default.createElement(_space2.default, { height: '2' }),
						entry.nick && _react2.default.createElement(
							'div',
							null,
							_react2.default.createElement(
								_label2.default,
								null,
								'Nickname'
							),
							_react2.default.createElement(_space2.default, { height: '0.5' }),
							_react2.default.createElement(
								_text2.default,
								{ selectable: true },
								entry.nick
							),
							_react2.default.createElement(_space2.default, { height: '2' })
						),
						entry.avatar && _react2.default.createElement(
							'div',
							null,
							_react2.default.createElement(
								_label2.default,
								null,
								'Avatar'
							),
							_react2.default.createElement(_space2.default, { height: '0.5' }),
							_react2.default.createElement('img', { src: entry.avatar, style: { height: '8rem', borderRadius: '0.2rem' } }),
							_react2.default.createElement(_space2.default, { height: '2' })
						),
						_react2.default.createElement(
							_label2.default,
							null,
							'Messages'
						),
						_react2.default.createElement(_space2.default, { height: '0.5' }),
						_react2.default.createElement(
							_text2.default,
							{ selectable: true },
							entry.messages
						)
					)
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var data = this.props.data.stats;
			var state = this.props.state;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					_label2.default,
					null,
					'Active Users'
				),
				_react2.default.createElement(
					'div',
					{ className: _index2.default.users },
					_react2.default.createElement(
						_scrollpane2.default,
						null,
						_react2.default.createElement(_listselect2.default, {
							light: true,
							values: data._.map(function (entry) {
								return entry.nick || entry.username;
							}),
							selected: state.selected,
							onChange: this.onSelectChange })
					)
				),
				this.renderDetails()
			);
		}
	}]);

	return StatsSettings;
}(_react2.default.Component);

exports.default = StatsSettings;