import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { useDispatch } from "react-redux";
import * as notificationActions from "./actions/notification";

export default function PermissionsHandler(props) {
	const dispatch = useDispatch();

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
					dispatch(notificationActions.setToken(pulledToken));
				}
			} catch (err) {
				console.log(err.message);
			}
		};

		notificationSetup();

		const foregroundSubscription =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log(notification);
			});

		return () => {
			foregroundSubscription.remove();
		};
	}, []);

	return props.children;
}
