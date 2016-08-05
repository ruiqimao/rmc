'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = require('plugin');

var _define = require('./commands/define');

var _define2 = _interopRequireDefault(_define);

var _changedef = require('./commands/changedef');

var _changedef2 = _interopRequireDefault(_changedef);

var _cleardef = require('./commands/cleardef');

var _cleardef2 = _interopRequireDefault(_cleardef);

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
							this.addCommand('define', _define2.default);
							this.addCommand('changedef', _changedef2.default);
							this.addCommand('cleardef', _cleardef2.default);

							// Create a class for definitions.
							this.Definition = this.createModel('definition');

						case 4:
						case 'end':
							return _context.stop();
					}
				}
			}, init, this);
		})
	}, {
		key: 'getData',
		value: regeneratorRuntime.mark(function getData(id) {
			var entries, definitions;
			return regeneratorRuntime.wrap(function getData$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return this.Definition.find({
								'server': id
							});

						case 2:
							entries = _context2.sent;


							// Map the entries to their phrases and definitions and sort them.
							definitions = entries.map(function (entry) {
								return {
									phrase: entry.get('phrase'),
									definition: entry.get('definition')
								};
							}).sort(function (a, b) {
								return a.phrase.localeCompare(b.phrase);
							});

							// Return the definitions.

							return _context2.abrupt('return', definitions);

						case 5:
						case 'end':
							return _context2.stop();
					}
				}
			}, getData, this);
		})
	}, {
		key: 'saveData',
		value: regeneratorRuntime.mark(function saveData(id, data) {
			var updated, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, entries, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _entry, phrase, definition;

			return regeneratorRuntime.wrap(function saveData$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							// Convert the data into an object.
							updated = {};
							_iteratorNormalCompletion = true;
							_didIteratorError = false;
							_iteratorError = undefined;
							_context3.prev = 4;

							for (_iterator = data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								entry = _step.value;

								updated[entry.phrase] = entry.definition.trim();
							}

							// Get all definitions for the server.
							_context3.next = 12;
							break;

						case 8:
							_context3.prev = 8;
							_context3.t0 = _context3['catch'](4);
							_didIteratorError = true;
							_iteratorError = _context3.t0;

						case 12:
							_context3.prev = 12;
							_context3.prev = 13;

							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}

						case 15:
							_context3.prev = 15;

							if (!_didIteratorError) {
								_context3.next = 18;
								break;
							}

							throw _iteratorError;

						case 18:
							return _context3.finish(15);

						case 19:
							return _context3.finish(12);

						case 20:
							_context3.next = 22;
							return this.Definition.find({
								'server': id
							});

						case 22:
							entries = _context3.sent;


							// Update all the definitions.
							_iteratorNormalCompletion2 = true;
							_didIteratorError2 = false;
							_iteratorError2 = undefined;
							_context3.prev = 26;
							_iterator2 = entries[Symbol.iterator]();

						case 28:
							if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
								_context3.next = 44;
								break;
							}

							_entry = _step2.value;
							phrase = _entry.get('phrase');
							definition = _entry.get('definition');

							if (!(updated[phrase] === undefined)) {
								_context3.next = 37;
								break;
							}

							_context3.next = 35;
							return _entry.remove();

						case 35:
							_context3.next = 41;
							break;

						case 37:
							if (!(updated[phrase] !== definition)) {
								_context3.next = 41;
								break;
							}

							// Update the definition if it is different.
							_entry.set('definition', updated[phrase]);
							_context3.next = 41;
							return _entry.save();

						case 41:
							_iteratorNormalCompletion2 = true;
							_context3.next = 28;
							break;

						case 44:
							_context3.next = 50;
							break;

						case 46:
							_context3.prev = 46;
							_context3.t1 = _context3['catch'](26);
							_didIteratorError2 = true;
							_iteratorError2 = _context3.t1;

						case 50:
							_context3.prev = 50;
							_context3.prev = 51;

							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}

						case 53:
							_context3.prev = 53;

							if (!_didIteratorError2) {
								_context3.next = 56;
								break;
							}

							throw _iteratorError2;

						case 56:
							return _context3.finish(53);

						case 57:
							return _context3.finish(50);

						case 58:
						case 'end':
							return _context3.stop();
					}
				}
			}, saveData, this, [[4, 8, 12, 20], [13,, 15, 19], [26, 46, 50, 58], [51,, 53, 57]]);
		})
	}]);

	return _class;
}(_plugin.Plugin);

exports.default = _class;