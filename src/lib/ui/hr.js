import React from 'react';
import classNames from 'classnames';

import styles from './css/hr.css';

export default class Hr extends React.Component {

	render() {
		const classes = classNames(
			styles.hr,
			this.props.className
		);

		return (
			<hr className={ classes } />
		);
	}

}
