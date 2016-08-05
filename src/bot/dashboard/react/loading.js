import React from 'react';
import classNames from 'classnames';

import styles from './css/loading.css';

export default class Loading extends React.Component {

	render() {
		const classes = classNames(
			styles.loading,
			{ [styles.visible]: this.props.visible }
		);

		// Show the loading screen.
		return (
			<div className={ classes }>
				<div className={ styles.loadingCenter }>
					<h1>Loading...</h1>
					<h2>Please Wait</h2>
				</div>
			</div>
		);
	}

}

