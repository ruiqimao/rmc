// Set the production flag.
global.IS_PRODUCTION = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production');

// Add the lib folder as a path for imports.
require('app-module-path').addPath(__dirname + '/src/lib');

// Start!
require('./src').main();
