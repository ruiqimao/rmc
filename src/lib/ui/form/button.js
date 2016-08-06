import React from 'react';
import classNames from 'classnames';

import styles from './css/button.css';

export default class Button extends React.Component {

	render() {
		const classes = classNames(
			styles.button,
			{
				[styles.block]: this.props.block,
				[styles.hollow]: this.props.hollow,
				[styles.light]: this.props.light,
				[styles.dark]: this.props.dark
			},
			this.props.className
		);

		return (
			<button
				className={ classes }
				style={ this.props.style }
				disabled={ this.props.disabled }
				onClick={ this.props.onClick }>
				{ this.props.children }
			</button>
		);
	}

}
