import { Plugin } from 'plugin';

import Join from './commands/join';
import Leave from './commands/leave';

export default class extends Plugin {

	*init() {
		this.addCommand('join', Join);
		this.addCommand('leave', Leave);
	}

}
