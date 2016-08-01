import { Plugin } from 'plugin';

import Define from './commands/define';
import ChangeDef from './commands/changedef';
import ClearDef from './commands/cleardef';

export default class extends Plugin {

	*init() {
		this.addCommand('define', Define);
		this.addCommand('changedef', ChangeDef);
		this.addCommand('cleardef', ClearDef);

		// Create a class for definitions.
		this.Definition = this.createModel('definition');
	}

}
