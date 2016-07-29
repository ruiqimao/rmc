'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _about = require('./plugins/about');

var _about2 = _interopRequireDefault(_about);

var _interact = require('./plugins/interact');

var _interact2 = _interopRequireDefault(_interact);

var _say = require('./plugins/say');

var _say2 = _interopRequireDefault(_say);

var _choose = require('./plugins/choose');

var _choose2 = _interopRequireDefault(_choose);

var _picture = require('./plugins/picture');

var _picture2 = _interopRequireDefault(_picture);

var _purge = require('./plugins/purge');

var _purge2 = _interopRequireDefault(_purge);

var _voice = require('./plugins/voice');

var _voice2 = _interopRequireDefault(_voice);

var _music = require('./plugins/music');

var _music2 = _interopRequireDefault(_music);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Export the config.
// Import all plugins.
exports.default = {
	GAME: 'Beating Up AR-D', // GAme to play.

	COMMANDER: 'Kuhne', // Commander role.

	COMMAND_PREFIX: '!', // Command prefix.

	PLUGINS: { // All enabled plugins.
		About: _about2.default,
		Interact: _interact2.default,
		Say: _say2.default,
		Choose: _choose2.default,
		Picture: _picture2.default,
		Purge: _purge2.default,
		Voice: _voice2.default,
		Music: _music2.default
	}
};