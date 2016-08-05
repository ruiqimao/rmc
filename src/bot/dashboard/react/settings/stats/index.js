import React from 'react';
import classNames from 'classnames';

import Label from 'ui/form/label';
import Input from 'ui/form/input';
import Text from 'ui/form/text';
import Space from 'ui/form/space';

import ScrollPane from 'ui/scrollpane';
import ListSelect from 'ui/listselect';

import styles from './css/index.css';

export default class StatsSettings extends React.Component {

	constructor(props) {
		super(props);

		// Bind all listeners.
		this.onSelectChange = this.onSelectChange.bind(this);
	}

	onSelectChange(index) {
		// Update the selected phrase.
		const state = this.props.state;
		state.selected = index;
		state._update();
	}

	/*
	 * Render the user details.
	 */
	renderDetails() {
		const data = this.props.data.stats;
		const state = this.props.state;

		const entry = data._[state.selected];

		return (
			<div className={ styles.details } key={ entry.id } >
				<ScrollPane>
					<div className={ styles.detailsContent } >
						<h1 className={ styles.detailsUsername } >
							{ entry.nick || entry.username }
							{ entry.bot && (
								<div className={ styles.detailsBot }>Bot</div>
							) }
						</h1>
						<Label>User ID</Label>
						<Space height='0.5' />
						<Text selectable>{ entry.id }</Text>
						<Space height='2' />
						<Label>Username</Label>
						<Space height='0.5' />
						<Text selectable>{ entry.username }</Text>
						<Space height='2' />
						{ entry.nick && (
							<div>
								<Label>Nickname</Label>
								<Space height='0.5' />
								<Text selectable>{ entry.nick }</Text>
								<Space height='2' />
							</div>
						) }
						{ entry.avatar && (
							<div>
								<Label>Avatar</Label>
								<Space height='0.5' />
								<img src={ entry.avatar } style={{ height: '8rem', borderRadius: '0.2rem' }} />
								<Space height='2' />
							</div>
						) }
						<Label>Messages</Label>
						<Space height='0.5' />
						<Text selectable>{ entry.messages }</Text>
					</div>
				</ScrollPane>
			</div>
		);
	}

	render() {
		const data = this.props.data.stats;
		const state = this.props.state;

		return (
			<div>
				<Label>Active Users</Label>
				<div className={ styles.users }>
					<ScrollPane>
						<ListSelect
							light
							values={ data._.map(entry => (entry.nick || entry.username)) }
							selected={ state.selected }
							onChange={ this.onSelectChange } />
					</ScrollPane>
				</div>
				{ this.renderDetails() }
			</div>
		);
	}

}
