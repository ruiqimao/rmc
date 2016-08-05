import React from 'react';
import classNames from 'classnames';

import styles from './css/text.css';

export default class Text extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const classes = classNames(
			styles.text,
			{
				[styles.bold]: this.props.bold,
				[styles.italic]: this.props.italic,
				[styles.centered]: this.props.centered,
				[styles.selectable]: this.props.selectable
			},
			this.props.className
		);

		return (
			<span
				className={ classes }
				style={ this.props.style } >
				{ this.props.children }
			</span>
		);
	}

}
