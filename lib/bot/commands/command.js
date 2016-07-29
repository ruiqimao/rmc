'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Class for Command.
 */
var Command = function () {

	/*
  * Constructor.
  *
  * @param client The Discord client.
  * @param config The configuration.
  */
	function Command(client, config) {
		_classCallCheck(this, Command);

		// Assign the member variables.
		this.client = client;
		this.config = config;

		// Make sure the proper virtual methods exist.
		if (this.usage === undefined) throw new TypeError('Must have a usage.');
		if (this.description === undefined) throw new TypeError('Must have a description.');
		if (this.authorize === undefined) throw new TypeError('Must implement authorize().');
		if (this.process === undefined) throw new TypeError('Must implement process().');

		// Call init() if it exists.
		if (this.init) this.init();
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
			this.authorize(msg, suffix, function (allowed) {
				if (allowed) {
					// Run.
					_this.process(msg, suffix);
				} else {
					// Don't run.
					_this.permissionDenied(msg);
				}
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

/*
 * Other utilities.
 */


exports.default = Command;

var Util = exports.Util = function () {
	function Util() {
		_classCallCheck(this, Util);
	}

	_createClass(Util, null, [{
		key: 'checkAffirmative',


		/*
   * Check whether a message is affirmative.
   *
   * @param msg The string contents of the message.
   *
   * @return Whether the message is affirmative.
   */
		value: function checkAffirmative(msg) {
			var affirmativeWords = ['yes', 'yeah', 'sure', 'of course', 'mhmm', 'okay', 'ok', 'y', 'yep', 'yea', 'oh yes', 'hell yeah', 'hell yea', 'no shit'];

			// Set the message to lowercase and trim it.
			msg = msg.toLowerCase().trim();

			// Get whether the message is affirmative.
			return affirmativeWords.indexOf(msg) != -1;
		}

		/*
   * Check if a user has a given permission.
   *
   * @param channel A channel.
   * @param user A user.
   * @param permission The permission to check.
   *
   * @return Whether the user has permission.
   */

	}, {
		key: 'checkPermission',
		value: function checkPermission(channel, user, permission) {
			// If the channel is private, all permissions are granted.
			if (channel.isPrivate) return true;

			// Get whether the user has permission.
			return channel.permissionsOf(user).hasPermission(permission);
		}

		/*
   * Check if a user has a given role.
   *
   * @param server A server.
   * @param user A user.
   * @param role The role to check.
   *
   * @return Whether the user has the role.
   */

	}, {
		key: 'checkRole',
		value: function checkRole(server, user, role) {
			// If the channel is private, all permissions are granted.
			if (!server) return true;

			// Get whether the user has the role.
			return server.rolesOfUser(user).reduce(function (p, c, i) {
				return p || c.name == role;
			}, false);
		}
	}]);

	return Util;
}();