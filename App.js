import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";

import Navigator from "./navigation/Navigator";
import axios from "axios";

export default function App() {
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

				const token = (await Notifications.getExpoPushTokenAsync())
					.data;
				console.log(token);
				
				// axios.post("")
			} catch (err) {
				console.log("An error occurred: " + err.message);
			}
		};

		notificationSetup();
	}, []);

	return <Navigator />;
}
/*
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[0ijG6YIvhIDJreHNT4vxMu]",
  "title":"hello",
  "body": "world"
}'
*/
