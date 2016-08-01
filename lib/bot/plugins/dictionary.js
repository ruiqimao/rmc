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

var _class = function (_Plugin) {
	_inherits(_class, _Plugin);

	function _class() {
		_classCallCheck(this, _class);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	}

	_createClass(_class, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							this.addCommand('define', Define);
							this.addCommand('changedef', ChangeDef);
							this.addCommand('cleardef', ClearDef);

							// Create a class for definitions.
							this.Definition = this.createModel('definition');

						case 4:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;

var Define = function (_Command) {
	_inherits(Define, _Command);

	function Define() {
		_classCallCheck(this, Define);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Define).apply(this, arguments));
	}

	_createClass(Define, [{
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
			var definitions, definition, results;
			return regeneratorRuntime.wrap(function process$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context3.next = 2;
								break;
							}

							return _context3.abrupt('return', this.client.reply(msg, 'So... what do you want me to define, dipshit?'));

						case 2:
							_context3.next = 4;
							return this.plugin.Definition.limit(1).find({
								'phrase': suffix.toLowerCase(),
								'server': msg.server.id
							});

						case 4:
							definitions = _context3.sent;

							if (!(definitions.length > 0)) {
								_context3.next = 8;
								break;
							}

							definition = definitions[0].get('definition');
							return _context3.abrupt('return', this.client.sendMessage(msg, definition));

						case 8:
							_context3.t0 = JSON;
							_context3.next = 11;
							return (0, _requestPromise2.default)('http://api.urbandictionary.com/v0/define?term=' + suffix);

						case 11:
							_context3.t1 = _context3.sent;
							results = _context3.t0.parse.call(_context3.t0, _context3.t1);

							if (!(results.list.length == 0)) {
								_context3.next = 15;
								break;
							}

							return _context3.abrupt('return', this.client.reply(msg, 'I couldn\'t find anything for that. Next.'));

						case 15:

							// Return the first result.
							this.client.sendMessage(msg, results.list[0].definition);

						case 16:
						case 'end':
							return _context3.stop();
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

var ChangeDef = function (_Command2) {
	_inherits(ChangeDef, _Command2);

	function ChangeDef() {
		_classCallCheck(this, ChangeDef);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ChangeDef).apply(this, arguments));
	}

	_createClass(ChangeDef, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							return _context4.abrupt('return', _plugin.Util.checkRole(msg.server, msg.author, this.config.COMMANDER));

						case 1:
						case 'end':
							return _context4.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var definitions, definition, response;
			return regeneratorRuntime.wrap(function process$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context5.next = 2;
								break;
							}

							return _context5.abrupt('return', this.client.reply(msg, 'I can\'t change the definition of nothing, idiot.'));

						case 2:
							_context5.next = 4;
							return this.plugin.Definition.limit(1).find({
								'phrase': suffix.toLowerCase(),
								'server': msg.server.id
							});

						case 4:
							definitions = _context5.sent;


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
							_context5.next = 9;
							return this.client.awaitResponse(msg, 'Okay, what do you want me to change the definition of `' + suffix + '` to? Say "nvm" if you change your mind!');

						case 9:
							response = _context5.sent;

							if (!(response.content == 'nvm')) {
								_context5.next = 12;
								break;
							}

							return _context5.abrupt('return', this.client.sendMessage(msg, 'Okay, I won\'t touch the definition!'));

						case 12:

							// Change and save the definition.
							definition.set('definition', response.content);
							_context5.next = 15;
							return definition.save();

						case 15:
							this.client.sendMessage(msg, 'Alright, definition saved!');

						case 16:
						case 'end':
							return _context5.stop();
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

var ClearDef = function (_Command3) {
	_inherits(ClearDef, _Command3);

	function ClearDef() {
		_classCallCheck(this, ClearDef);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ClearDef).apply(this, arguments));
	}

	_createClass(ClearDef, [{
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context6) {
				while (1) {
					switch (_context6.prev = _context6.next) {
						case 0:
							return _context6.abrupt('return', _plugin.Util.checkRole(msg.server, msg.author, this.config.COMMANDER));

						case 1:
						case 'end':
							return _context6.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var response;
			return regeneratorRuntime.wrap(function process$(_context7) {
				while (1) {
					switch (_context7.prev = _context7.next) {
						case 0:
							if (!(suffix.length == 0)) {
								_context7.next = 13;
								break;
							}

							_context7.next = 3;
							return this.client.awaitResponse(msg, 'Are you sure you want to clear *all* custom definitions?');

						case 3:
							response = _context7.sent;

							if (!_plugin.Util.checkAffirmative(response.content)) {
								_context7.next = 11;
								break;
							}

							_context7.next = 7;
							return this.plugin.Definition.remove({
								'server': msg.server.id
							});

						case 7:
							_context7.next = 9;
							return this.client.sendMessage(msg, 'Okay, I cleared all the custom definitions!');

						case 9:
							_context7.next = 12;
							break;

						case 11:
							// Tell the user the response was negative.
							this.client.sendMessage(msg, 'Okay, I won\'t touch the definitions.');

						case 12:
							return _context7.abrupt('return');

						case 13:
							_context7.next = 15;
							return this.plugin.Definition.remove({
								'phrase': suffix.toLowerCase(),
								'server': msg.server.id
							});

						case 15:
							this.client.sendMessage(msg, 'Okay, I cleared the definition for `' + suffix + '`!');

						case 16:
						case 'end':
							return _context7.stop();
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