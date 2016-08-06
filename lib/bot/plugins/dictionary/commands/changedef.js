'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChangeDef = function (_Command) {
	_inherits(ChangeDef, _Command);

	function ChangeDef() {
		_classCallCheck(this, ChangeDef);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ChangeDef).apply(this, arguments));
	}

	_createClass(ChangeDef, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			var commander;
			return regeneratorRuntime.wrap(function authorize$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							if (!msg.channel.isPrivate) {
								_context.next = 2;
								break;
							}

							return _context.abrupt('return', false);

						case 2:
							_context.next = 4;
							return this.bot.Commander.getEntry(msg.server.id, '');

						case 4:
							commander = _context.sent.val();
							return _context.abrupt('return', _plugin.Util.checkRole(msg.server, msg.author, commander));

						case 6:
						case 'end':
							return _context.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var definitions, definition, response;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context2.next = 2;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'I can\'t change the definition of nothing, idiot.'));

						case 2:
							_context2.next = 4;
							return this.plugin.Definition.limit(1).find({
								'phrase': suffix.toLowerCase(),
								'server': msg.server.id
							});

						case 4:
							definitions = _context2.sent;


							// Get a definition to change.
							definition = void 0;

							if (definitions.length > 0) {
								// If there is a custom definition, use it.
								definition = definitions[0];
							} else {
								// Otherwise, create a new one.
								definition = new this.plugin.Definition({
									'phrase': suffix.toLowerCase(),
									'server': msg.server.id
								});
							}

							// Ask for a definition.
							_context2.next = 9;
							return this.client.awaitResponse(msg, 'Okay, what do you want me to change the definition of `' + suffix + '` to? Say "nvm" if you change your mind!');

						case 9:
							response = _context2.sent;

							if (!(response.content == 'nvm')) {
								_context2.next = 12;
								break;
							}

							return _context2.abrupt('return', this.client.sendMessage(msg, 'Okay, I won\'t touch the definition!'));

						case 12:

							// Change and save the definition.
							definition.set('definition', response.content);
							_context2.next = 15;
							return definition.save();

						case 15:
							this.client.sendMessage(msg, 'Alright, definition saved!');

						case 16:
						case 'end':
							return _context2.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'usage',
		get: function get() {
			return '<phrase>';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'change the definition of something!';
		}
	}]);

	return ChangeDef;
}(_plugin.Command);

exports.default = ChangeDef;