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

var _space = require('ui/form/space');

var _space2 = _interopRequireDefault(_space);

var _textarea = require('ui/form/textarea');

var _textarea2 = _interopRequireDefault(_textarea);

var _deletebutton = require('ui/form/deletebutton');

var _deletebutton2 = _interopRequireDefault(_deletebutton);

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

var DictionarySettings = function (_React$Component) {
	_inherits(DictionarySettings, _React$Component);

	function DictionarySettings(props) {
		_classCallCheck(this, DictionarySettings);

		// Bind the listeners.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DictionarySettings).call(this, props));

		_this.onDefinitionChange = _this.onDefinitionChange.bind(_this);
		_this.onDelete = _this.onDelete.bind(_this);
		_this.onSelectChange = _this.onSelectChange.bind(_this);
		return _this;
	}

	/*
  * Called on a definition change.
  */


	_createClass(DictionarySettings, [{
		key: 'onDefinitionChange',
		value: function onDefinitionChange(evt) {
			var value = evt.target.value;

			// Change the definition.
			var data = this.props.data.dictionary;
			var state = this.props.state;
			data._[state.selected].definition = value;
			this.props.data._update();
		}

		/*
   * Called when a definition is deleted.
   */

	}, {
		key: 'onDelete',
		value: function onDelete() {
			var data = this.props.data.dictionary;
			var state = this.props.state;
			var selected = state.selected;

			// Change the selected element.
			state.selected = Math.max(state.selected - 1, 0);
			state._update();

			// Remove the definition.
			data._.splice(selected, 1);
			this.props.data._update();
		}

		/*
   * Called on a phrase selection change.
   */

	}, {
		key: 'onSelectChange',
		value: function onSelectChange(index) {
			// Update the selected phrase.
			var state = this.props.state;
			state.selected = index;
			state._update();
		}

		/*
   * Render the definition.
   */

	}, {
		key: 'renderDefinition',
		value: function renderDefinition() {
			var data = this.props.data.dictionary;
			var state = this.props.state;

			// Don't render the definition if there aren't any definitions.
			if (data._.length == 0) return;

			var entry = data._[state.selected];

			return _react2.default.createElement(
				'div',
				{ className: _index2.default.definition, key: entry.phrase },
				_react2.default.createElement(
					_scrollpane2.default,
					null,
					_react2.default.createElement(
						'div',
						{ className: _index2.default.definitionContent },
						_react2.default.createElement(
							'h1',
							{ className: _index2.default.definitionPhrase },
							entry.phrase
						),
						_react2.default.createElement(
							_label2.default,
							null,
							'Definition'
						),
						_react2.default.createElement(_space2.default, { height: '1' }),
						_react2.default.createElement(_textarea2.default, {
							elastic: true,
							value: entry.definition,
							style: {
								minHeight: '5rem'
							},
							onChange: this.onDefinitionChange }),
						_react2.default.createElement(_space2.default, { height: '2' }),
						_react2.default.createElement(_deletebutton2.default, {
							light: true,
							label: 'Delete Definition',
							onDelete: this.onDelete })
					)
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var data = this.props.data.dictionary;
			var state = this.props.state;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					_label2.default,
					null,
					'Custom Definitions'
				),
				_react2.default.createElement(_space2.default, { height: '1' }),
				_react2.default.createElement(
					'div',
					{ className: _index2.default.words },
					_react2.default.createElement(
						_scrollpane2.default,
						null,
						_react2.default.createElement(_listselect2.default, {
							light: true,
							values: data._.map(function (entry) {
								return entry.phrase;
							}),
							selected: state.selected,
							onChange: this.onSelectChange })
					)
				),
				this.renderDefinition()
			);
		}
	}]);

	return DictionarySettings;
}(_react2.default.Component);

exports.default = DictionarySettings;