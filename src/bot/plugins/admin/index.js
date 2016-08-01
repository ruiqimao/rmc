import { Plugin } from 'plugin';

import Dashboard from './commands/dashboard';
import Purge from './commands/purge';

import Express from 'express';

export default class extends Plugin {

	*init() {
		this.addCommand('dashboard', Dashboard);
		this.addCommand('purge', Purge);

		// Generate classes.
		this.Dash = this.createModel('dashboard');
	}

}
