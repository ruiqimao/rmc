# RM-C Discord Bot

## Setup

Put an `authorization.js` file in `src`, structured like so:
```javascript
export default {
	DISCORD_TOKEN: '<Discord Bot Token>',
	MONGO_URI: '<MongoDB URI>'
}
```

## Transpilation

When running in a production environment, you must transpile the code from ES6 to ES5 (for now) before running.

To do this, run `npm run build`.

## Running

Run `node entry.js` to start the bot.
