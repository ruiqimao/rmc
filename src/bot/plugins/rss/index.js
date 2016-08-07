import { Plugin } from 'plugin';

import Request from 'request';
import FeedParser from 'feedparser';

import RSS from './commands/rss';
import ClearRSS from './commands/clearrss';

import co from 'co';

export default class extends Plugin {

	*init() {
		// Add commands.
		this.addCommand('rss', RSS);
		this.addCommand('clearrss', ClearRSS);

		// Create models.
		this.Feed = this.createModel('rss-feed');

		// Create an object of feeds.
		this.feeds = {};

		// Start all feeds.
		(yield this.Feed.find()).map(feed => this.startFeed(feed));
	}

	*getData(id) {
		// Get all Feed entries from the server.
		const entries = yield this.Feed.find({
			'server': id
		});
		const feeds = entries.map(entry => {
			return {
				id: entry.get('_id'),
				feed: entry.get('feed'),
				channel: entry.get('channel'),
				refresh: entry.get('refresh'),
				running: entry.get('running')
			};
		});

		// Return the feeds.
		return feeds;
	}

	*saveData(id, data) {
		// Turn the data into an object.
		const feeds = {};
		for (const feed of data) {
			feeds[feed.id] = feed;
		}

		// Find all the Feeds.
		const entries = yield this.Feed.find({
			'server': id
		});

		// Update all the Feeds.
		for (const entry of entries) {
			const updated = feeds[entry.get('_id')];
			if (updated === undefined) {
				// Removed.
				this.stopFeed(entry);
				yield entry.remove();
			} else {
				// Set the properties.
				entry.set('feed', updated.feed);
				entry.set('channel', updated.channel);
				entry.set('refresh', Math.max(1, updated.refresh));
				yield entry.save();

				// Restart the feed.
				this.startFeed(entry);
			}
		}
	}

	/*
	 * Starts an RSS feed.
	 *
	 * @param The Feed object.
	 */
	startFeed(feed) {
		// Get the feed properties.
		const id = feed.get('_id');
		const refresh = feed.get('refresh');
		const channel = feed.get('channel');

		// Stop the feed if there is one already going.
		this.stopFeed(feed);

		// Create a refresh timer.
		const timer = setInterval(
			() => this.refreshFeed(feed)
				.then(this.sendRSSPosts.bind(this))
				.catch(() => {
					feed.set('running', false);
					feed.save();
				}),
			refresh * 60000);

		// Add to the list of feeds.
		this.feeds[id] = {
			timer: timer
		};

		// Refresh immediately.
		this.refreshFeed(feed).then(this.sendRSSPosts.bind(this)).catch(() => {
			// Set the feed to not running.
			feed.set('running', false);
			feed.save().then(() => {
				this.client.sendMessage(
					channel,
					'I couldn\'t get the RSS feed for `' + feed.get('feed') + '`. Sucks.');
			});
		});
	}

	/*
	 * Sends RSS feed data.
	 *
	 * @param data Data returned from refreshing the feed.
	 */
	sendRSSPosts(data) {
		const feed = data.feed;
		const posts = data.posts;
		const channel = feed.get('channel');

		co(function*() {
			// Set the feed to running.
			feed.set('running', true);
			yield feed.save();

			// Send all the posts.
			for (const post of posts) {
				const title = post.title;
				const date = post.date;
				const link = post.link;
				const author = post.author;
				const message =
					'**' + title + '** ' +
					'`' + date + '` ' +
					'*' + author + '*\n' +
					link;
				yield this.client.sendMessage(channel, message);
			}
		}.bind(this));
	}

	/*
	 * Refreshes a feed.
	 *
	 * @param feed The Feed to refresh.
	 *
	 * @return A Promise.
	 */
	refreshFeed(feed) {
		// Get the properties.
		const url = feed.get('feed');
		const lastGUID = feed.get('lastGUID');

		return new Promise((resolve, reject) => {
			// Create a request for the feed.
			const request = Request(url, { timeout: 10000, pool: false });
			request.setMaxListeners(50);
			request.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
			request.setHeader('accept', 'text/html,application/xhtml+xml');

			// Create a parser.
			const parser = new FeedParser();

			// Create a list of posts.
			let posts = [];
			let reached = false;
			let newLast = '';

			// Start piping.
			request
				.on('error', () => {
					reject();
				})
				.on('response', (res) => {
					if (res.statusCode !== 200) {
						reject();
						return;
					}
					res.pipe(parser);
				});
			parser
				.on('error', () => {
					reject();
				})
				.on('end', () => {
					co(function*() {
						feed.set('lastGUID', newLast);
						yield feed.save();

						// Return the reversed posts array.
						resolve({
							feed: feed,
							posts: posts.reverse()
						});
					}.bind(this));
				})
				.on('readable', () => {
					let post;
					while (post = parser.read()) {
						if (newLast === '') newLast = post.guid;
						if (post.guid == lastGUID) reached = true;
						if (!reached) posts.push(post);
					}
				});
		});
	}

	/*
	 * Stops an RSS feed.
	 *
	 * @param The Feed object.
	 */
	stopFeed(feed) {
		// Don't do anything if there is no such feed.
		if (!this.feeds[feed.get('_id')]) return;

		// Clear the timer.
		clearInterval(this.feeds[feed.get('_id')].timer);

		// Remove from the feed list.
		delete this.feeds[feed.get('_id')];
	}

}

