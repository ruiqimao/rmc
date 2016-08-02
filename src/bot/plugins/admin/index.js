import { Plugin } from 'plugin';

import Dashboard from './commands/dashboard';
import Purge from './commands/purge';

import co from 'co';
import Express from 'express';

export default class extends Plugin {

	*init() {
		this.addCommand('dashboard', Dashboard);
		this.addCommand('purge', Purge);

		// Generate classes.
		this.Dash = this.createModel('dashboard');

		// Create a router for the dashboard.
		this.router = Express.Router();

		// Add the dashboard path.
		this.router.get('/dashboard/data/:id', this.loadData.bind(this));
		this.router.post('/dashboard/data/:id', this.saveData.bind(this));
		this.router.get('/dashboard/:id', this.renderDashboard.bind(this));

		// Add the router to the web server.
		this.bot.express.use(this.router);
	}

	/*
	 * Load the bot data.
	 *
	 * @param req The Express request.
	 * @param res The Express response.
	 */
	loadData(req, res) {
		co(function*() {
			// Get the server.
			const dashboards = yield this.Dash.find({
				'value': req.params.id
			});
			if (dashboards.length == 0) {
				// If there is no valid id, 404.
				res.status(404).end();
			}
			const id = dashboards[0].get('server');

			// Compile the data.
			const data = {};

			// Get data from the bot.
			data._bot = yield this.bot.getData(id);

			// Respond with the data.
			res.json(data);
		}.bind(this)).catch(() => {
			res.status(500).end();
		});
	}

	/*
	 * Save the bot data.
	 *
	 * @param req The Express request.
	 * @param res The Express response.
	 */
	saveData(req, res) {
		co(function*() {
			// Get the server.
			const dashboards = yield this.Dash.find({
				'value': req.params.id
			});
			if (dashboards.length == 0) {
				// If there is no valid id, 404.
				res.status(404).end();
			}
			const id = dashboards[0].get('server');

			// Get the data.
			const data = req.body;

			// Save the bot data.
			yield this.bot.saveData(id, data._bot);

			res.end();
		}.bind(this));
	}

	/*
	 * Render the dashboard.
	 *
	 * @param req The Express request.
	 * @param res The Express response.
	 */
	renderDashboard(req, res) {
		co(function*() {
			// Get the server.
			const dashboards = yield this.Dash.find({
				'value': req.params.id
			});
			if (dashboards.length > 0) {
				// Render the dashboard.
				res.render(__dirname + '/../../dashboard/views/dashboard.html', { token: req.params.id });
			} else {
				// Dashboard doesn't exist.
				res.status(404).end();
			}
		}.bind(this));
	}

}
