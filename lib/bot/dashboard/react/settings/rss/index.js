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

var _input = require('ui/form/input');

var _input2 = _interopRequireDefault(_input);

var _text = require('ui/form/text');

var _text2 = _interopRequireDefault(_text);

var _dropdown = require('ui/form/dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

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

var RSSSettings = function (_React$Component) {
	_inherits(RSSSettings, _React$Component);

	function RSSSettings(props) {
		_classCallCheck(this, RSSSettings);

		// Bind the listeners.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RSSSettings).call(this, props));

		_this.onDelete = _this.onDelete.bind(_this);
		_this.onSelectChange = _this.onSelectChange.bind(_this);
		_this.onChangeFeed = _this.onChangeFeed.bind(_this);
		_this.onChangeChannel = _this.onChangeChannel.bind(_this);
		_this.onChangeRefresh = _this.onChangeRefresh.bind(_this);
		return _this;
	}

	/*
  * Called when a definition is deleted.
  */


	_createClass(RSSSettings, [{
		key: 'onDelete',
		value: function onDelete() {
			var data = this.props.data.rss;
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
   * Triggered on a feed change.
   */

	}, {
		key: 'onChangeFeed',
		value: function onChangeFeed(evt) {
			var url = evt.target.value;

			// Change the feed URL.
			var data = this.props.data.rss;
			var state = this.props.state;
			data._[state.selected].feed = url;
			this.props.data._update();
		}

		/*
   * Triggered on a channel change.
   */

	}, {
		key: 'onChangeChannel',
		value: function onChangeChannel(index) {
			// Get the new channel.
			var channel = this.props.data._bot.textChannels[index];

			// Set the new channel.
			var data = this.props.data.rss;
			var state = this.props.state;
			data._[state.selected].channel = channel.id;
			this.props.data._update();
		}

		/*
   * Triggered on a refresh change.
   */

	}, {
		key: 'onChangeRefresh',
		value: function onChangeRefresh(evt) {
			var refresh = evt.target.value;

			// Reject if not a number.
			if (isNaN(refresh)) return;

			// Parse as an integer.
			if (refresh.length == 0) refresh = 0;
			refresh = parseInt(refresh);

			// Must be greater than 1.
			if (refresh <= 0) return;

			// Change the feed URL.
			var data = this.props.data.rss;
			var state = this.props.state;
			data._[state.selected].refresh = refresh;
			this.props.data._update();
		}

		/*
   * Render the details.
   */

	}, {
		key: 'renderDetails',
		value: function renderDetails() {
			var _this2 = this;

			var data = this.props.data.rss;
			var state = this.props.state;

			// Don't render the details if there aren't any details.
			if (data._.length == 0) return;

			var entry = data._[state.selected];

			// Get the index of the channel and the list of channel names.
			var channels = void 0;
			var channelIndex = function () {
				channels = _this2.props.data._bot.textChannels;
				var index = 0;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var channel = _step.value;

						if (channel.id === entry.channel) {
							return index;
						}
						index++;
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}();
			channels = channels.map(function (channel) {
				return channel.name;
			});

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
							_label2.default,
							null,
							'Feed URL'
						),
						_react2.default.createElement(_space2.default, { height: '0.5' }),
						_react2.default.createElement(_input2.default, {
							style: { width: '25rem' },
							value: entry.feed,
							onChange: this.onChangeFeed }),
						_react2.default.createElement(_space2.default, { height: '2' }),
						_react2.default.createElement(
							_label2.default,
							null,
							'Channel'
						),
						_react2.default.createElement(_space2.default, { height: '1' }),
						_react2.default.createElement(_dropdown2.default, {
							values: channels,
							selected: channelIndex,
							onChange: this.onChangeChannel }),
						_react2.default.createElement(_space2.default, { height: '2' }),
						_react2.default.createElement(
							_label2.default,
							null,
							'Refresh Rate'
						),
						_react2.default.createElement(_space2.default, { height: '0.5' }),
						_react2.default.createElement(_input2.default, {
							style: { width: '3rem' },
							centered: true,
							value: entry.refresh,
							onChange: this.onChangeRefresh }),
						_react2.default.createElement(
							_text2.default,
							{
								style: {
									fontSize: '0.9rem',
									marginLeft: '0.5rem'
								} },
							'minutes'
						),
						_react2.default.createElement(_space2.default, { height: '2' }),
						_react2.default.createElement(
							_label2.default,
							null,
							'Status'
						),
						_react2.default.createElement(_space2.default, { height: '0.5' }),
						_react2.default.createElement(
							_text2.default,
							{
								style: {
									color: entry.running ? '#27ae60' : '#c0392b'
								} },
							!entry.running && 'Not ',
							'Active'
						),
						_react2.default.createElement(_space2.default, { height: '2' }),
						_react2.default.createElement(_deletebutton2.default, {
							light: true,
							label: 'Delete Feed',
							onDelete: this.onDelete })
					)
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var data = this.props.data.rss;
			var state = this.props.state;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					_label2.default,
					null,
					'RSS Feeds'
				),
				_react2.default.createElement(_space2.default, { height: '1' }),
				_react2.default.createElement(
					'div',
					{ className: _index2.default.feeds },
					_react2.default.createElement(
						_scrollpane2.default,
						null,
						_react2.default.createElement(_listselect2.default, {
							light: true,
							values: data._.map(function (entry) {
								return entry.feed;
							}),
							selected: state.selected,
							onChange: this.onSelectChange })
					)
				),
				this.renderDetails()
			);
		}
	}]);

	return RSSSettings;
}(_react2.default.Component);

exports.default = RSSSettings;