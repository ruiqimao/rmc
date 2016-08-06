import React from 'react';
import classNames from 'classnames';

import Label from 'ui/form/label';
import Input from 'ui/form/input';
import Space from 'ui/form/space';
import Checkbox from 'ui/form/checkbox';
import Dropdown from 'ui/form/dropdown';
import Col from 'ui/col';

import styles from './css/index.css';

export default class BotSettings extends React.Component {

	constructor(props) {
		super(props);

		// Bind all listeners.
		this.updatePrefix = this.updatePrefix.bind(this);
		this.updateCommander = this.updateCommander.bind(this);
		this.updateCommand = this.updateCommand.bind(this);
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
	 * Update the commander role.
	 */
	updateCommander(index) {
		const data = this.props.data._bot;

		// If the index is 0, then there is no commander role.
		if (index == -1) {
			data.commander = '';
			this.props.data._update();
			return;
		}

		// Set the new commander role.
		data.commander = data.roles[index].id;
		this.props.data._update();
	}

	/*
	 * Update whether a command is enabled.
	 */
	updateCommand(command, evt) {
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
					onChange={ this.updateCommand.bind(this, command) }/>
			);
			if (index < Object.keys(data.commands).length / 2) {
				commandsCol1.push(checkbox);
			} else {
				commandsCol2.push(checkbox);
			}
		});

		// Generate the list of roles to display in the dropdown and the commander role index.
		let roles = [];
		let commander = 0;
		data.roles.map((role, index) => {
			let entry;
			if (index == 0) {
				// Blank first role, since @everyone is not valid.
				entry = <span></span>;
			} else {
				entry = (
					<span
						key={ role.id }
						style={{
							color: role.color
						}}>
						{ role.name }
					</span>
				);
			}
			roles.push(entry);

			// Check if this role is the commander.
			if (role.id === data.commander) {
				commander = index;
			}
		});

		return (
			<div>
				<Label>Command Prefix</Label>
				<Space height='0.5' />
				<Input
					centered
					value={ data.prefix }
					style={{
						width: '3rem'
					}}
					onChange={ this.updatePrefix }/>
				<Space height='2' />
				<Label>Commander Role</Label>
				<Space height='1' />
				<Dropdown
					values={ roles }
					selected={ commander }
					onChange={ this.updateCommander }/>
				<Space height='2' />
				<Label>Enabled Commands</Label>
				<Space height='1' />
				<div className={ styles.commandCols }>
					<Col w='6' className={ styles.commandCol }>{ commandsCol1 }</Col>
					<Col w='6' className={ styles.commandCol }>{ commandsCol2 }</Col>
				</div>
			</div>
		);
	}

}
