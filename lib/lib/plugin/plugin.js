"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Class for plugin.
 */
var Plugin = function () {

	/*
  * Constructor.
  *
  * @bot The bot.
  */
	function Plugin(bot) {
		_classCallCheck(this, Plugin);

		// Set the member variables.
		this.bot = bot;
		this.client = bot.client;
		this.config = bot.config;
		this.commands = [];

		// Call init() if it exists.
		if (this.init) this.init();
	}

	/*
  * Add a command.
  *
  * @param name Name of the command.
  * @param command Prototype of the command to add.
  */


	_createClass(Plugin, [{
		key: "addCommand",
		value: function addCommand(name, command) {
			this.commands.push({
				name: name,
				command: new command(this)
			});
		}

		/*
   * Remove a command.
   *
   * @param name Name of the command.
   */

	}, {
		key: "removeCommand",
		value: function removeCommand(name) {
			this.commands = this.commands.filter(function (command) {
				return command.name != name;
			});
		}
	}]);

	return Plugin;
}();

exports.default = Plugin;