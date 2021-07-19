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
/*
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[0ijG6YIvhIDJreHNT4vxMu]",
  "title":"hello",
  "body": "world"
}'
*/
