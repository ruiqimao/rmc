import React from 'react';
import classNames from 'classnames';

import styles from './css/label.css';

export default class Label extends React.Component {

	render() {
		const classes = classNames(
			styles.label,
			this.props.className
		);

		return (
			<label
				className={ classes }
				style={ this.props.style } >
				{ this.props.children }
			</label>
		);
	}

}
