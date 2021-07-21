import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as authActions from "../store/actions/auth";
import Background from "./Background";
import CustomButton from "./CustomButton";

export default function Account() {
	const email = useSelector((state) => state.auth.email);

	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(authActions.logout());
	};

	return (
		<Background>
			<View style={styles.container}>
				<Text style={styles.loginText}>
					You are logged in as {email}.
				</Text>
				<CustomButton onPress={logoutHandler}>Logout</CustomButton>
			</View>
		</Background>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
	},
	loginText: {
		marginBottom: 15,
		color: "white",
	},
});
