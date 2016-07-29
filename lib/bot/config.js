'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.commands = exports.commandPrefix = exports.commander = exports.game = undefined;

var _about = require('./commands/about');

var _about2 = _interopRequireDefault(_about);

var _interact = require('./commands/interact');

var _say = require('./commands/say');

var _say2 = _interopRequireDefault(_say);

var _choose = require('./commands/choose');

var _choose2 = _interopRequireDefault(_choose);

var _picture = require('./commands/picture');

var _picture2 = _interopRequireDefault(_picture);

var _purge = require('./commands/purge');

var _purge2 = _interopRequireDefault(_purge);

var _uptime = require('./commands/uptime');

var _uptime2 = _interopRequireDefault(_uptime);

var _voice = require('./commands/voice');

var _music = require('./commands/music');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var game = exports.game = 'Beating Up AR-D'; // Game to play.

var commander = exports.commander = 'Kuhne'; // Commander role.

var commandPrefix = exports.commandPrefix = '!'; // Command prefix.

// Import all commands.
var commands = exports.commands = { // All enabled commands.
	// About.
	About: _about2.default,

	// Interact.
	Pet: _interact.Pet,
	Slap: _interact.Slap,

	// Say.
	Say: _say2.default,

	// Choose.
	Choose: _choose2.default,

	// Picture.
	Picture: _picture2.default,

	// Purge.
	Purge: _purge2.default,

	// Uptime.
	Uptime: _uptime2.default,

	// Voice.
	Join: _voice.Join,
	Leave: _voice.Leave,

	// Music.
	Play: _music.Play,
	Skip: _music.Skip
};