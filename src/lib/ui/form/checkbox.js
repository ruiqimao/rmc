import React from 'react';
import classNames from 'classnames';
import Checkmark from 'react-icons/lib/go/check';

import uniqueId from 'unique-id';

import styles from './css/checkbox.css';

export default class Checkbox extends React.Component {

	componentWillMount() {
		// Generate a unique id.
		this.setState({
			id: uniqueId()
		});
	}

	render() {
		const classes = classNames(
			styles.checkbox,
			{
				[styles.checked]: this.props.checked,
				[styles.disabled]: this.props.disabled
			},
			this.props.className
		);

		return (
			<span className={ classes }>
				<input
					id={ this.state.id }
					checked={ this.props.checked }
					disabled={ this.props.disabled }
					type='checkbox'
					onChange={ this.props.onChange } />
				<label htmlFor={ this.state.id }  className={ styles.boxOuter }>
					<Checkmark className={ styles.boxInner } />
				</label>
				{ this.props.label && <label htmlFor={ this.state.id } className={ styles.label }>{ this.props.label }</label> }
			</span>
		);
	}

}
