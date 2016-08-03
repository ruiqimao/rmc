import React from 'react';
import classNames from 'classnames';

import Panel from 'ui/panel';

import Label from 'ui/form/label';
import Input from 'ui/form/input';
import Space from 'ui/form/space';
import Checkbox from 'ui/form/checkbox';
import Col from 'ui/col';

import styles from './css/index.css';

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

	/*
	 * Update whether a command is enabled.
	 */
	updateCommand(evt, command) {
		// Update whether the command is enabled.
		this.props.data._bot.commands[command] = evt.target.checked;
		this.props.data._update();
	}

	render() {
		const data = this.props.data._bot;

		// Generate 2 columns of command checkboxes.
		let commandsCol1 = [], commandsCol2 = [];
		Object.keys(data.commands).map((command, index) => {
			const enabled = data.commands[command];
			const checkbox = (
				<Checkbox
					key={ command }
					label={ command }
					checked={ enabled }
					onChange={ (evt) => this.updateCommand(evt, command) } />
			);
			if (index < Object.keys(data.commands).length / 2) {
				commandsCol1.push(checkbox);
			} else {
				commandsCol2.push(checkbox);
			}
		})

		return (
			<Panel title='Bot Settings'>
				<Label>Command Prefix</Label>
				<Space height='0.5' />
				<Input
					centered
					value={ data.prefix }
					style={{
						width: '2rem'
					}}
					onChange={ this.updatePrefix } />
				<Space height='2' />
				<Label>Enabled Commands</Label>
				<div className={ styles.commandCols }>
					<Col w='6' className={ styles.commandCol }>{ commandsCol1 }</Col>
					<Col w='6' className={ styles.commandCol }>{ commandsCol2 }</Col>
				</div>
			</Panel>
		);
	}

}
