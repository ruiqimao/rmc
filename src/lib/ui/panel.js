import React from 'react';
import classNames from 'classnames';

import styles from './css/panel.css';

export default class Panel extends React.Component {

	render() {
		const classes = classNames(
			this.props.className,
			styles.panel
		);

		return (
			<div className={ classes }>
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
