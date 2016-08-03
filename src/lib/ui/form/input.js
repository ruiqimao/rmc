import React from 'react';
import classNames from 'classnames';

import styles from './css/input.css';

export default class Input extends React.Component {

	render() {
		const classes = classNames(
			styles.input,
			{ [styles.centered]: this.props.centered },
			this.props.className
		);

		return (
			<input
				className={ classes }
				value={ this.props.value }
				style={ this.props.style }
				onChange={ this.props.onChange } />
		);
	}

}
