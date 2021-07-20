import axios from "axios";
import React, { useState } from "react";
import { Text, View, Button, Alert } from "react-native";
import { useSelector } from "react-redux";

import Colors from "../constants/Colors";
import Input from "./Input";

export default function Admin() {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	const idToken = useSelector((state) => state.auth.idToken);

	const titleChangeHandler = (text) => {
		setTitle(text);
	};

	const messageChangeHandler = (text) => {
		setMessage(text);
	};

	const sendNotification = async () => {
		const tokenList = new Set();

		// Obtain all push tokens
		try {
			const response = await axios.get(
				`https://nytec-practice-default-rtdb.firebaseio.com/tokens.json?auth=${idToken}`
			);
			const obj = response.data;

			for (const key in obj) {
				const arr = obj[key];
				for (const item of arr.tokens) {
					tokenList.add(item);
				}
			}
		} catch (err) {
			console.log(err.message);
		}

		// Send all push tokens
		let errorCount = 0;
		for (const token of tokenList) {
			try {
				await axios.post(
					"https://exp.host/--/api/v2/push/send",
					{
						to: token,
						title: title,
						body: message,
					},
					{
						headers: {
							host: "exp.host",
							Accept: "application/json",
							"Accept-Encoding": "gzip, deflate",
							"Content-Type": "application/json",
						},
					}
				);
			} catch (err) {
				console.log(
					`There was an error sending notification with push token: ${token}`
				);

				++errorCount;
			}
		}
		Alert.alert(
			"Result",
			errorCount === 1
				? `There was ${errorCount} failed notification.`
				: `There were ${errorCount} failed notifications.`
		);
	};

	const notificationClickHandler = () => {
		const confirmContent = () => {
			Alert.alert(
				"Your Message",
				`Title: ${title}\n\nMessage: ${message}`,
				[
					{ text: "Cancel", style: "destructive" },
					{ text: "Send", onPress: sendNotification },
				]
			);
		};

		Alert.alert(
			"Are you sure?",
			"A notification will be sent to all users.",
			[
				{ text: "Cancel", style: "destructive" },
				{ text: "Yes", onPress: confirmContent },
			]
		);
	};

	return (
		<View>
			<Text>Title</Text>
			<Input
				value={title}
				onChangeText={titleChangeHandler}
				placeholder="Title"
			/>
			<Text>Message</Text>
			<Input
				value={message}
				onChangeText={messageChangeHandler}
				placeholder="Message"
			/>
			<Button
				title="Send notification to all users"
				color={Colors.primary}
				onPress={notificationClickHandler}
			/>
		</View>
	);
}
