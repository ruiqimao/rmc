import { Plugin } from 'plugin';

import Pet from './commands/pet';
import Slap from './commands/slap';

export default class extends Plugin {

	*init() {
		this.addCommand('pet', Pet);
		this.addCommand('slap', Slap);
	}

}
