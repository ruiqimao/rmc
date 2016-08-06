
export default {
	GAME: IS_PRODUCTION ? 'Beating Up AR-D' : 'Running from RM-C', // Game to play.

	COMMAND_PREFIX: '+', // Command prefix.

	SERVER_PORT: IS_PRODUCTION ? 5003 : 5004, // Server port.

	SERVER_URL: IS_PRODUCTION ? 'http://rmc.sized.io' : 'http://ard.sized.io', // Server URL.

	PLUGINS: [ // All enabled plugins.
		'meta',
		'about',
		'interact',
		'fun',
		'admin',
		'voice',
		'music',
		'dictionary',
		'stats'
	]
}
