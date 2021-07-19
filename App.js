import React, { useEffect, createContext, useState } from "react";
import * as Notifications from "expo-notifications";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import store from "./store/store";
import Navigator from "./navigation/Navigator";

export const AppContext = createContext();

export default function App() {
	const [token, setToken] = useState();

	useEffect(() => {
		const notificationSetup = async () => {
			try {
				const { status } = await Notifications.getPermissionsAsync();
				let finalStatus = status;
				if (status !== "granted") {
					const { status } =
						await Notifications.requestPermissionsAsync();
					finalStatus = status;
				}
				if (finalStatus !== "granted") {
					alert("Failed to get push token!");
					return;
				}

				const pulledToken = (
					await Notifications.getExpoPushTokenAsync()
				).data;

				if (pulledToken) {
					setToken(pulledToken);
				}
			} catch (err) {
				console.log(err.message);
			}
		};

		notificationSetup();
	}, []);

	return (
		<AppContext.Provider value={token}>
			<Navigator />
		</AppContext.Provider>
	);
}
/*
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[0ijG6YIvhIDJreHNT4vxMu]",
  "title":"hello",
  "body": "world"
}'
*/
