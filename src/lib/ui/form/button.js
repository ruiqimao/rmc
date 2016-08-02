import React from 'react';
import classNames from 'classnames';

import styles from './css/button.css';

export default class Button extends React.Component {

	render() {
		const classes = classNames(
			this.props.className,
			styles.button,
			{ [styles.block]: this.props.block }
		);

		return (
			<span className={ classes }>
				<button
					disabled={ this.props.disabled }
					onClick={ this.props.onClick } >
					{ this.props.children }
				</button>
			</span>
		);
	}

}
