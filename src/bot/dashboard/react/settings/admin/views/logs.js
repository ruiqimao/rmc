import React from 'react';
import classNames from 'classnames';

import Label from 'ui/form/label';
import Checkbox from 'ui/form/checkbox';
import Space from 'ui/form/space';

import styles from './css/logs.css';

export default class Logs extends React.Component {

	constructor(props) {
		super(props);
	}

	/*
	 * Update a filter.
	 */
	updateFilter(filter, evt) {
		const state = this.props.state.logs;

		// Update the state.
		state.filter[filter] = evt.target.checked;
		this.props.state._update();
	}


	/*
	 * Render the content.
	 */
	renderContent() {
		const data = this.props.data.logs;
		const state = this.props.state.logs;

		// Define a function to turn log objects into DOM object.
		const lotd = obj => {
			const classes = classNames(
				{
					[styles.logObj]: obj.name,
					[styles.logMsg]: obj.content
				}
			);

			return (
				<span
					title={ obj.id }
					className={ classes }
					key={ obj.id }>
					{ obj.name || obj.content }
				</span>
			);
		};

		// Apply the filter.
		const filtered = data.filter(log => {
			if (state.filter.message && log.type.startsWith('message')) return true;
			if (state.filter.user && log.type.startsWith('user')) return true;
			return false;
		});

		return filtered.map(log => {
			const d = log.data;

			// Get the date.
			const date = new Date(log.timestamp);
			const dateString = date.toUTCString().substring(5);

			// Generate the log entry in text.
			let entry = ['[' + dateString + '] '];
			switch (log.type) {
				case 'message': {
					entry.push(lotd(d.user));
					entry.push(' in #');
					entry.push(lotd(d.channel));
					entry.push(': ');
					entry.push(lotd(d.message));
				} break;
				case 'message deleted': {
					entry.push(lotd(d.user));
					entry.push(' deleted in #');
					entry.push(lotd(d.channel));
					entry.push(': ');
					entry.push(lotd(d.message));
				} break;
				case 'message updated': {
					entry.push(lotd(d.user));
					entry.push(' updated in #');
					entry.push(lotd(d.channel));
					entry.push(': ');
					entry.push(lotd(d.updated));
				} break;
				case 'user new': {
					entry.push(lotd(d.user));
					entry.push(' joined');
				} break;
				case 'user removed': {
					entry.push(lotd(d.user));
					entry.push(' left');
				} break;
				case 'user banned': {
					entry.push(lotd(d.user));
					entry.push(' banned');
				} break;
				case 'user unbanned': {
					entry.push(lotd(d.user));
					entry.push(' unbanned');
				} break;
			}

			return (
				<div
					className={ styles.entry }
					key={ log.timestamp }>
					{ entry }
				</div>
			);
		});
	}

	render() {
		const data = this.props.data.logs;
		const state = this.props.state.logs;

		return (
			<div>
				<Label>Filter</Label>
				<div className={ styles.filters }>
					<div className={ styles.filter }>
						<Checkbox
							checked={ state.filter.message }
							label='Messages'
							onChange={ this.updateFilter.bind(this, 'message') }/>
					</div>
					<div className={ styles.filter }>
						<Checkbox
							checked={ state.filter.user }
							label='User Events'
							onChange={ this.updateFilter.bind(this, 'user') }/>
					</div>
				</div>
				<Space height='1'/>
				<Label>Logs (Past 6 Hours)</Label>
				<Space height='1'/>
				<div className={ styles.entries }>
					{ this.renderContent() }
				</div>
			</div>
		);
	}

}
