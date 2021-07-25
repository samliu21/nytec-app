import axios from "axios";
import React from "react";
import { StyleSheet, Text, Alert } from "react-native";
import Constants from "expo-constants";

export default function PasswordChange(props) {
	const passwordChangeHandler = () => {
		Alert.prompt("Enter your email:", null, async (email) => {
			try {
				await axios.post(
					`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${props.apiKey}`,
					{
						requestType: "PASSWORD_RESET",
						email: email,
					}
				);

				Alert.alert("Success", "Email has been sent successfully.");
			} catch (err) {
				let message = "There was an error sending the email.";
				if (
					err.response &&
					err.response.data.error.message === "INVALID_EMAIL"
				) {
					message =
						"The entered email is not attached to an account.";
				}
				Alert.alert("Failure", message);
			}
		});
	};

	return (
		<Text onPress={passwordChangeHandler} style={styles.text}>
			{props.children}
		</Text>
	);
}

PasswordChange.defaultProps = {
	apiKey: Constants.manifest.extra.apiKey || null,
};

const styles = StyleSheet.create({
	text: {
		color: "white",
		marginTop: 20,
		fontSize: 15,
	},
});
