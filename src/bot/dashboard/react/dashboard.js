import React from 'react';
import classNames from 'classnames';

import co from 'co';
import requestPromise from 'request-promise';

import BotSettings from './bot';

import Button from 'ui/form/button';

import styles from './css/dashboard.css';

export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);

		// Define the state.
		this.state = {
			loaded: false,
			saving: false,
			data: { }
		};

		// Bind the listeners.
		this.save = this.save.bind(this);
	}

	/*
	 * Load data from the server.
	 */
	*loadData() {
		// Get the data.
		const data = JSON.parse(yield requestPromise.get(window.location.origin + '/dashboard/data/' + RMC_TOKEN));

		// Set the update function.
		data._update = () => {
			this.setState({
				data: this.state.data
			});
		};

		// Update the state.
		this.setState({
			loaded: true,
			data: data
		});
	}

	/*
	 * Save data to the server.
	 */
	*saveData() {
		const data = this.state.data;

		// Send the data to the server.
		const options = {
			method: 'POST',
			uri: window.location.origin + '/dashboard/data/' + RMC_TOKEN,
			body: data,
			json: true
		};
		yield requestPromise(options);
	}

	/*
	 * Handler for save button click.
	 */
	save(evt) {
		co(function*() {
			this.setState({
				saving: true
			});

			// Save the data.
			yield this.saveData();

			// Reload the data.
			yield this.loadData();

			alert('Settings saved!');

			this.setState({
				saving: false
			});
		}.bind(this)).catch(() => {
			this.setState({
				saving: false
			});
		});
	}

	componentDidMount() {
		// Load the data.
		co(this.loadData.bind(this));
	}

	render() {
		return (
			<div>
				<Loading visible={ !this.state.loaded } />
				{(() => {
					if (this.state.loaded) {
						return (
							<div className={ styles.dashboard }>
								<Header data={ this.state.data } />
								<BotSettings data={ this.state.data } />
								<Button
									block
									className={ styles.saveButton }
									onClick={ this.save }
									disabled={ this.state.saving }>
									Save
								</Button>
							</div>
						);
					}
				})()}
			</div>
		);
	}

}

class Loading extends React.Component {

	render() {
		const classes = classNames(
			styles.loading,
			{ [styles.visible]: this.props.visible }
		);

		// Show the loading screen.
		return (
			<div className={ classes }>
				<div className={ styles.loadingCenter }>
					<h1>Loading...</h1>
					<h2>Please Wait</h2>
				</div>
			</div>
		);
	}

}

class Header extends React.Component {

	render() {
		return (
			<div className={ styles.header }>
				<div className={ styles.headerTitles }>
					<h2>RM-C Control Panel</h2>
					<h1>{ this.props.data._bot.name }</h1>
				</div>
			</div>
		);
	}

}
