import React from 'react';
import classNames from 'classnames';

import ScrollPane from 'ui/scrollpane';
import ListSelect from 'ui/listselect';

import LogsView from './views/logs';
import KicksView from './views/kicks';
import BansView from './views/bans';

import styles from './css/index.css';

export default class AdminSettings extends React.Component {

	constructor(props) {
		super(props);

		// Create a list of options.
		this.options = [
			{
				name: 'Logs',
				view: LogsView
			},
			{
				name: 'Kicks',
				view: KicksView
			},
			{
				name: 'Bans',
				view: BansView
			}
		];

		// Bind the listeners.
		this.onSelectChange = this.onSelectChange.bind(this);
	}

	/*
	 * Called on an option selection change.
	 */
	onSelectChange(index) {
		// Update the selected option.
		const state = this.props.state;
		state.selected = index;
		state._update();
	}

	/*
	 * Render the content.
	 */
	renderContent() {
		const data = this.props.data.admin;
		const state = this.props.state;

		const option = this.options[state.selected];
		if (option !== undefined) {
			const Content = option.view;
			return (
				<div className={ styles.content }>
					<ScrollPane>
						<div className={ styles.contentContent }>
							<Content
								data={ data }
								state={ state }/>
						</div>
					</ScrollPane>
				</div>
			);
		}
	}

	render() {
		const data = this.props.data.admin;
		const state = this.props.state;

		return (
			<div>
				<div className={ styles.options }>
					<ScrollPane>
						<ListSelect
							light
							values={ this.options.map(option => option.name) }
							selected={ state.selected }
							onChange={ this.onSelectChange }/>
					</ScrollPane>
				</div>
				{ this.renderContent() }
			</div>
		);
	}

}
