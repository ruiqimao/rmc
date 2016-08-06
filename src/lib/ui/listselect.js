import React from 'react';
import classNames from 'classnames';

import styles from './css/listselect.css';

export default class ListSelect extends React.Component {

	onChange(index) {
		// Call the actual onChange listener.
		if (this.props.onChange) this.props.onChange(index);
	}

	render() {
		const selected = this.props.selected;

		const classes = classNames(
			styles.listselect,
			{
				[styles.dark]: this.props.dark,
				[styles.light]: this.props.light
			},
			this.props.className
		);

		return (
			<div
				className={ classes }
				style={ this.props.style }>
				{ this.props.values.map((value, index) => {
					const classes = classNames(
						styles.entry,
						{ [styles.selected]: index == selected }
					);

					return (
						<div
							className={ classes }
							key={ index }
							onClick={ this.onChange.bind(this, index) }>
							{ value }
						</div>
					);
				}) }
			</div>
		);
	}

}
