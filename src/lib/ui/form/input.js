import React from 'react';
import classNames from 'classnames';

import styles from './css/input.css';

export default class Input extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const classes = classNames(
			styles.input,
			{
				[styles.centered]: this.props.centered
			},
			this.props.className
		);

		return (
			<input
				className={ classes }
				style={ this.props.style }
				value={ this.props.value }
				onChange={ this.props.onChange }/>
		);
	}

}
