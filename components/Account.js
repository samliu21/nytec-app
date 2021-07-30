import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/Colors";
import { smallFontSize, mediumFontSize } from "../constants/Sizes";

import Background from "./Background";
import PasswordChange from "./PasswordChange";
import LogoutButton from "./LogoutButton";

export default function Account() {
	const email = useSelector((state) => state.auth.email);

	return (
		<Background>
			<View style={styles.container}>
				<Text style={styles.loginText}>電郵:</Text>
				<View style={styles.emailContainer}>
					<Text style={styles.email}>{email}</Text>
				</View>
				<LogoutButton />
				<PasswordChange>更改您的密碼</PasswordChange>
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
		fontSize: smallFontSize,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	emailContainer: {
		paddingVertical: 20,
		paddingHorizontal: 30,
		borderRadius: 15,
		backgroundColor: Colors.complement,
		marginBottom: "8%",
		shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        elevation: 10,
		shadowColor: "white",
	},
	loginText: {
		marginTop: 15,
		marginBottom: 20,
		color: "white",
		fontSize: mediumFontSize,
		textAlign: "center",
	},
});
