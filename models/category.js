export default class Category {
	type = "CATEGORY";

	constructor(id, name, children) {
		this.id = id;
		this.name = name;
		this.children = children;
	}
}