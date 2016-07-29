// Import all plugins.
import About from './plugins/about';
import Interact from './plugins/interact';
import Say from './plugins/say';
import Choose from './plugins/choose';
import Picture from './plugins/picture';
import Purge from './plugins/purge';
import Voice from './plugins/voice';
import Music from './plugins/music';

// Export the config.
export default {
	GAME: 'Beating Up AR-D', // GAme to play.

	COMMANDER: 'Kuhne', // Commander role.

	COMMAND_PREFIX: '!', // Command prefix.

	PLUGINS: { // All enabled plugins.
		About,
		Interact,
		Say,
		Choose,
		Picture,
		Purge,
		Voice,
		Music
	}
}
