import React from "react";

import data from "./data/data";
import ButtonList from "./components/ButtonList";

export default function App() {
	return (
		<ButtonList children={data.children} />
	);
}

