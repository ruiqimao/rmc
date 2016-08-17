import React from 'react';
import classNames from 'classnames';

import Label from 'ui/form/label';
import Checkbox from 'ui/form/checkbox';
import Space from 'ui/form/space';

import styles from './css/kicks.css';

export default class Kicks extends React.Component {

	constructor(props) {
		super(props);
	}

	/*
	 * Render the content.
	 */
	renderContent() {
		const data = this.props.data.kick;
		const state = this.props.state.kick;

		return data.map((kick, index) => {
			// Get the date.
			const date = new Date(kick.timestamp);
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
						{ kick.name } ({ kick.user })
					</span>
					<Space height='0.2'/>
					<span className={ styles.label }>
						Kicker
					</span>
					<span className={ styles.text }>
						{ kick.kickerName } ({ kick.kicker })
					</span>
					<Space height='0.2'/>
					<span className={ styles.label }>
						Reason
					</span>
					<span className={ styles.text }>
						{ kick.reason }
					</span>
					<hr className={ styles.line }/>
				</div>
			);
		});
	}

	render() {
		const data = this.props.data.kick;
		const state = this.props.state.kick;

		return (
			<div>
				<Label>Kicks (Last 100)</Label>
				<Space height='1'/>
				<div className={ styles.entries }>
					{ this.renderContent() }
				</div>
			</div>
		);
	}

}
