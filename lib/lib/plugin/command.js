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

		// Make sure the proper virtual methods exist.
		if (this.usage === undefined) throw new TypeError('Must have a usage.');
		if (this.description === undefined) throw new TypeError('Must have a description.');
		if (this.authorize === undefined) throw new TypeError('Must implement authorize().');
		if (this.process === undefined) throw new TypeError('Must implement process().');

		// Call init() if it exists.
		if (this.init) (0, _co2.default)(this.init.bind(this));
	}

	/*
  * Run the command.
  *
  * @param msg The message that triggered the command.
  * @param suffix The suffix of the command.
  */


	_createClass(Command, [{
		key: 'run',
		value: function run(msg, suffix) {
			var _this = this;

			// Check permissions.
			(0, _co2.default)(this.authorize.bind(this), msg, suffix).then(function (allowed) {
				if (allowed) {
					// Run.
					(0, _co2.default)(_this.process.bind(_this), msg, suffix).catch(function () {
						_this.errorOccurred(msg);
					});
				} else {
					// Don't run.
					_this.permissionDenied(msg);
				}
			}).catch(function () {
				_this.errorOccurred(msg);
			});
		}

		/*
   * Get the voice connection RM-C is connected to.
   *
   * @param server The server to look for.
   *
   * @return The voice connection associated with the server, null if it doesn't exist.
   */

	}, {
		key: 'getVoiceConnection',
		value: function getVoiceConnection(server) {
			// Get all connections associated with the server.
			var connections = this.client.voiceConnections.filter(function (v) {
				return v.voiceChannel.server.equals(server);
			});

			// Return the connection.
			if (connections.length == 0) return null;
			return connections[0];
		}

		/*
   * Sends a permission denied reply.
   *
   * @param channel A Channel resolvable.
   */

	}, {
		key: 'permissionDenied',
		value: function permissionDenied(channel) {
			this.client.reply(channel, 'I don\'t recognize your authority.');
		}

		/*
   * Sends a message saying something went wrong.
   *
   * @param chanel A channel resolvable.
   */

	}, {
		key: 'errorOccurred',
		value: function errorOccurred(channel) {
			this.client.sendMessage(channel, 'My creator is an idiot. Something went wrong!');
		}
	}]);

	return Command;
}();

exports.default = Command;