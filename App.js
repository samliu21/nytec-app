import React from "react";
import { Provider } from "react-redux";

import store from "./store/store";
import Navigator from "./navigation/Navigator";
import PermissionsHandler from "./store/PermissionsHandler";

export default function App() {
	return (
		<Provider store={store}>
			<PermissionsHandler>
				<Navigator />
			</PermissionsHandler>
		</Provider>
	);
}
