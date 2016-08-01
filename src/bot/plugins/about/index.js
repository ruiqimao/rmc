import { Plugin } from 'plugin';

import About from './commands/about';
import Source from './commands/source';
import Uptime from './commands/uptime';

export default class extends Plugin {

	*init() {
		this.addCommand('about', About);
		this.addCommand('source', Source);
		this.addCommand('uptime', Uptime);
	}

}

