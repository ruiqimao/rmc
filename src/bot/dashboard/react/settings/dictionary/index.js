import React from 'react';
import classNames from 'classnames';

import Panel from 'ui/panel';

import Label from 'ui/form/label';
import Space from 'ui/form/space';
import Textarea from 'ui/form/textarea';
import DeleteButton from 'ui/form/deletebutton';

import ScrollPane from 'ui/scrollpane';
import ListSelect from 'ui/listselect';

import styles from './css/index.css';

export default class DictionarySettings extends React.Component {

	constructor(props) {
		super(props);

		// Bind the listeners.
		this.onDefinitionChange = this.onDefinitionChange.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onSelectChange = this.onSelectChange.bind(this);
	}

	/*
	 * Called on a definition change.
	 */
	onDefinitionChange(evt) {
		const value = evt.target.value;

		// Change the definition.
		const data = this.props.data.dictionary;
		const state = this.props.state;
		data._[state.selected].definition = value;
		this.props.data._update();
	}

	/*
	 * Called when a definition is deleted.
	 */
	onDelete() {
		const data = this.props.data.dictionary;
		const state = this.props.state;
		const selected = state.selected;

		// Change the selected element.
		state.selected = Math.max(state.selected - 1, 0);
		state._update();

		// Remove the definition.
		data._.splice(selected, 1);
		this.props.data._update();
	}

	/*
	 * Called on a phrase selection change.
	 */
	onSelectChange(index) {
		// Update the selected phrase.
		const state = this.props.state;
		state.selected = index;
		state._update();
	}

	/*
	 * Render the definition.
	 */
	renderDefinition() {
		const data = this.props.data.dictionary;
		const state = this.props.state;

		// Don't render the definition if there aren't any definitions.
		if (data._.length == 0) return;

		const entry = data._[state.selected];

		return (
			<div className={ styles.definition } key={ entry.phrase } >
				<ScrollPane>
					<div className={ styles.definitionContent } >
						<h1 className={ styles.definitionPhrase } >
							{ entry.phrase }
						</h1>
						<Label>Definition</Label>
						<Space height='1' />
						<Textarea
							elastic
							value={ entry.definition }
							style={{
								minHeight: '5rem'
							}}
							onChange={ this.onDefinitionChange } />
						<Space height='2' />
						<DeleteButton
							light
							label='Delete Definition'
							onDelete={ this.onDelete } />
					</div>
				</ScrollPane>
			</div>
		);
	}

	render() {
		const data = this.props.data.dictionary;
		const state = this.props.state;

		return (
			<div>
				<Label>Custom Definitions</Label>
				<Space height='1' />
				<div className={ styles.words }>
					<ScrollPane>
						<ListSelect
							light
							values={ data._.map(entry => entry.phrase) }
							selected={ state.selected }
							onChange={ this.onSelectChange } />
					</ScrollPane>
				</div>
				{ this.renderDefinition() }
			</div>
		);
	}

}
