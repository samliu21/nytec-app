import Url from "../models/url";
import Category from "../models/category";

export default new Category(0, "Home", [
	new Url(1, "紐神", "https://nytec.net"),

	new Category(2, "漢神", [
		new Url(21, "漢神網站", "https://cost.nytec.net"),
		new Url(22, "漢神校務系統", "https://online.nytec.net"),
	]),

	new Url(3, "神學薈萃", "https://workshop.nytec.net"),

	new Url(4, "神學百科", "https://ebook.nytec.net"),

	new Category(5, "神學院級主日學課程", [
		new Url(51, "課程網站", "nytec.us"),
		new Url(52, "課程系統", "https://ssonline.nytec.net"),
	]),

	new Category(6, "最新消息", [
		new Url(61, "各類講座", null),
		new Url(62, "中心活動", null),
		new Url(63, "聖地旅遊學習團", "https://nytec.net/holyland/"),
		new Url(64, "其他最新消息", null),
	]),

	new Url(7, "聯絡我們", "https://nytec.net/contact-us"),

	new Category(8, "奉獻支持", [
		new Url(81, "支持紐神事工", "https://nytec.net/donation/"),
		new Url(82, "支持漢神事工", "https://cost.nytec.net/support-us"),
		new Url(83, "支持神學院級主日學課程事工", "http://nytec.us/support-us/"),
		new Url(84, "支持神學薈萃事工", "https://nytec.net/support-ws/"),
		new Url(85, "支持神學百科事工", "https://nytec.net/support-ebook/"),
		new Url(86, "支持文字宣教事工", "https://nytec.net/support-le/"),
	]),

	new Category(9, "漢神之友", [
		new Url(
			91, "美國與其他國家漢神之友",
			"https://cost.nytec.net/costfriends-us"
		),
		new Url(92, "香港漢神之友", "https://cost.nytec.net/costfriends-hk"),
		new Url(93, "加拿大漢神之友", "https://cost.nytec.net/costfriends-ca"),
	]),
]);
