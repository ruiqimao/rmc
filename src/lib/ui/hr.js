import React from 'react';
import classNames from 'classnames';

import styles from './css/hr.css';

export default class Hr extends React.Component {

	render() {
		const classes = classNames(
			this.props.className,
			styles.hr
		);

		return (
			<hr className={ classes } />
		);
	}

}
