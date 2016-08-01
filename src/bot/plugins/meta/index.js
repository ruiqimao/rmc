import { Plugin } from 'plugin';

import Help from './commands/help';

export default class extends Plugin {

	*init() {
		this.addCommand('help', Help);
	}

}
