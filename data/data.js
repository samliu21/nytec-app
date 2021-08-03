import Url from "../models/url";
import Category from "../models/category";

// Image imports for ID 1 - 10
import 紐神 from "../assets/紐神.png";
import 漢神 from "../assets/漢神.png";
import 神學薈萃 from "../assets/神學薈萃.png";
import 神學百科 from "../assets/神學百科.png";
import 神學院級主日學課程 from "../assets/神學院級主日學課程.png";
import 最新消息 from "../assets/最新消息.png";
import 聯絡我們 from "../assets/聯絡我們.png";
import 奉獻支持 from "../assets/奉獻支持.png";
import 漢神之友 from "../assets/漢神之友.png";

// Image imports for ID 21 - 22
import 漢神網站 from "../assets/漢神網站.png";
import 漢神校務系統 from "../assets/漢神校務系統.png";

// Image imports for ID 51 - 52
import 課程網站 from "../assets/課程網站.png";
import 課程系統 from "../assets/課程系統.png";

// Image imports for ID 61 - 64
import 各類講座 from "../assets/各類講座.png";
import 中心活動 from "../assets/中心活動.png";
import 聖地旅遊學習團 from "../assets/聖地旅遊學習團.png";
import 其他最新消息 from "../assets/其他最新消息.png";

// Image imports for ID 81 - 86
import 支持紐神事工 from "../assets/支持紐神事工.png";
import 支持漢神事工 from "../assets/支持漢神事工.png";
import 支持神學院級主日學課程事工 from "../assets/支持神學院級主日學課程事工.png";
import 支持神學薈萃事工 from "../assets/支持神學薈萃事工.png";
import 支持神學百科事工 from "../assets/支持神學百科事工.png";
import 支持文字宣教事工 from "../assets/支持文字宣教事工.png";

// Image imports for ID 91 - 93
import 美國與其他國家漢神之友 from "../assets/美國與其他國家漢神之友.png";
import 香港漢神之友 from "../assets/香港漢神之友.png";
import 加拿大漢神之友 from "../assets/加拿大漢神之友.png";

export default new Category(0, "主頁", null, [
	new Url(1, "紐神", 紐神, "https://nytec.net"),

	new Category(2, "漢神", 漢神, [
		new Url(21, "漢神網站", 漢神網站, "https://cost.nytec.net"),
		new Url(22, "漢神校務系統", 漢神校務系統, "https://online.nytec.net"),
	]),

	new Url(3, "神學薈萃", 神學薈萃, "https://workshop.nytec.net"),

	new Url(4, "神學百科", 神學百科, "https://ebook.nytec.net"),

	new Category(5, "神學院級主日學課程", 神學院級主日學課程, [
		new Url(51, "課程網站", 課程網站, "https://ss.nytec.net"),
		new Url(52, "課程系統", 課程系統, "https://ssonline.nytec.net"),
	]),

	new Category(6, "最新消息", 最新消息, [
		new Url(61, "各類講座", 各類講座, "https://nytec.net/news"),
		new Url(62, "中心活動", 中心活動, "https://nytec.net/news"),
		new Url(
			63,
			"聖地旅遊學習團",
			聖地旅遊學習團,
			"https://nytec.net/holyland/"
		),
		new Url(64, "其他最新消息", 其他最新消息, "https://nytec.net/news"),
	]),

	new Url(7, "聯絡我們", 聯絡我們, "https://nytec.net/contact-us"),

	new Category(8, "奉獻支持", 奉獻支持, [
		new Url(
			81,
			"支持紐神事工",
			支持紐神事工,
			"https://nytec.net/donation/"
		),
		new Url(
			82,
			"支持漢神事工",
			支持漢神事工,
			"https://cost.nytec.net/support-us"
		),
		new Url(
			83,
			"支持神學院級主日學課程事工",
			支持神學院級主日學課程事工,
			"http://nytec.us/support-us/"
		),
		new Url(
			84,
			"支持神學薈萃事工",
			支持神學薈萃事工,
			"https://nytec.net/support-ws/"
		),
		new Url(
			85,
			"支持神學百科事工",
			支持神學百科事工,
			"https://nytec.net/support-ebook/"
		),
		new Url(
			86,
			"支持文字宣教事工",
			支持文字宣教事工,
			"https://nytec.net/support-le/"
		),
	]),

	new Category(9, "漢神之友", 漢神之友, [
		new Url(
			91,
			"美國與其他國家漢神之友",
			美國與其他國家漢神之友,
			"https://cost.nytec.net/costfriends-us"
		),
		new Url(
			92,
			"香港漢神之友",
			香港漢神之友,
			"https://cost.nytec.net/costfriends-hk"
		),
		new Url(
			93,
			"加拿大漢神之友",
			加拿大漢神之友,
			"https://cost.nytec.net/costfriends-ca"
		),
	]),
]);
