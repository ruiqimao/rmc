'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Say = function (_Command) {
	_inherits(Say, _Command);

	function Say() {
		_classCallCheck(this, Say);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Say).apply(this, arguments));
	}

	_createClass(Say, [{
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			// Everyone is allowed to make RM-C say something.
			next(true);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			var _this2 = this;

			// Make sure there actually is a message.
			if (!suffix) return this.client.reply(msg, 'Hurry up and tell me what to say already.');

			this.client.sendMessage(msg, suffix, function () {
				// Delete the original message.
				_this2.client.deleteMessage(msg);
			});
		}
	}, {
		key: 'usage',
		get: function get() {
			return '<text>';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'make me say something';
		}
	}]);

	return Say;
}(_command2.default);

exports.default = Say;