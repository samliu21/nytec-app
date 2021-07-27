import axios from "axios";
import React from "react";
import { StyleSheet, Text, Alert } from "react-native";
import Constants from "expo-constants";

export default function PasswordChange(props) {
	const passwordChangeHandler = () => {
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
				if (
					err.response &&
					err.response.data.error.message === "INVALID_EMAIL"
				) {
					message =
						"電子郵件無效.";
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
