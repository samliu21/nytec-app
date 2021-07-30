import axios from "axios";
import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import Constants from "expo-constants";

import * as authActions from "../store/actions/auth";
import Background from "./Background";
import CustomButton from "./CustomButton";
import Logo from "./Logo";
import { largeFontSize, mediumFontSize } from "../constants/Sizes";

export default function VerifyEmail(props) {
	const idToken = useSelector((state) => state.auth.idToken);
	const [attempts, setAttempts] = useState(0);

	const dispatch = useDispatch();

	const sendEmailHandler = async () => {
		// Send verfication email
		try {
			await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${props.apiKey}`,
				{
					requestType: "VERIFY_EMAIL",
					idToken: idToken,
				}
			);

			Alert.alert("驗證鏈接已發送至您的郵箱!", "請檢查您的垃圾郵件或垃圾郵件文件夾。");
		} catch (err) {
			let message = "無法發送您的驗證電子郵件。";
			if (err.response) {
				switch (err.response.data.error.message) {
					case "INVALID_ID_TOKEN":
						message = "您的 ID 無效。請重新登錄以獲取新的。";
					case "USER_NOT_FOUND":
						message = "找不到用戶。";
					case "TOO_MANY_ATTEMPTS_TRY_LATER":
						message = "太多的嘗試。 請稍後再試。";
				}
			}
			Alert.alert("發送電子郵件時出錯", message);
		}

		if (attempts === 3) {
			// Third time failing
			Alert.alert(
				"還是不工作嗎?",
				"請在下一頁檢查您的電子郵件是否正確。"
			);
		}
		setAttempts((state) => state + 1);
	};

	const verifyHandler = async () => {
		try {
			// Verify that the user has clicked the verification link
			const verify = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${props.apiKey}`,
				{
					idToken: idToken,
				}
			);

			const emailVerified = verify.data.users[0].emailVerified;

			// If the user has not verified their email
			if (emailVerified === false) {
				Alert.alert("你還沒有驗證!");
				return;
			}

			// Set redux state
			dispatch(authActions.setEmailVerified(emailVerified));
		} catch (err) {
			let message = "無法驗證您。";
			console.dir(err);
			if (err.response) {
				switch (err.response.data.error.message) {
					case "INVALID_ID_TOKEN":
						message = "您的 ID 無效。請重新登錄以獲取新的。";
					case "USER_NOT_FOUND":
						message = "找不到用戶。";
				}
			}
			Alert.alert("驗證您的電子郵件時出錯。", message);
		}
		setAttempts(0);
	};

	return (
		<Background>
			<View style={styles.container}>
				<Logo />
				<Text style={styles.heading}>您的電子郵件未經驗證!</Text>
				<Text style={styles.body}>
					按左鍵發送驗證郵件。 驗證完成後按右鍵
				</Text>
				<View style={styles.buttonContainer}>
					<CustomButton onPress={sendEmailHandler}>
						發送電子郵!
					</CustomButton>
					<CustomButton onPress={verifyHandler}>
						我已經驗證!
					</CustomButton>
				</View>
			</View>
		</Background>
	);
}

VerifyEmail.defaultProps = {
	apiKey: Constants.manifest.extra.apiKey || null,
};

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 30,
	},
	container: {
		padding: 20,
	},
	heading: {
		fontSize: largeFontSize,
		color: Colors.light,
		fontWeight: "500",
		marginBottom: 10,
	},
	body: {
		fontSize: mediumFontSize,
		color: "white",
	},
});
