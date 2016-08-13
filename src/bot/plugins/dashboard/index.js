const Plugin = require('plugin').Plugin;

const co = require('co');
const Express = require('express');

class Dashboard extends Plugin {

	*init() {
		this.addCommand('dashboard', require('./commands/dashboard'));

		// Generate classes.
		this.Dash = this.createModel('dashboard');

		// Create a router for the dashboard.
		this.router = Express.Router();

		// Add the dashboard path.
		this.router.get('/' + this.bot.worker.id + '/dashboard/:id', this.loadData.bind(this));
		this.router.post('/' + this.bot.worker.id + '/dashboard/:id', this.saveData.bind(this));
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
				return;
			}
			const id = dashboards[0].get('server');

			// Make sure the server exists.
			if (this.client.servers.get('id', id) == null) {
				// If this is not the last worker, try redirecting.
				if (this.bot.worker.id !== this.bot.numWorkers) {
					res.redirect(this.config.SERVER_URL + '/' + (this.bot.worker.id + 1) + '/dashboard/' + req.params.id);
					return;
				}

				res.status(404).end();
				return;
			}

			// Compile the data.
			const data = {};

			// Get data from the bot.
			data._bot = yield this.bot.getData(id);

			// Get data from all plugins.
			for (const plugin of this.bot.plugins) {
				data[plugin.name] = yield plugin.plugin._getData(id);
			}

			// Respond with the data.
			res.json(data);
		}.bind(this)).catch((err) => {
			console.error(err);
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

			// Make sure the server exists.
			if (this.client.servers.get('id', id) == null) {
				res.status(404).end();
				return;
			}

			// Get the data.
			const data = req.body;

			// Save the bot data.
			yield this.bot.saveData(id, data._bot);

			// Save data to all plugins.
			for (const plugin of this.bot.plugins) {
				if (data[plugin.name]) yield plugin.plugin._saveData(id, data[plugin.name]);
			}

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

module.exports = Dashboard;
