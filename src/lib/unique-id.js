let id = 0;

/*
 * Generate a unique id.
 */
function uniqueId() {
	// Return the next unique id.
	return id ++;
}

module.exports = uniqueId;
