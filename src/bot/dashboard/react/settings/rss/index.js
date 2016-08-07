import React from 'react';
import classNames from 'classnames';

import Panel from 'ui/panel';

import Label from 'ui/form/label';
import Space from 'ui/form/space';
import Input from 'ui/form/input';
import Text from 'ui/form/text';
import Dropdown from 'ui/form/dropdown';
import DeleteButton from 'ui/form/deletebutton';

import ScrollPane from 'ui/scrollpane';
import ListSelect from 'ui/listselect';

import styles from './css/index.css';

export default class RSSSettings extends React.Component {

	constructor(props) {
		super(props);

		// Bind the listeners.
		this.onDelete = this.onDelete.bind(this);
		this.onSelectChange = this.onSelectChange.bind(this);
		this.onChangeFeed = this.onChangeFeed.bind(this);
		this.onChangeChannel = this.onChangeChannel.bind(this);
		this.onChangeRefresh = this.onChangeRefresh.bind(this);
	}

	/*
	 * Called when a definition is deleted.
	 */
	onDelete() {
		const data = this.props.data.rss;
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
	 * Triggered on a feed change.
	 */
	onChangeFeed(evt) {
		const url = evt.target.value;

		// Change the feed URL.
		const data = this.props.data.rss;
		const state = this.props.state;
		data._[state.selected].feed = url;
		this.props.data._update();
	}

	/*
	 * Triggered on a channel change.
	 */
	onChangeChannel(index) {
		// Get the new channel.
		const channel = this.props.data._bot.textChannels[index];

		// Set the new channel.
		const data = this.props.data.rss;
		const state = this.props.state;
		data._[state.selected].channel = channel.id;
		this.props.data._update();
	}

	/*
	 * Triggered on a refresh change.
	 */
	onChangeRefresh(evt) {
		let refresh = evt.target.value;

		// Reject if not a number.
		if (isNaN(refresh)) return;

		// Parse as an integer.
		if (refresh.length == 0) refresh = 0;
		refresh = parseInt(refresh);

		// Change the feed URL.
		const data = this.props.data.rss;
		const state = this.props.state;
		data._[state.selected].refresh = refresh;
		this.props.data._update();
	}

	/*
	 * Render the details.
	 */
	renderDetails() {
		const data = this.props.data.rss;
		const state = this.props.state;

		// Don't render the details if there aren't any details.
		if (data._.length == 0) return;

		const entry = data._[state.selected];

		// Get the index of the channel and the list of channel names.
		let channels;
		const channelIndex = (() => {
			channels = this.props.data._bot.textChannels;
			let index = 0;
			for (const channel of channels) {
				if (channel.id === entry.channel) {
					return index;
				}
				index ++;
			}
		})();
		channels = channels.map(channel => channel.name);

		return (
			<div className={ styles.details } key={ entry.id }>
				<ScrollPane>
					<div className={ styles.detailsContent }>
						<Label>Feed URL</Label>
						<Space height='0.5' />
						<Input
							style={{ width: '25rem' }}
							value={ entry.feed }
							onChange={ this.onChangeFeed }/>
						<Space height='2' />
						<Label>Channel</Label>
						<Space height='1' />
						<Dropdown
							values={ channels }
							selected={ channelIndex }
							onChange={ this.onChangeChannel }/>
						<Space height='2' />
						<Label>Refresh Rate</Label>
						<Space height='0.5' />
						<Input
							style={{ width: '3rem' }}
							centered
							value={ entry.refresh }
							onChange={ this.onChangeRefresh }/>
						<Text
							style={{
								fontSize: '0.9rem',
								marginLeft: '0.5rem'
							}}>
							minutes
						</Text>
						<Space height='2' />
						<Label>Status</Label>
						<Space height='0.5' />
						<Text
							style={{
								color: (entry.running ? '#27ae60': '#c0392b')
							}}>
							{ !entry.running && 'Not ' }
							Active
						</Text>
						<Space height='2' />
						<DeleteButton
							light
							label='Delete Feed'
							onDelete={ this.onDelete }/>
					</div>
				</ScrollPane>
			</div>
		);
	}

	render() {
		const data = this.props.data.rss;
		const state = this.props.state;

		return (
			<div>
				<Label>RSS Feeds</Label>
				<Space height='1' />
				<div className={ styles.feeds }>
					<ScrollPane>
						<ListSelect
							light
							values={ data._.map(entry => entry.feed) }
							selected={ state.selected }
							onChange={ this.onSelectChange }/>
					</ScrollPane>
				</div>
				{ this.renderDetails() }
			</div>
		);
	}

}
