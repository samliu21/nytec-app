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
		console.log(userId, idToken);
		// https://nytec-practice-default-rtdb.firebaseio.com/users/qUcttFcCBVdMSay2u7dIlPX08Ox2.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3MTBiMDE3ZmQ5YjcxMWUwMDljNmMzNmIwNzNiOGE2N2NiNjgyMTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnl0ZWMtcHJhY3RpY2UiLCJhdWQiOiJueXRlYy1wcmFjdGljZSIsImF1dGhfdGltZSI6MTYyNjU0Nzc0NiwidXNlcl9pZCI6InFVY3R0RmNDQlZkTVNheTJ1N2RJbFBYMDhPeDIiLCJzdWIiOiJxVWN0dEZjQ0JWZE1TYXkydTdkSWxQWDA4T3gyIiwiaWF0IjoxNjI2NTQ3NzQ2LCJleHAiOjE2MjY1NTEzNDYsImVtYWlsIjoic2FtNGJ1dHRvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsic2FtNGJ1dHRvbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.hK6IYKA0czke9LV74btgzKnt3SiBZjwU1hzi8I3Z-VuxV5WiPhHOBptcwHizYsit4RpGcvUjd1wA8wzgSPiTwnDQBi04VsHpCMhNLb5zOUlpvd3BUE4G2HEmv6HhU0Ji3OBPneqd_fNufb0xfLzKW8GFcAZdtlh5aS8CkJf1cgo5t7haAjxF16iFk4EE7r60cwmH8tbLdhWyzJLQdB0oeh_o_YgzDEQ0SoBrIUU2yq9pd6RhHxksGIDkCXej7K3TkmeGCZD4gX6YIJ0ZZxRvdJQ_ePoL1186Xf60TANHFOVQMBOkLMi3eDdFOehFqB7NiQZj5oa68THkzmnS_tC_HQ

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

			const tokens = userData ? userData.tokens : null;

			if (!tokens || !tokens.includes(token)) {
				const updatedTokenList = tokens ? tokens : [];
				if (!updatedTokenList.includes(token)) {
					updatedTokenList.push(token);
				}

				await axios.put(
					`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`,
					{
						role: "user",
						tokens: updatedTokenList,
					},
					{
						"Content-Type": "application/json",
					}
				);
			}
		}

		// const response = await axios.get(
		// 	`https://nytec-practice-default-rtdb.firebaseio.com/users.json?auth=${idToken}`
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
