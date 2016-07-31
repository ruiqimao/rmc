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
							this.addCommand('define', Define);
							this.addCommand('chdef', ChDef);

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
			return regeneratorRuntime.wrap(function process$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							this.client.sendMessage(msg, 'no');

						case 1:
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

var ChDef = function (_Command2) {
	_inherits(ChDef, _Command2);

	function ChDef() {
		_classCallCheck(this, ChDef);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ChDef).apply(this, arguments));
	}

	_createClass(ChDef, [{
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
			return regeneratorRuntime.wrap(function process$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							this.client.sendMessage(msg, 'k');

						case 1:
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

	return ChDef;
}(_plugin.Command);