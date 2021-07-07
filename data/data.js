import Url from "../models/url";
import Category from "../models/category";

export default [
	new Url("https://nytec.net"),
	new Category(new Url("https://cost.nytec.net"), new Url("https://online.nytec.net")),
	new Url("https://workshop.nytec.net"),
	new Url("https://ebook.nytec.net"),
]