import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function Input(props) {
	return (
		<TextInput
			{...props}
			autoCapitalize="none"
			style={styles.input}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 2,
		padding: 10,
		margin: 10,
		fontSize: 14,
	},
})
