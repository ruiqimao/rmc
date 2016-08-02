import React from 'react';
import classNames from 'classnames';

import Panel from 'ui/panel';
import Hr from 'ui/hr';

import Input from 'ui/form/input';

export default class BotSettings extends React.Component {

	constructor(props) {
		super(props);

		// Bind all listeners.
		this.updatePrefix = this.updatePrefix.bind(this);
	}

	/*
	 * Update the command prefix.
	 */
	updatePrefix(evt) {
		// Get the prefix.
		const prefix = evt.target.value.trim();

		// Reject prefixes under 1 or over 3 characters.
		if (prefix.length < 1 || prefix.length > 3) return;

		// Set the prefix in the state.
		this.props.data._bot.prefix = prefix;
		this.props.data._update();
	}

	render() {
		return (
			<Panel title='Bot Settings'>
				<Input
					centered
					label='Command Prefix'
					value={ this.props.data._bot.prefix }
					style={{
						width: '2rem'
					}}
					onChange={ this.updatePrefix } />
			</Panel>
		);
	}

}
