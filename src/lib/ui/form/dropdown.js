import React from 'react';
import classNames from 'classnames';

import styles from './css/dropdown.css';

export default class Dropdown extends React.Component {

	constructor(props) {
		super(props);

		// Set the initial state.
		this.state = {
			expanded: false
		}

		// Bind the listeners.
		this.onSelectedClick = this.onSelectedClick.bind(this);
		this.onWindowClick = this.onWindowClick.bind(this);
		this.onOptionClick = this.onOptionClick.bind(this);
	}

	/*
	 * Triggered when anywhere in the window is clicked.
	 */
	onWindowClick(evt) {
		// Set expanded to false.
		this.setState({
			expanded: false
		});

		// Remove the listener.
		window.removeEventListener('click', this.onWindowClick);
	}

	/*
	 * Triggered when the dropdown is clicked to be expanded.
	 */
	onSelectedClick(evt) {
		// Toggle the expanded state.
		const wasExpanded = this.state.expanded;
		this.setState({
			expanded: !this.state.expanded
		});

		// Set a listener to hide the list if expanded.
		if (!wasExpanded) window.addEventListener('click', this.onWindowClick);

		// Stop propagation.
		evt.stopPropagation();
	}

	/*
	 * Triggered when an option is clicked.
	 */
	onOptionClick(index, evt) {
		// Trigger onChange.
		if (this.props.onChange) this.props.onChange(index);
	}

	/*
	 * Render the options.
	 */
	renderOptions() {
		if (!this.props.values) return;

		// Get the selected index.
		const selected = this.props.selected || 0;

		return this.props.values.map((value, index) => {
			return (
				<div
					className={ styles.option }
					key={ index }
					onClick={ this.onOptionClick.bind(this, index) }>
					{ value }
				</div>
			);
		});
	}

	render() {
		if (!this.props.values) return;

		// Get the selected index and value.
		const selected = this.props.selected || 0;
		const selectedVal = this.props.values[selected] || <span></span>;

		const classes = classNames(
			styles.dropdown,
			{
				[styles.expanded]: this.state.expanded
			},
			this.props.className
		);

		return (
			<div className={ classes }>
				<div className={ styles.dropdownContent }>
					<div className={ styles.triangle }></div>
					<div
						className={ styles.selected }
						onClick={ this.onSelectedClick }>
						{ selectedVal }
					</div>
					<div className={ styles.options }>
						{ this.renderOptions() }
					</div>
				</div>
			</div>
		);
	}

}
