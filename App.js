import React, { useEffect, createContext, useState } from "react";
import * as Notifications from "expo-notifications";

export const AppContext = createContext();

import Navigator from "./navigation/Navigator";

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
				// const deviceId = getUniqueId();
				// console.log(deviceId);

				const pulledToken = (await Notifications.getExpoPushTokenAsync())
					.data;
				setToken(pulledToken);

				if (pulledToken) {
					// const response = axios.post(
					// 	"https://nytec-practice-default-rtdb.firebaseio.com/tokens.json",
					// 	{
					// 		token: token,
					// 	},
					// 	{
					// 		headers: {
					// 			"Content-Type": "application/json",
					// 		},
					// 	}
					// );
					// console.log(response);

					console.log(pulledToken);
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
