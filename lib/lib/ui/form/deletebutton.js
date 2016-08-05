'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _trashO = require('react-icons/lib/fa/trash-o');

var _trashO2 = _interopRequireDefault(_trashO);

var _deletebutton = require('./css/deletebutton.css');

var _deletebutton2 = _interopRequireDefault(_deletebutton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteButton = function (_React$Component) {
	_inherits(DeleteButton, _React$Component);

	function DeleteButton(props) {
		_classCallCheck(this, DeleteButton);

		// Set the state.
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeleteButton).call(this, props));

		_this.state = {
			expanded: false
		};

		// Bind the event listeners.
		_this.onClick = _this.onClick.bind(_this);
		return _this;
	}

	_createClass(DeleteButton, [{
		key: 'onClick',
		value: function onClick(evt) {
			if (!this.state.expanded) {
				// Expand if needed.
				// Expand the label.
				var target = evt.target;
				var label = target.children[1];
				label.style.width = 'auto';
				var width = label.getBoundingClientRect().width;
				label.style.width = '0';
				label.style.width = width + 'px';
				label.style.padding = '0 1rem';

				// Set the state.
				return this.setState({
					expanded: true
				});
			} else {
				// Otherwise, delete.
				if (this.props.onDelete) this.props.onDelete();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _classNames;

			var classes = (0, _classnames2.default)(_deletebutton2.default.deletebutton, (_classNames = {}, _defineProperty(_classNames, _deletebutton2.default.dark, this.props.dark), _defineProperty(_classNames, _deletebutton2.default.light, this.props.light), _defineProperty(_classNames, _deletebutton2.default.expanded, this.state.expanded), _classNames), this.props.className);

			return _react2.default.createElement(
				'button',
				{
					className: classes,
					style: this.props.style,
					onClick: this.onClick,
					disabled: this.props.disabled },
				_react2.default.createElement(
					'div',
					{ className: _deletebutton2.default.icon },
					_react2.default.createElement(_trashO2.default, { className: _deletebutton2.default.trashcan })
				),
				_react2.default.createElement(
					'div',
					{ className: _deletebutton2.default.label },
					this.props.label
				)
			);
		}
	}]);

	return DeleteButton;
}(_react2.default.Component);

exports.default = DeleteButton;