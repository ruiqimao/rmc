'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Utilities.
 */
var Util = function () {
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

exports.default = Util;