import Model from "./model";

export default class Category extends Model {
	type = "CATEGORY";

	constructor(id, name, image, children) {
		super(id, name, image);
		this.children = children;
	}
}