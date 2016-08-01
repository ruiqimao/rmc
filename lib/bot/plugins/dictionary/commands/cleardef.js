'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClearDef = function (_Command) {
	_inherits(ClearDef, _Command);

	function ClearDef() {
		_classCallCheck(this, ClearDef);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ClearDef).apply(this, arguments));
	}

	_createClass(ClearDef, [{
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
							return _context.abrupt('return', _plugin.Util.checkRole(msg.server, msg.author, this.config.COMMANDER));

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
			var response;
			return regeneratorRuntime.wrap(function process$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context2.next = 13;
								break;
							}

							_context2.next = 3;
							return this.client.awaitResponse(msg, 'Are you sure you want to clear *all* custom definitions?');

						case 3:
							response = _context2.sent;

							if (!_plugin.Util.checkAffirmative(response.content)) {
								_context2.next = 11;
								break;
							}

							_context2.next = 7;
							return this.plugin.Definition.remove({
								'server': msg.server.id
							});

						case 7:
							_context2.next = 9;
							return this.client.sendMessage(msg, 'Okay, I cleared all the custom definitions!');

						case 9:
							_context2.next = 12;
							break;

						case 11:
							// Tell the user the response was negative.
							this.client.sendMessage(msg, 'Okay, I won\'t touch the definitions.');

						case 12:
							return _context2.abrupt('return');

						case 13:
							_context2.next = 15;
							return this.plugin.Definition.remove({
								'phrase': suffix.toLowerCase(),
								'server': msg.server.id
							});

						case 15:
							this.client.sendMessage(msg, 'Okay, I cleared the definition for `' + suffix + '`!');

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
			return '[phrase]';
		}
	}, {
		key: 'description',
		get: function get() {
			return 'clear a custom definition.';
		}
	}]);

	return ClearDef;
}(_plugin.Command);

exports.default = ClearDef;