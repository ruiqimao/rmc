import React from 'react';
import classNames from 'classnames';

import Label from 'ui/form/label';
import Textarea from 'ui/form/textarea';
import Space from 'ui/form/space';

import styles from './css/index.css';

export default class AboutSettings extends React.Component {

	constructor(props) {
		super(props);

		// Bind all listeners.
		this.updateText = this.updateText.bind(this);
	}

	/*
	 * Update the about text.
	 */
	updateText(evt) {
		// Get the text.
		const text = evt.target.value;

		// Set the text in the state.
		this.props.data.about.about = text;
		this.props.data._update();
	}

	render() {
		const data = this.props.data.about;

		return (
			<div>
				<Label>About Text</Label>
				<Space height='1' />
				<Textarea
					elastic
					style={{
						minHeight: '10rem'
					}}
					value={ data.about }
					onChange={ this.updateText } />
			</div>
		);
	}

}
