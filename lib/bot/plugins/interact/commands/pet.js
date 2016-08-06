'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RESPONSES = [':heart:', 'B-baka! It\'s not like I wanted you to pet me or anything...'];

var Pet = function (_Command) {
	_inherits(Pet, _Command);

	function Pet() {
		_classCallCheck(this, Pet);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Pet).apply(this, arguments));
	}

	_createClass(Pet, [{
		key: 'init',
		value: regeneratorRuntime.mark(function init() {
			return regeneratorRuntime.wrap(function init$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							// Pet counter model and response model.
							this.Pets = this.createModel('interact-pets');
							this.Responses = this.createModel('interact-pet-responses');

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
			var count, countString, responses, index;
			return regeneratorRuntime.wrap(function process$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							_context3.next = 2;
							return this.Pets.getEntry(msg.server.id, 0);

						case 2:
							count = _context3.sent;


							// Increment the count and save.
							count.val(count.val() + 1);
							_context3.next = 6;
							return count.save();

						case 6:

							// Respond with the count.
							countString = count.val() + ' time';

							if (count.val() > 1) countString += 's';
							_context3.next = 10;
							return this.client.sendMessage(msg, '*~kya~*, I\'ve been petted ' + countString + '.');

						case 10:
							_context3.next = 12;
							return this.Responses.getEntry(msg.server.id, RESPONSES);

						case 12:
							responses = _context3.sent.val();

							if (!(responses.length == 0)) {
								_context3.next = 15;
								break;
							}

							return _context3.abrupt('return');

						case 15:
							// Don't do anything if there are no responses.
							index = Math.floor(Math.random() * responses.length);

							this.client.sendMessage(msg, responses[index]);

						case 17:
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
							data = {};

							// Return the pets and responses.

							_context4.next = 3;
							return this.Pets.getEntry(id, 0);

						case 3:
							data.count = _context4.sent.val();
							_context4.next = 6;
							return this.Responses.getEntry(id, RESPONSES);

						case 6:
							data.responses = _context4.sent.val();
							return _context4.abrupt('return', data);

						case 8:
						case 'end':
							return _context4.stop();
					}
				}
			}, getData, this);
		})
	}, {
		key: 'saveData',
		value: regeneratorRuntime.mark(function saveData(id, data) {
			var pets, responses;
			return regeneratorRuntime.wrap(function saveData$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							_context5.next = 2;
							return this.Pets.getEntry(id, 0);

						case 2:
							pets = _context5.sent;
							_context5.next = 5;
							return this.Responses.getEntry(id, RESPONSES);

						case 5:
							responses = _context5.sent;


							// Validate the pet count.
							if (!isNaN(data.count)) pets.val(parseInt(data.count));

							// Remove empty responses.
							data.responses = data.responses.filter(function (response) {
								return response.trim().length > 0;
							});
							responses.val(data.responses);

							// Save.
							_context5.next = 11;
							return pets.save();

						case 11:
							_context5.next = 13;
							return responses.save();

						case 13:
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
			return 'pet me for being a good robot!';
		}
	}]);

	return Pet;
}(_plugin.Command);

exports.default = Pet;