'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Define = function (_Command) {
	_inherits(Define, _Command);

	function Define() {
		_classCallCheck(this, Define);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Define).apply(this, arguments));
	}

	_createClass(Define, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
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
							return _context.abrupt('return', true);

						case 3:
						case 'end':
							return _context.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var definitions, definition, results;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context2.next = 2;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'So... what do you want me to define, dipshit?'));

						case 2:
							_context2.next = 4;
							return this.plugin.Definition.limit(1).find({
								'phrase': suffix.toLowerCase(),
								'server': msg.server.id
							});

						case 4:
							definitions = _context2.sent;

							if (!(definitions.length > 0)) {
								_context2.next = 8;
								break;
							}

							definition = definitions[0].get('definition');
							return _context2.abrupt('return', this.client.sendMessage(msg, definition));

						case 8:
							_context2.t0 = JSON;
							_context2.next = 11;
							return (0, _requestPromise2.default)('http://api.urbandictionary.com/v0/define?term=' + suffix);

						case 11:
							_context2.t1 = _context2.sent;
							results = _context2.t0.parse.call(_context2.t0, _context2.t1);

							if (!(results.list.length == 0)) {
								_context2.next = 15;
								break;
							}

							return _context2.abrupt('return', this.client.reply(msg, 'I couldn\'t find anything for that. Next.'));

						case 15:

							// Return the first result.
							this.client.sendMessage(msg, results.list[0].definition);

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
			return 'define something!';
		}
	}]);

	return Define;
}(_plugin.Command);

exports.default = Define;