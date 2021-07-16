import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { TextInput, View, Button, StyleSheet, Text } from "react-native";
import * as Notifications from "expo-notifications";

import Colors from "../constants/Colors";
import { signIn, signUp } from "../util";
import { AppContext } from "../App";

export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);

	const token = useContext(AppContext);

	const submitHandler = async () => {
		const authObject = await (isLogin
			? signIn(email, password)
			: signUp(email, password));

		// Get the userId of the authenticated user
		const userId = authObject.localId;
		const idToken = authObject.idToken;

		// If push token and user id exist, fetch current token list and append new token if not already in the list
		if (token && userId) {
			const response = await axios.get(
				`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`
			);
			const userData = response.data;
			/*
			console.log(userData)
			
			If already exists:
			Object {
				"role": "user",
				"tokens": Array [
					"ExponentPushToken[4CmceLB3TJ3IuuFqx-3-Og]",
				],
			}

			If doesn't exist:
			null
			*/

			const role = userData ? userData.role : "user";
			const tokens = userData ? userData.tokens : null;

			if (!tokens || !tokens.includes(token)) {
				const updatedTokenList = tokens ? tokens : [];
				if (!updatedTokenList.includes(token)) {
					updatedTokenList.push(token);
				}

				await axios.put(
					`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`,
					{
						role: role,
						tokens: updatedTokenList,
					},
					{
						"Content-Type": "application/json",
					}
				);
			}
		}

		const response = await axios.get(
			`https://nytec-practice-default-rtdb.firebaseio.com/users.json?auth=${idToken}`
		);
		const obj = response.data;
		console.log(obj);
	};

	const switchModeHandler = () => {
		setIsLogin((state) => !state);
	};

	const emailChangeHandler = (text) => {
		setEmail(text);
	};

	const passwordChangeHandler = (text) => {
		setPassword(text);
	};

	const retypePasswordChangeHandler = (text) => {
		setRetypedPassword(text);
	};

	useEffect(() => {
		const foregroundSubscription =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log(notification);
			});

		return () => {
			foregroundSubscription.remove();
		};
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{isLogin ? "Login" : "Signup"}</Text>
			<TextInput
				value={email}
				onChangeText={emailChangeHandler}
				placeholder="Email"
				autoCapitalize="none"
				style={styles.input}
			/>
			<TextInput
				value={password}
				onChangeText={passwordChangeHandler}
				placeholder="Password"
				secureTextEntry
				style={styles.input}
			/>
			{!isLogin && (
				<TextInput
					value={retypedPassword}
					onChangeText={retypePasswordChangeHandler}
					placeholder="Retype your password"
					secureTextEntry
					style={styles.input}
				/>
			)}
			<View style={styles.buttonContainer}>
				<Button
					title="Submit"
					onPress={submitHandler}
					color={Colors.primary}
				/>
				<Button
					title={isLogin ? "Signup" : "Login"}
					onPress={switchModeHandler}
					color={Colors.primary}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	container: {
		padding: 20,
	},
	input: {
		borderWidth: 2,
		padding: 10,
		margin: 10,
		fontSize: 14,
	},
	title: {
		textAlign: "center",
		fontSize: 25,
		marginBottom: 10,
	},
});
