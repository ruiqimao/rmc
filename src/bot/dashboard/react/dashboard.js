import React from 'react';
import classNames from 'classnames';

import co from 'co';
import requestPromise from 'request-promise';

import BotSettings from './settings/_bot';
import AboutSettings from './settings/about';
import DictionarySettings from './settings/dictionary';
import InteractSettings from './settings/interact';
import StatsSettings from './settings/stats';

import Loading from './loading';
import Header from './header';
import Sidebar from './sidebar';

import ScrollPane from 'ui/scrollpane';

import styles from './css/dashboard.css';

export default class Dashboard extends React.Component {

	constructor(props) {
		super(props);

		// Set the available settings UIs.
		this.availableUIs = [
			{
				id: '_bot',
				name: 'Bot Settings',
				ui: BotSettings
			},
			{
				id: 'about',
				name: 'About',
				ui: AboutSettings
			},
			{
				id: 'dictionary',
				name: 'Dictionary',
				ui: DictionarySettings,
				state: {
					selected: 0
				}
			},
			{
				id: 'interact',
				name: 'Interact',
				ui: InteractSettings
			},
			{
				id: 'stats',
				name: 'Stats',
				ui: StatsSettings,
				state: {
					selected: 0
				}
			}
		];

		// Set an update function for all UIs that have a state.
		for (const ui of this.availableUIs) {
			if (ui.state !== undefined) {
				ui.state._update = () => {
					this.setState({
						uis: this.state.uis
					});
				};
			}
		}

		// Define the state.
		this.state = {
			loaded: false,
			saving: false,
			saved: false,
			dirty: false,
			currentUI: 0,
			uis: [ ],
			data: { }
		};

		// Bind the listeners.
		this.save = this.save.bind(this);
		this.changeUI = this.changeUI.bind(this);
		this.onBeforeUnload = this.onBeforeUnload.bind(this);
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
				dirty: true,
				data: this.state.data
			});
		};

		// Get the set of UIs to show.
		const uis = [ ];
		for (const ui of this.availableUIs) {
			if (data[ui.id] !== undefined) {
				uis.push(ui);
			}
		}

		// Update the state.
		this.setState({
			loaded: true,
			dirty: false,
			uis: uis,
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

			this.setState({
				saved: true,
				saving: false
			});

			// Remove the saved message after 3 seconds.
			setTimeout(() => {
				this.setState({
					saved: false
				});
			}, 3000);
		}.bind(this)).catch(() => {
			this.setState({
				saving: false
			});
		});
	}

	/*
	 * Change the current UI.
	 */
	changeUI(ui) {
		// Change the UI.
		this.setState({
			currentUI: ui
		});
	}

	/*
	 * Called before the page is unloaded.
	 */
	onBeforeUnload(evt) {
		// Check if the data is dirty.
		if (this.state.dirty) {
			// Confirm that the user wants to leave.
			return 'You have unsaved data. Are you sure you want to leave?';
		}
	}

	componentDidMount() {
		// Load the data.
		co(this.loadData.bind(this));

		// Listen for a page close.
		window.onbeforeunload = this.onBeforeUnload;
	}

	render() {
		const data = this.state.data;
		const currentUI = this.state.currentUI;

		return (
			<div>
				<Loading visible={ !this.state.loaded }/>
				{(() => {
					if (this.state.loaded) {
						// Get the UI to show.
						const UI = this.state.uis[currentUI].ui;
						const UIstate = this.state.uis[currentUI].state;

						return (
							<div className={ styles.dashboard }>
								<Sidebar
									data={ data }
									selected={ currentUI }
									names={ this.state.uis.map(ui => ui.name) }
									onChange={ this.changeUI }/>
								<Header
									selected={ currentUI }
									uis={ this.state.uis }
									onSave={ this.save }
									saving={ this.state.saving }
									saved={ this.state.saved }/>
								<div className={ styles.content }>
									<ScrollPane>
										<div className={ styles.ui }>
											<UI data={ data } state={ UIstate }/>
										</div>
									</ScrollPane>
								</div>
							</div>
						);
					}
				})()}
			</div>
		);
	}

}

