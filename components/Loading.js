import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";

export default function Loading() {
	return (
		<View style={styles.container}>
			<ActivityIndicator color={Colors.complement} size="large" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: "50%",
		left: "50%",
	},
});
