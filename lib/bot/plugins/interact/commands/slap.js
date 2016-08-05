'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RESPONSES = ['Don\'t touch me.', 'No.', 'Stop it.', 'Why?', 'Get away from me.', 'I hate you.', 'Do you want to die?', 'I\'ll seriously get angry!'];

var Slap = function (_Command) {
	_inherits(Slap, _Command);

	function Slap() {
		_classCallCheck(this, Slap);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Slap).apply(this, arguments));
	}

	_createClass(Slap, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							this.Responses = this.createModel('interact-slap-responses');

						case 1:
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
			var responses, index;
			return regeneratorRuntime.wrap(function process$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							_context3.next = 2;
							return this.Responses.getEntry(msg.server.id, RESPONSES);

						case 2:
							responses = _context3.sent.val();
							index = Math.floor(Math.random() * responses.length);

							this.client.sendMessage(msg, responses[index]);

						case 5:
						case 'end':
							return _context3.stop();
					}
				}
			}, process, this);
		})
	}, {
		key: 'getData',
		value: regeneratorRuntime.mark(function getData(id) {
			var data;
			return regeneratorRuntime.wrap(function getData$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							_context4.next = 2;
							return this.Responses.getEntry(id, RESPONSES);

						case 2:
							data = _context4.sent.val();
							return _context4.abrupt('return', data);

						case 4:
						case 'end':
							return _context4.stop();
					}
				}
			}, getData, this);
		})
	}, {
		key: 'saveData',
		value: regeneratorRuntime.mark(function saveData(id, data) {
			var responses;
			return regeneratorRuntime.wrap(function saveData$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							_context5.next = 2;
							return this.Responses.getEntry(id, RESPONSES);

						case 2:
							responses = _context5.sent;


							// Remove empty responses.
							data = data.filter(function (response) {
								return response.trim().length > 0;
							});
							responses.val(data);

							// Save.
							_context5.next = 7;
							return responses.save();

						case 7:
						case 'end':
							return _context5.stop();
					}
				}
			}, saveData, this);
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

exports.default = Slap;