import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";
import * as notificationActions from "./actions/notification";
import * as authActions from "./actions/auth";
import { useSelector } from "react-redux";

// Allow foreground notifications
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

	// Request notification permissions
	useEffect(() => {
		const notificationSetup = async () => {
			try {
				const { status } = await Notifications.getPermissionsAsync();
				let finalStatus = status;
				// Will not request permissions more than once. User is required to change their permissions from their settings
				if (status !== "granted") {
					const { status } =
						await Notifications.requestPermissionsAsync();
					finalStatus = status;
				}
				if (finalStatus !== "granted") {
					console.log("Notifications aren't allowed!");
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
	}, []);

	// Attempt to auto-login
	useEffect(() => {
		const getData = async () => {
			const jsonData = await AsyncStorage.getItem("userData");
			const data = JSON.parse(jsonData);

			if (data) {
				const expirationDate = new Date(data.expirationDate);

				if (expirationDate <= new Date()) {
					if (data.refreshToken) {
						dispatch(authActions.refreshIdToken(data.refreshToken));
					}
					setIsLoading(false);
					return;
				}

				dispatch(
					authActions.sendToRedux(
						data.idToken,
						data.userId,
						data.email,
						data.role,
						data.emailVerified,
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
