import React from 'react';
import classNames from 'classnames';

import Trashcan from 'react-icons/lib/fa/trash-o';

import styles from './css/deletebutton.css';

export default class DeleteButton extends React.Component {

	constructor(props) {
		super(props);

		// Set the state.
		this.state = {
			expanded: false
		};

		// Bind the event listeners.
		this.onClick = this.onClick.bind(this);
	}

	onClick(evt) {
		if (!this.state.expanded) {
			// Expand if needed.
			// Expand the label.
			const target = evt.target;
			const label = target.children[1];
			label.style.width = 'auto';
			const width = label.getBoundingClientRect().width;
			label.style.width = '0';
			label.style.width = width + 'px';
			label.style.padding = '0 1rem';

			// Set the state.
			return this.setState({
				expanded: true
			});
		} else {
			// Otherwise, delete.
			if (this.props.onDelete) this.props.onDelete();
		}
	}

	render() {
		const classes = classNames(
			styles.deletebutton,
			{
				[styles.dark]: this.props.dark,
				[styles.light]: this.props.light,
				[styles.expanded]: this.state.expanded
			},
			this.props.className
		);

		return (
			<button
				className={ classes }
				style={ this.props.style }
				onClick={ this.onClick }
				disabled={ this.props.disabled }>
				<div className={ styles.icon }>
					<Trashcan className={ styles.trashcan }/>
				</div>
				<div className={ styles.label }>
					{ this.props.label }
				</div>
			</button>
		);
	}

}
