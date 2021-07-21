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

	return (
		<Background>
			<Image source={require("../constants/images/紐神.png")} style={styles.image} />
			<View style={styles.container}>
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
	input: {
		borderWidth: 2,
		padding: 10,
		margin: 10,
		fontSize: 14,
	},
});
