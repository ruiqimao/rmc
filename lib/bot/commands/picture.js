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

var Picture = function (_Command) {
	_inherits(Picture, _Command);

	function Picture() {
		_classCallCheck(this, Picture);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Picture).apply(this, arguments));
	}

	_createClass(Picture, [{
		key: 'init',
		value: function init() {
			// Picture URLs.
			this.pictures = ['http://vignette3.wikia.nocookie.net/gakusen-toshi-asterisk/images/7/77/RM-C_Anime.png/revision/latest?cb=20151129023211', 'http://vignette1.wikia.nocookie.net/animevice/images/4/4f/Ernesta_adn_RM-C_(The_Asterisk_War_Ep_10).jpg/revision/latest?cb=20151207015043', 'http://asteriskwar.com/assets/img/character/character_ph/rmc.png', 'http://vignette4.wikia.nocookie.net/gakusen-toshi-asterisk/images/0/0d/AR-D_and_RM-C.png/revision/latest?cb=20151223062540', 'http://vignette3.wikia.nocookie.net/gakusen-toshi-asterisk/images/7/77/RM-C_Anime.png/revision/20151129023211', 'http://pa1.narvii.com/6116/979d62ebe858ee55261347c371e24785cf457195_hq.gif', 'http://pm1.narvii.com/6116/372607a4e340abdaae88ecbad9cb63d26273ad39_hq.jpg', 'http://asteriskwar.com/assets/img/story/17/ep_slide01.jpg'];

			// Responses.
			this.responses = ['Here you go!', 'Don\'t look too closely, b-baka!', 'Don\'t I look fabulous?', 'Notice me, senpai!', 'You better be thankful, I took this one just for you!', 'I bet you\'re jacking off to this, pervert.'];
		}
	}, {
		key: 'authorize',
		value: function authorize(msg, suffix, next) {
			// Everyone is allowed to look for pictures.
			next(true);
		}
	}, {
		key: 'process',
		value: function process(msg, suffix) {
			var _this2 = this;

			// Respond with a random picture and message.
			var index = Math.floor(Math.random() * this.pictures.length);
			var index2 = Math.floor(Math.random() * this.responses.length);
			this.client.sendFile(msg, this.pictures[index], 'image.jpg', function (err) {
				if (err) return _this2.errorOccurred(msg);

				_this2.client.sendMessage(msg, _this2.responses[index2]);
			});
		}
	}, {
		key: 'usage',
		get: function get() {
			return '';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'find a picture of me';
		}
	}]);

	return Picture;
}(_command2.default);

exports.default = Picture;