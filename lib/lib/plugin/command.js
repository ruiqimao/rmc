'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Command.
 */
var Command = function () {

	/*
  * Constructor.
  *
  * @param plugin The plugin associated with the command.
  */
	function Command(plugin) {
		_classCallCheck(this, Command);

		// Assign the member variables.
		this.plugin = plugin;
		this.client = plugin.client;
		this.config = plugin.config;

		// Steal functions from the plugin.
		this.getVoiceConnection = plugin.getVoiceConnection.bind(plugin);
		this.permissionDenied = plugin.permissionDenied.bind(plugin);
		this.errorOccurred = plugin.errorOccurred.bind(plugin);

		// Make sure the proper virtual methods exist.
		if (this.usage === undefined) throw new TypeError('Must have a usage.');
		if (this.description === undefined) throw new TypeError('Must have a description.');
		if (this.authorize === undefined) throw new TypeError('Must implement authorize().');
		if (this.process === undefined) throw new TypeError('Must implement process().');
	}

	/*
  * Load the command.
  *
  * @return A Promise after the command has loaded.
  */


	_createClass(Command, [{
		key: 'load',
		value: function load() {
			if (this.init) {
				// Call init() if it exists.
				return (0, _co2.default)(this.init.bind(this));
			} else {
				// Otherwise, return a resolved Promise.
				return Promise.resolve();
			}
		}

		/*
   * Unload the command.
   *
   * @return A Promise after the command has unloaded.
   */

	}, {
		key: 'unload',
		value: function unload() {
			if (this.destroy) {
				// Call destroy() if it exists.
				return (0, _co2.default)(this.destroy.bind(this));
			} else {
				// Otherwise, return a resolved Promise.
				return Promise.resolve();
			}
		}

		/*
   * Run the command.
   *
   * @param msg The message that triggered the command.
   * @param suffix The suffix of the command.
   *
   * @return A Promise after the command is finished.
   */

	}, {
		key: 'run',
		value: function run(msg, suffix) {
			return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
				var _this = this;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return (0, _co2.default)(this.authorize.bind(this), msg, suffix);

							case 2:
								if (!_context.sent) {
									_context.next = 6;
									break;
								}

								return _context.abrupt('return', (0, _co2.default)(this.process.bind(this), msg, suffix).catch(function () {
									_this.errorOccurred(msg);
								}));

							case 6:
								// Don't run.
								this.permissionDenied(msg);

								// Return a resolved Promise.
								return _context.abrupt('return', Promise.resolve());

							case 8:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}).bind(this));
		}
	}]);

	return Command;
}();

exports.default = Command;