import Model from "./model";

export default class Url extends Model {
	type = "URL";

	constructor(id, name, image, url) {
		super(id, name, image);
		this.url = url;
	}
}