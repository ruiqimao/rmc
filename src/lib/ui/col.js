import React from 'react';
import classNames from 'classnames';

import styles from './css/col.css';

export default class Col extends React.Component {

	render() {
		const classes = classNames(
			styles.col,
			{
				[styles['col' + this.props.w]]: this.props.w
			},
			this.props.className
		);

		return (
			<div className={ classes }>
				{ this.props.children }
			</div>
		);
	}

}
