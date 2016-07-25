'use strict';

exports.GAME = 'Beating Up AR-D'; // Game to play.

exports.COMMANDER = 'Kuhne'; // Commander role.

exports.COMMAND_PREFIX = '!'; // Command prefix.

exports.COMMANDS = { // All enabled commands.
	// About.
	'about': require('./commands/about'),

	// Interact.
	'pet': require('./commands/interact').pet,
	'slap': require('./commands/interact').slap,

	// Say.
	'say': require('./commands/say'),

	// Choose.
	'choose': require('./commands/choose'),

	// Purge.
	'purge': require('./commands/purge'),

	// Uptime.
	'uptime': require('./commands/uptime'),

	// Voice.
	'join': require('./commands/voice').join,
	'leave': require('./commands/voice').leave,

	// Music.
	'play': require('./commands/music').play,
	'skip': require('./commands/music').skip
};
