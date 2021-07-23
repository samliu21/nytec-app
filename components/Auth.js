import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Image, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as authActions from "../store/actions/auth";
import Input from "./Input";
import CustomButton from "./CustomButton";
import Background from "./Background";
import logo from "../constants/images/紐神.png";

const width = Dimensions.get("screen").width;

export default function Auth(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);

	const token = useSelector((state) => state.notification.pushToken);

	const dispatch = useDispatch();

	// Sets title in the navigation bar
	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: isLogin ? "Login" : "Signup",
		});
	}, [props.navigation.setOptions, isLogin]);

	const submitHandler = async () => {
		// Check that passwords match
		if (!isLogin && password !== retypedPassword) {
			Alert.alert("Passwords don't match!", "Please try again!");
			return;
		}

		if (isLogin) {
			try {
				const response = await axios.post(
					"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBGB5fNb0pgtMfj4ZrnFxgD1-LryeSnQMo",
					{
						email: email,
						password: password,
						returnSecureToken: true,
					},
					{
						"Content-Type": "application/json",
					}
				);

				dispatch(authActions.signIn(response, token));
			} catch (err) {
				let message = "There was an error handling your credentials.";
				// console.dir(err.response.data.error.message);
				if (err.response) {
					switch (err.response.data.error.message) {
						// Login errors
						case "EMAIL_NOT_FOUND":
							message = "Email does not exist.";
							break;
						case "INVALID_PASSWORD":
							message = "Invalid password.";
							break;
						case "USER_DISABLED":
							message = "User has been disabled.";
							break;
					}
				}
				Alert.alert("Error", message);
			}
		} else {
			try {
				const response = await axios.post(
					"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBGB5fNb0pgtMfj4ZrnFxgD1-LryeSnQMo",
					{
						email: email,
						password: password,
						returnSecureToken: true,
					},
					{
						"Content-Type": "application/json",
					}
				);
				dispatch(authActions.signUp(response, token));
			} catch (err) {
				// Error handling
				let message = "There was an error handling your credentials.";
				if (err.response) {
					switch (err.response.data.error.message) {
						case "EMAIL_EXISTS":
							message = "Email already exists.";
							break;
						case "INVALID_PASSWORD":
							message = "Invalid password.";
							break;
						case "USER_DISABLED":
							message = "User has been disabled.";
							break;
						case "TOO_MANY_ATTEMPTS_TRY_LATER":
							message = "Too many attempts.";
							break;
						case "WEAK_PASSWORD : Password should be at least 6 characters":
							message =
								"Password should be at least 6 characters.";
							break;
					}
				}

				Alert.alert("Error", message);
			}
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

	return (
		<Background>
			<View style={styles.container}>
				<View style={styles.imageContainer}>
					<Image
						source={require("../constants/images/紐神.png")}
						style={styles.image}
					/>
				</View>
				<Input
					value={email}
					onChangeText={emailChangeHandler}
					placeholder="Email"
				/>
				<Input
					value={password}
					onChangeText={passwordChangeHandler}
					placeholder="Password"
					secureTextEntry
				/>
				{!isLogin && (
					<Input
						value={retypedPassword}
						onChangeText={retypePasswordChangeHandler}
						placeholder="Retype your password"
						secureTextEntry
					/>
				)}
				<View style={styles.buttonContainer}>
					<CustomButton onPress={submitHandler}>Submit</CustomButton>
					<CustomButton onPress={switchModeHandler}>
						{isLogin ? "Signup" : "Login"}
					</CustomButton>
				</View>
			</View>
		</Background>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 30,
	},
	container: {
		padding: 20,
	},
	image: {
		width: width / 2,
		height: width / 2,
	},
	imageContainer: {
		alignItems: "center",
		marginBottom: "10%",
	},
	input: {
		borderWidth: 2,
		padding: 10,
		margin: 10,
		fontSize: 14,
	},
});
