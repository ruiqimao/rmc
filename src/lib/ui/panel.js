import React from 'react';
import classNames from 'classnames';

import styles from './css/panel.css';

export default class Panel extends React.Component {

	render() {
		const classes = classNames(
			styles.panel,
			this.props.className
		);

		return (
			<div
				className={ classes }
				style={ this.props.style } >
				{ (() => {
					if (this.props.title) return (
						<div className={ styles.panelTitle }>
							{ this.props.title }
						</div>
					);
				})() }
				<div className={ styles.panelContent }>
					{ this.props.children }
				</div>
			</div>
		);
	}

}
