import Model from "./model";

// Represents the data for a ButtonList
// Subclass of model that has a this.children property, storing the buttons in the list
export default class Category extends Model {
	type = "CATEGORY";

	constructor(id, name, image, children) {
		super(id, name, image);
		this.children = children;
	}
}