import axios from "axios";
import React from "react";
import { StyleSheet, Text, Alert } from "react-native";
import Constants from "expo-constants";
import { mediumFontSize } from "../constants/Sizes";

export default function PasswordReset(props) {
	const passwordChangeHandler = async () => {
		// Prompt user for email, make API call to send email
		Alert.prompt("輸入你的電子郵箱:", null, async (email) => {
			try {
				await axios.post(
					`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${props.apiKey}`,
					{
						requestType: "PASSWORD_RESET",
						email: email,
					}
				);

				Alert.alert("成功", "電子郵件已經發送成功.");
			} catch (err) {
				let message = "發送電子郵件時出錯.";
				console.log(err.response.data.error.message);
				if (err.response) {
					switch (err.response.data.error.message) {
						case "EMAIL_NOT_FOUND":
							message = "電子郵件有錯誤.";
							break;
						case "INVALID_EMAIL":
							message = "電子郵件無效。";
							break;
					}
				}
				Alert.alert("失敗", message);
			}
		});
	};

	return (
		<Text onPress={passwordChangeHandler} style={styles.text}>
			{props.children}
		</Text>
	);
}

PasswordReset.defaultProps = {
	apiKey: Constants.manifest.extra.apiKey || null,
};

const styles = StyleSheet.create({
	text: {
		color: "white",
		marginTop: 20,
		fontSize: mediumFontSize,
	},
});
