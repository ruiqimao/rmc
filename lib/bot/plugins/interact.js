'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

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
							this.addCommand('pet', Pet);
							this.addCommand('slap', Slap);

						case 2:
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

var Pet = function (_Command) {
	_inherits(Pet, _Command);

	function Pet() {
		_classCallCheck(this, Pet);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Pet).apply(this, arguments));
	}

	_createClass(Pet, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							// Pet counter.
							this.pets = 0;

						case 1:
						case 'end':
							return _context2.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							return _context3.abrupt('return', true);

						case 1:
						case 'end':
							return _context3.stop();
					}
				}
			}, authorize, this);
		})
	}, {
		key: 'process',
		value: regeneratorRuntime.mark(function process(msg, suffix) {
			var _this3 = this;

			var countString;
			return regeneratorRuntime.wrap(function process$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							// Respond with the count.
							countString = ++this.pets + ' time';

							if (this.pets > 1) countString += 's';
							this.client.sendMessage(msg, '*~kya~*, I\'ve been petted ' + countString + '.', function () {
								// Send either a heart or a tsundere message.
								if (Math.random() > 0.5) {
									// Heart!
									_this3.client.sendMessage(msg, ':heart:');
								} else {
									// B-baka!
									_this3.client.sendMessage(msg, 'B-baka! It\'s not like I wanted you to pet me or anything...');
								}
							});

						case 3:
						case 'end':
							return _context4.stop();
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
			return 'pet me for being a good robot!';
		}
	}]);

	return Pet;
}(_plugin.Command);

var Slap = function (_Command2) {
	_inherits(Slap, _Command2);

	function Slap() {
		_classCallCheck(this, Slap);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Slap).apply(this, arguments));
	}

	_createClass(Slap, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							// Any of the responses RM-C can give when slapped.
							this.responses = ['Don\'t touch me.', 'No.', 'Stop it.', 'Why?', 'Get away from me.', 'I hate you.', 'Do you want to die?', 'I\'ll seriously get angry!'];

						case 1:
						case 'end':
							return _context5.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'authorize',
		value: regeneratorRuntime.mark(function authorize(msg, suffix) {
			return regeneratorRuntime.wrap(function authorize$(_context6) {
				while (1) {
					switch (_context6.prev = _context6.next) {
						case 0:
							return _context6.abrupt('return', true);

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
			var index;
			return regeneratorRuntime.wrap(function process$(_context7) {
				while (1) {
					switch (_context7.prev = _context7.next) {
						case 0:
							// Respond with a random message.
							index = Math.floor(Math.random() * this.responses.length);

							this.client.sendMessage(msg, this.responses[index]);

						case 2:
						case 'end':
							return _context7.stop();
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
			return 'slap me for being a bad robot :(';
		}
	}]);

	return Slap;
}(_plugin.Command);