import React, { useState, useEffect } from "react";
import { TextInput, View, Button, StyleSheet, Text, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as Notifications from "expo-notifications";

import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);

	const token = useSelector((state) => state.notification.pushToken);

	const dispatch = useDispatch();

	const submitHandler = async () => {
		// Check that passwords match
		if (!isLogin && password !== retypedPassword) {
			Alert.alert("Passwords don't match!", "Please try again!");
			return;
		}

		// Try to login or signup
		try {
			if (isLogin) {
				dispatch(authActions.signIn(email, password, token));
			} else {
				dispatch(authActions.signUp(email, password, token));
			}
		} catch (err) {
			Alert.alert(
				"Error",
				err.message ?? "There was an error handling your credentials"
			);
			return;
		}
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
