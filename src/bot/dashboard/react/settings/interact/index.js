import React from 'react';
import classNames from 'classnames';

import Label from 'ui/form/label';
import Input from 'ui/form/input';
import Textarea from 'ui/form/textarea';
import Button from 'ui/form/button';
import Space from 'ui/form/space';

import styles from './css/index.css';

export default class InteractSettings extends React.Component {

	constructor(props) {
		super(props);

		// Bind all listeners.
		this.onPetChange = this.onPetChange.bind(this);
		this.onPetResponsesChange = this.onPetResponsesChange.bind(this);
		this.onSlapResponsesChange = this.onSlapResponsesChange.bind(this);
	}

	/*
	 * Called when the pet number is changed.
	 */
	onPetChange(evt) {
		let value = evt.target.value;
		if (isNaN(value)) return;

		// Update the value.
		if (value.length == 0) value = 0;
		this.props.data.interact.pet.count = parseInt(value);
		this.props.data._update();
	}

	/*
	 * Called when the pet responses are changed.
	 */
	onPetResponsesChange(evt) {
		const value = evt.target.value;
		let responses = value.split("\n");

		// Remove all empty responses.
		responses = responses.filter(response => response.length > 0);

		// Add an empty response at the end if there is a newline.
		if (value.endsWith("\n")) responses.push('');

		// Set the responses.
		this.props.data.interact.pet.responses = responses;
		this.props.data._update();
	}

	/*
	 * Called when the slap responses are changed.
	 */
	onSlapResponsesChange(evt) {
		const value = evt.target.value;
		let responses = value.split("\n");

		// Remove all empty responses.
		responses = responses.filter(response => response.length > 0);

		// Add an empty response at the end if there is a newline.
		if (value.endsWith("\n")) responses.push('');

		// Set the responses.
		this.props.data.interact.slap = responses;
		this.props.data._update();
	}

	render() {
		const data = this.props.data.interact;

		return (
			<div>
				<Label>Number of Pets</Label>
				<Space height='0.5' />
				<Input
					centered
					style={{
						width: '5rem'
					}}
					value={ data.pet.count }
					onChange={ this.onPetChange }/>
				<Space height='2' />
				<Label>Pet Responses (One per Line)</Label>
				<Space height='1' />
				<Textarea
					elastic
					value={ data.pet.responses.join("\n") }
					onChange={ this.onPetResponsesChange }/>
				<Space height='2' />
				<Label>Slap Responses (One per Line)</Label>
				<Space height='1' />
				<Textarea
					elastic
					value={ data.slap.join("\n") }
					onChange={ this.onSlapResponsesChange }/>
			</div>
		);
	}

}
