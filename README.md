# RM-C Discord Bot

## Setup

Put an `authorization.js` file in `src`, structured like so:
```javascript
export default {
	DISCORD_PRD_TOKEN: '<Production Discord Bot Token>',
	DISCORD_DEV_TOKEN: '<Development Discord Bot Token>',

	MONGO_PRD_URI: '<Production MongoDB URI>',
	MONGO_DEV_URI: '<Development MongoDB URI>',

	OWNERS: [
		'<Owner 1 ID>',
		...
	]
}
```

## Transpilation

When running in a production environment, you must transpile the code from ES6 to ES5 (for now) before running.

To do this, run `npm run build`.

## Running

Run `node entry.js` to start the bot.
