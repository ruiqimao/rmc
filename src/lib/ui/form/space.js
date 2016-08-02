import React from 'react';
import classNames from 'classnames';

import styles from './css/space.css';

export default class Space extends React.Component {

	render() {
		const classes = classNames(
			this.props.className,
			styles.space
		);

		return (
			<div className={ classes }></div>
		);
	}

}
