import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";

import * as authActions from "../store/actions/auth";
import { mediumFontSize } from "../constants/Sizes";
import CustomButton from "./CustomButton";
import Input from "./Input";
import axios from "axios";

export default function PasswordChange(props) {
	const { changing, setChanging } = props;

	const [originalPassword, setOriginalPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");

	const dispatch = useDispatch();
	const navigation = useNavigation();

	const pressHandler = () => {
		if (changing) {
			setOriginalPassword("");
			setNewPassword("");
			setRetypedPassword("");
		}
		setChanging((state) => !state);
	};

	// Attempt to sign in and replace idToken in redux state
	const attemptToSignIn = async () => {
		try {
			const response = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${props.apiKey}`,
				{
					email: props.email,
					password: originalPassword,
					returnSecureToken: true,
				},
				{
					"Content-Type": "application/json",
				}
			);

			const { idToken, refreshToken, expiresIn } = response.data;
			const expirationDate = new Date(
				new Date().getTime() + +expiresIn * 1000
			).toISOString();
			return [idToken, refreshToken, expirationDate, expiresIn];
		} catch (err) {
			console.log(err.response.data.error.message);
			Alert.alert("錯誤", "密碼不正確");
			return null;
		}
	};

	const submitHandler = async () => {
		// Check passwords match
		if (newPassword !== retypedPassword) {
			Alert.alert("密碼不匹配!", "請再試一次!");
			return;
		}

		const arr = await attemptToSignIn();
		if (!arr) {
			console.log("Password is incorrect");
			return;
		}

		// Dispatch to redux and AsyncStorage

		const [idToken, refreshToken, expirationDate, expiresIn] = arr;
		dispatch(
			authActions.setIdToken(
				idToken,
				refreshToken,
				expirationDate,
				expiresIn
			)
		);

		console.log("New idToken was obtained");

		try {
			await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${props.apiKey}`,
				{
					idToken: idToken,
					password: newPassword,
				},
				{
					"Content-Type": "application/json",
				}
			);

			Alert.alert("成功!", "密碼已更改。 請重新登錄。", [
				{
					text: "Ok",
					onPress: () => {
						navigation.replace("List");

						dispatch(authActions.logout());
					},
				},
			]);
		} catch (err) {
			let message = "處理您的信息時出錯。";
			if (err.response) {
				switch (err.response.data.error.message) {
					case "INVALID_ID_TOKEN":
						message = "您的 ID 無效。請重新登錄以獲取新的。";
						break;
					case "WEAK_PASSWORD : Password should be at least 6 characters":
						message = "密碼應至少為 6 個字。";
						break;
				}
			}
			Alert.alert("錯誤", message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.text} onPress={pressHandler}>
				{changing ? "取消" : props.children}
			</Text>
			{changing && (
				<Input
					value={originalPassword}
					onChangeText={setOriginalPassword}
					placeholder="當前密碼"
					secureTextEntry={true}
				/>
			)}
			{changing && (
				<Input
					value={newPassword}
					onChangeText={setNewPassword}
					placeholder="新密碼"
					secureTextEntry={true}
				/>
			)}
			{changing && (
				<Input
					value={retypedPassword}
					onChangeText={setRetypedPassword}
					placeholder="重新輸入您的新密碼"
					secureTextEntry={true}
				/>
			)}
			{changing && (
				<CustomButton onPress={submitHandler} style={styles.submit}>
					更改密碼!
				</CustomButton>
			)}
		</View>
	);
}

PasswordChange.defaultProps = {
	apiKey: Constants.manifest.extra.apiKey || null,
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	submit: {
		marginTop: "6%",
	},
	text: {
		color: "white",
		marginTop: 20,
		fontSize: mediumFontSize,
		textAlign: "center",
	},
});
