import React from 'react';
import classNames from 'classnames';

import styles from './css/input.css';

export default class Input extends React.Component {

	render() {
		const classes = classNames(
			this.props.className,
			styles.input,
			{ [styles.centered]: this.props.centered }
		);

		return (
			<span className={ classes }>
				{ (() => {
					if (this.props.label) return (
							<label>{ this.props.label }</label>
						);
				})() }
				<input value={ this.props.value } style={ this.props.style } onChange={ this.props.onChange } />
			</span>
		);
	}

}
