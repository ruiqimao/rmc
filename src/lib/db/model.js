import { MongoModel } from 'mongorito';

/*
 * Wrapper for mongorito Model.
 */
export default class Model extends MongoModel {

	/*
	 * Constructor.
	 *
	 * @param db The database connection.
	 * @param collection The collection name.
	 */
	constructor(db, collection) {
		super();

		// Set the member variables.
		this.db = db;
		this.collection = collection;
	}

}
