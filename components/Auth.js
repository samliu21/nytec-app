import axios from "axios";
import React, { useState, useEffect } from "react";
import { TextInput, View, Button, StyleSheet, Text } from "react-native";
import * as Notifications from "expo-notifications";
import Colors from "../constants/Colors";

export default function Test() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);

	const submitHandler = async () => {
		const response = await axios.get(
			"https://nytec-practice-default-rtdb.firebaseio.com/tokens.json"
		);
		const obj = response.data;

		const tokens = new Set();
		for (const key in obj) {
			tokens.add(obj[key]["token"]);
		}
		for (const key of tokens) {
			const response = await axios.post(
				"https://exp.host/--/api/v2/push/send",
				{
					to: key,
					title: "Hey there!",
					body: "Hello!",
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			console.log(response);
		}
	};

	const switchModeHandler = () => {
		setIsLogin((state) => !state);
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
				onChange={setEmail}
				placeholder="Email"
				style={styles.input}
			/>
			<TextInput
				value={password}
				onChange={setPassword}
				placeholder="Password"
				secureTextEntry
				style={styles.input}
			/>
			{!isLogin && (
				<TextInput
					value={retypedPassword}
					onChange={setRetypedPassword}
					placeholder="Retype your password"
					secureTextEntry
					style={styles.input}
				/>
			)}
			<View style={styles.buttonContainer}>
				<Button
					title="Submit"
					onPress={() => {}}
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
