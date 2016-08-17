import React from 'react';
import classNames from 'classnames';

import Label from 'ui/form/label';
import Checkbox from 'ui/form/checkbox';
import Space from 'ui/form/space';

import styles from './css/bans.css';

export default class Bans extends React.Component {

	constructor(props) {
		super(props);
	}

	/*
	 * Render the content.
	 */
	renderContent() {
		const data = this.props.data.ban;
		const state = this.props.state.ban;

		return data.map((ban, index) => {
			// Get the date.
			const date = new Date(ban.timestamp);
			const dateString = date.toUTCString().substring(5);

			return (
				<div
					className={ styles.entry }
					key={ index }>
					<span className={ styles.label }>
						Date
					</span>
					<span className={ styles.text }>
						{ dateString }
					</span>
					<Space height='0.2'/>
					<span className={ styles.label }>
						User
					</span>
					<span className={ styles.text }>
						{ ban.name } ({ ban.user })
					</span>
					<Space height='0.2'/>
					<span className={ styles.label }>
						Banner
					</span>
					<span className={ styles.text }>
						{ ban.bannerName } ({ ban.banner })
					</span>
					<Space height='0.2'/>
					<span className={ styles.label }>
						Reason
					</span>
					<span className={ styles.text }>
						{ ban.reason }
					</span>
					<hr className={ styles.line }/>
				</div>
			);
		});
	}

	render() {
		const data = this.props.data.ban;
		const state = this.props.state.ban;

		return (
			<div>
				<Label>Bans (Last 100)</Label>
				<Space height='1'/>
				<div className={ styles.entries }>
					{ this.renderContent() }
				</div>
			</div>
		);
	}

}
