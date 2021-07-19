import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { TextInput, View, Button, StyleSheet, Text, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/core";

import Colors from "../constants/Colors";
import { signIn, signUp } from "../util";
import { AppContext } from "../App";
import data from "../data/data";

export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);

	const token = useContext(AppContext);
	const navigation = useNavigation();

	const submitHandler = async () => {
		if (!isLogin && password !== retypedPassword) {
			Alert.alert("Passwords don't match!", "Please try again!");
			return;
		}

		try {
			var authObject = await (isLogin
				? signIn(email, password)
				: signUp(email, password));
			} catch (err) {
				Alert.alert("Error", err.message ?? "There was an error handling your credentials");
				return;
			}

		// Get the userId of the authenticated user
		const userId = authObject.localId;
		const idToken = authObject.idToken;

		try {
			if (!isLogin && userId && idToken) {
				await axios.put(
					`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`,
					{
						role: "user",
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
			}
		} catch (err) {
			// Error will be thrown if role already exists
			console.log(err.message);
		}

		try {
			// If push token and user id exist, fetch current token list and append new token if not already in the list
			if (token && userId && idToken) {
				const response = await axios.get(
					`https://nytec-practice-default-rtdb.firebaseio.com/tokens/${userId}.json?auth=${idToken}`
				);

				const tokens = response.data ? response.data.tokens : null;

				if (!tokens || !tokens.includes(token)) {
					const updatedTokenList = tokens ? tokens : [];
					updatedTokenList.push(token);

					await axios.put(
						`https://nytec-practice-default-rtdb.firebaseio.com/tokens/${userId}.json?auth=${idToken}`,
						{
							tokens: updatedTokenList,
						},
						{
							headers: {
								"Content-Type": "application/json",
							},
						}
					);
				}
			}

			navigation.push("List", {
				children: data.children,
				name: data.name,
			});
		} catch (err) {
			console.log(err.message);
			Alert.alert("Error handling your credentials")
		}

		// const response = await axios.get(
		// 	`https://nytec-practice-default-rtdb.firebaseio.com/tokens.json?auth=${idToken}`
		// );
		// const obj = response.data;
		// console.log(obj);
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
