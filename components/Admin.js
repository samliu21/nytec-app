import axios from "axios";
import React, { useState } from "react";
import { Text, View, Alert, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import Colors from "../constants/Colors";
import Input from "./Input";
import CustomButton from "./CustomButton";
import Background from "./Background";

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

		Alert.alert("開始!");
		const failedTokens = [];
		let errorCount = 0;

		// Send all push tokens
		const send = async (token) => {
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
				throw err;
			}
		};

		// Iterate through all unique tokens and send to Expo push notification API
		for (const token of tokenList) {
			try {
				await send(token);
			} catch (err) {
				failedTokens.push(token);

				++errorCount;
			}
		}

		// Indicate how many failed notifications
		Alert.alert("成功!", `有 ${errorCount} 個失敗的通知`);

		// Attempt to resend failed tokens
		for (const token of failedTokens) {
			await send(token);
		}
	};

	const notificationClickHandler = () => {
		const confirmContent = () => {
			Alert.alert(
				"您的留言",
				`Title: ${title}\nMessage: ${message}`,
				[
					{ text: "取消", style: "destructive" },
					{ text: "發送", onPress: sendNotification },
				]
			);
		};

		Alert.alert(
			"你確定嗎?",
			"將向所有用戶發送通知.",
			[
				{ text: "Cancel", style: "destructive" },
				{ text: "Yes", onPress: confirmContent },
			]
		);
	};

	return (
		<Background>
			<View style={styles.container}>
				<Text style={styles.label}>标题</Text>
				<Input
					value={title}
					onChangeText={titleChangeHandler}
					placeholder="標題"
				/>
				<Text style={styles.label}>信息</Text>
				<Input
					value={message}
					onChangeText={messageChangeHandler}
					placeholder="信息"
					style={styles.messageInput}
				/>
				<CustomButton
					color={Colors.primary}
					onPress={notificationClickHandler}
				>
					發送通知
				</CustomButton>
			</View>
		</Background>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	label: {
		marginTop: 15,
		color: "white",
		fontSize: 17,
		fontWeight: "500",
	},
	messageInput: {
		marginBottom: 30,
	},
});
