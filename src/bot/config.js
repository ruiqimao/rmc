export const game = 'Beating Up AR-D'; // Game to play.

export const commander = 'Kuhne'; // Commander role.

export const commandPrefix = '!'; // Command prefix.

// Import all commands.
import About from './commands/about';
import { Pet, Slap } from './commands/interact';
import Say from './commands/say';
import Choose from './commands/choose';
import Picture from './commands/picture';
import Purge from './commands/purge';
import Uptime from './commands/uptime';
import { Join, Leave } from './commands/voice';
import { Play, Skip } from './commands/music';

export const commands = { // All enabled commands.
	// About.
	About,

	// Interact.
	Pet,
	Slap,

	// Say.
	Say,

	// Choose.
	Choose,

	// Picture.
	Picture,

	// Purge.
	Purge,

	// Uptime.
	Uptime,

	// Voice.
	Join,
	Leave,

	// Music.
	Play,
	Skip
};
