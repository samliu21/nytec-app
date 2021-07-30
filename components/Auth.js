import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useHeaderHeight } from "@react-navigation/stack";
import Constants from "expo-constants";

import * as authActions from "../store/actions/auth";
import Input from "./Input";
import CustomButton from "./CustomButton";
import Background from "./Background";
import Loading from "./Loading";
import Logo from "./Logo";
import PasswordReset from "./PasswordReset";

export default function Auth(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const token = useSelector((state) => state.notification.pushToken);

	const dispatch = useDispatch();
	const headerHeight = useHeaderHeight();

	// Sets title in the navigation bar
	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: isLogin ? "登錄" : "報名",
		});
	}, [props.navigation.setOptions, isLogin]);

	const submitHandler = async () => {
		// Check that passwords match
		if (!isLogin && password !== retypedPassword) {
			Alert.alert("密碼不匹配!", "請再試一次!");
			return;
		}

		setIsLoading(true);
		// --- LOGIN ---
		if (isLogin) {
			try {
				const response = await axios.post(
					`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${props.apiKey}`,
					{
						email: email,
						password: password,
						returnSecureToken: true,
					},
					{
						"Content-Type": "application/json",
					}
				);

				dispatch(authActions.authenticate(response, token));
			} catch (err) {
				let message = "處理您的信息時出錯。";
				if (err.response) {
					switch (err.response.data.error.message) {
						// Login errors
						case "EMAIL_NOT_FOUND":
							message = "電子郵件不存在。";
							break;
						case "INVALID_PASSWORD":
							message = "無效的密碼。";
							break;
						case "USER_DISABLED":
							message = "用戶已被禁用。";
							break;
					}
				}
				Alert.alert("錯誤", message);
			}
		}
		// --- SIGNUP ---
		else {
			try {
				const response = await axios.post(
					`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${props.apiKey}`,
					{
						email: email,
						password: password,
						returnSecureToken: true,
					},
					{
						"Content-Type": "application/json",
					}
				);
				dispatch(authActions.authenticate(response, token));
			} catch (err) {
				// Error handling
				let message = "處理您的信息時出錯。";
				if (err.response) {
					switch (err.response.data.error.message) {
						case "EMAIL_EXISTS":
							message = "電子郵件已經存在。";
							break;
						case "INVALID_PASSWORD":
							message = "無效的密碼。";
							break;
						case "USER_DISABLED":
							message = "用戶已被禁用。";
							break;
						case "TOO_MANY_ATTEMPTS_TRY_LATER":
							message = "太多的嘗試。";
							break;
						case "WEAK_PASSWORD : Password should be at least 6 characters":
							message = "密碼應至少為 6 個字。";
							break;
					}
				}

				Alert.alert("錯誤", message);
			}
		}
		setIsLoading(false);
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
				<Logo />
				{/* <KeyboardAvoidingView
					behavior="position"
					keyboardVerticalOffset={headerHeight + 10}
				> */}
				<Input
					value={email}
					onChangeText={emailChangeHandler}
					placeholder="電郵 (Email)"
				/>
				<Input
					value={password}
					onChangeText={passwordChangeHandler}
					placeholder="密碼 (Password)"
					secureTextEntry
				/>
				{!isLogin && (
					<Input
						value={retypedPassword}
						onChangeText={retypePasswordChangeHandler}
						placeholder="重新輸入您的密碼 (Retype password)"
						secureTextEntry
					/>
				)}
				{/* </KeyboardAvoidingView> */}
				<View style={styles.buttonContainer}>
					<CustomButton onPress={submitHandler}>提交</CustomButton>
					<CustomButton onPress={switchModeHandler}>
						切換到{isLogin ? "報名" : "登錄"}
					</CustomButton>
				</View>
				<PasswordReset>忘記密碼了嗎? 點擊這裡!</PasswordReset>
				{isLoading && <Loading />}
			</View>
		</Background>
	);
}

Auth.defaultProps = {
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
		flex: 1,
	},
	input: {
		borderWidth: 2,
		padding: 10,
		margin: 10,
		fontSize: 14,
	},
});
