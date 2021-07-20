import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";
import * as notificationActions from "./actions/notification";
import * as authActions from "./actions/auth";
import { useSelector } from "react-redux";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function PermissionsHandler(props) {
	const [isLoading, setIsLoading] = useState(true);
	const role = useSelector((state) => state.auth.role);

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

	useEffect(() => {
		const getData = async () => {
			const jsonData = await AsyncStorage.getItem("userData");
			const data = JSON.parse(jsonData);

			if (data) {
				dispatch(
					authActions.autoLogin(
						data.idToken,
						data.userId,
						data.email,
						data.role
					)
				);
			} else {
				setIsLoading(false);
			}
		};

		getData();
	}, []);

	if (role && isLoading) {
		setIsLoading(false);
	}

	// return props.children;
	return isLoading ? <ActivityIndicator /> : props.children;
}
