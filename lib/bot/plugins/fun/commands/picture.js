'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

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
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							// Picture URLs.
							this.pictures = ['http://vignette3.wikia.nocookie.net/gakusen-toshi-asterisk/images/7/77/RM-C_Anime.png/revision/latest?cb=20151129023211', 'http://vignette1.wikia.nocookie.net/animevice/images/4/4f/Ernesta_adn_RM-C_(The_Asterisk_War_Ep_10).jpg/revision/latest?cb=20151207015043', 'http://asteriskwar.com/assets/img/character/character_ph/rmc.png', 'http://vignette4.wikia.nocookie.net/gakusen-toshi-asterisk/images/0/0d/AR-D_and_RM-C.png/revision/latest?cb=20151223062540', 'http://vignette3.wikia.nocookie.net/gakusen-toshi-asterisk/images/7/77/RM-C_Anime.png/revision/20151129023211', 'http://pa1.narvii.com/6116/979d62ebe858ee55261347c371e24785cf457195_hq.gif', 'http://pm1.narvii.com/6116/372607a4e340abdaae88ecbad9cb63d26273ad39_hq.jpg', 'http://asteriskwar.com/assets/img/story/17/ep_slide01.jpg'];

							// Responses.
							this.responses = ['Here you go!', 'Don\'t look too closely, b-baka!', 'Don\'t I look fabulous?', 'Notice me, senpai!', 'You better be thankful, I took this one just for you!', 'I bet you\'re jacking off to this, pervert.'];

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							return _context2.abrupt('return', true);

						case 1:
						case 'end':
							return _context2.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var index, index2;
			return regeneratorRuntime.wrap(function process$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							// Respond with a random picture and message.
							index = Math.floor(Math.random() * this.pictures.length);
							index2 = Math.floor(Math.random() * this.responses.length);
							_context3.next = 4;
							return this.client.sendFile(msg, this.pictures[index], 'image.jpg');

						case 4:
							this.client.sendMessage(msg, this.responses[index2]);

						case 5:
						case 'end':
							return _context3.stop();
					}
				}
			}, process, this);
		})
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
}(_plugin.Command);

exports.default = Picture;