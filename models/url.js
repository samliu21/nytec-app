import Model from "./model";

// Stores data for Button
// Contains this.url, which is the link that the app will navigate to when clicked
export default class Url extends Model {
	type = "URL";

	constructor(id, name, image, url) {
		super(id, name, image);
		this.url = url;
	}
}