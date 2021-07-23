import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../constants/Colors";

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
				<Text style={styles.loginText}>You are logged in as:</Text>
				<View style={styles.emailContainer}>
					<Text style={styles.email}>{email}</Text>
				</View>
				<CustomButton onPress={logoutHandler}>Logout</CustomButton>
			</View>
		</Background>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
		justifyContent: "space-between",
		alignItems: "center",
	},
	email: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	emailContainer: {
		paddingVertical: 20,
		paddingHorizontal: 30,
		borderRadius: 15,
		backgroundColor: Colors.complement,
		marginBottom: 40,
		shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        elevation: 5,
		shadowColor: "white",
	},
	loginText: {
		marginTop: 15,
		marginBottom: 20,
		color: "white",
		fontSize: 16,
		textAlign: "center",
	},
});
