import axios from "axios";
import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../constants/Colors";

import * as authActions from "../store/actions/auth";
import Background from "./Background";
import CustomButton from "./CustomButton";
import Logo from "./Logo";

export default function VerifyEmail() {
	const idToken = useSelector((state) => state.auth.idToken);
	const [attempts, setAttempts] = useState(0);

	const dispatch = useDispatch();

	const sendEmailHandler = async () => {
		try {
			const response = await axios.post(
				"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBGB5fNb0pgtMfj4ZrnFxgD1-LryeSnQMo",
				{
					requestType: "VERIFY_EMAIL",
					idToken: idToken,
				}
			);

			Alert.alert("An email verification link has been sent!");
		} catch (err) {
			let message = "Could not send your verification email.";
			if (err.response) {
				switch (err.response.data.error.message) {
					case "INVALID_ID_TOKEN":
						message =
							"Your ID token is invalid. Please sign in again to revalidate it.";
					case "USER_NOT_FOUND":
						message = "User not found.";
					case "TOO_MANY_ATTEMPTS_TRY_LATER":
						message = "Too many attempts. Please try again later.";
				}
			}
			Alert.alert("Error sending your email", message);
		}

		if (attempts === 3) {
			// Second time failing
			Alert.alert(
				"Still not working?",
				"Check that your email is correct on the next page."
			);
		}
		setAttempts((state) => state + 1);
	};

	const verifyHandler = async () => {
		try {
			const verify = await axios.post(
				"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBGB5fNb0pgtMfj4ZrnFxgD1-LryeSnQMo",
				{
					idToken: idToken,
				}
			);

			const emailVerified = verify.data.users[0].emailVerified;
			if (emailVerified === false) {
				Alert.alert("Oops. You haven't verified yet!");
				return;
			}

			dispatch(authActions.setEmailVerified(emailVerified));
		} catch (err) {
			let message = "Unable to verify you.";
			if (err.response) {
				switch (err.response.data.error.message) {
					case "INVALID_ID_TOKEN":
						message =
							"Your ID token is invalid. Please sign in again to revalidate it.";
					case "USER_NOT_FOUND":
						message = "User not found.";
				}
			}
			Alert.alert("Error verifying your email", message);
		}
		setAttempts(0);
	};

	return (
		<Background>
			<View style={styles.container}>
				<Logo />
				<Text style={styles.heading}>Your email is unverified!</Text>
				<Text style={styles.body}>
					Click SEND EMAIL to receive your verification link and I'VE
					VERIFIED once finished.
				</Text>
				<View style={styles.buttonContainer}>
					<CustomButton onPress={sendEmailHandler}>
						Send Email!
					</CustomButton>
					<CustomButton onPress={verifyHandler}>
						I've Verified!
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
	heading: {
		fontSize: 20,
		color: Colors.light,
		fontWeight: "500",
		marginBottom: 10,
	},
	body: {
		fontSize: 16,
		color: "white",
	},
});
