import { Plugin } from 'plugin';

import Choose from './commands/choose';
import Picture from './commands/picture';
import Say from './commands/say';

export default class extends Plugin {

	*init() {
		this.addCommand('choose', Choose);
		this.addCommand('picture', Picture);
		this.addCommand('say', Say);
	}

}
