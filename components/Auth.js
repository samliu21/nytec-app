import axios from "axios";
import React, { useState, useEffect } from "react";
import { TextInput, View, Button, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";

export default function Test() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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
		<View>
			<TextInput value={email} onChange={setEmail} style={styles.input} />
			<TextInput
				value={password}
				onChange={setPassword}
				style={styles.input}
			/>
			<Button title="Submit" onPress={submitHandler} />
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 2,
		padding: 5,
		margin: 10,
	},
});
