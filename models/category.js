export default class Category {
	type = "CATEGORY";

	constructor(name, children) {
		this.name = name;
		this.children = children;
	}
}