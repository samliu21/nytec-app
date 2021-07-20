import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../constants/Colors";

import * as authActions from "../store/actions/auth";

export default function Account() {
	const email = useSelector((state) => state.auth.email);

	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(authActions.logout());
	};

	return (
		<View style={styles.container}>
			<Text>You are logged in as {email}.</Text>
			<Button
				title="Logout"
				onPress={logoutHandler}
				color={Colors.primary}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
	},
});
