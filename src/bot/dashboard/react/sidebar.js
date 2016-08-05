import React from 'react';
import classNames from 'classnames';

import ListSelect from 'ui/listselect';
import ScrollPane from 'ui/scrollpane';

import styles from './css/sidebar.css';

export default class Sidebar extends React.Component {

	constructor(props) {
		super(props);

		// Bind the listeners.
		this.onChange = this.onChange.bind(this);
	}

	/*
	 * Called when the user changes the selected entry.
	 */
	onChange(index) {
		this.props.onChange(index);
	}

	/*
	 * Render the list of UI choices in the sidebar.
	 */
	renderUIs() {
		const names = this.props.names;
		const selected = this.props.selected;

		return (
			<div className={ styles.uis }>
				<ScrollPane>
					<ListSelect
						dark
						values={ names }
						selected={ selected }
						onChange={ this.onChange } />
				</ScrollPane>
			</div>
		);
	}

	render() {
		const data = this.props.data;

		const classes = classNames(
			styles.sidebar
		);

		return (
			<div className={ classes }>
				<h1 className={ styles.serverName }>{ data._bot.name }</h1>
				{ this.renderUIs() }
			</div>
		);
	}

}

