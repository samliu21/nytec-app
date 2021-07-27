import React from "react";
import { TextInput, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

export default function Input(props) {
	const { style, placeholder, secureTextEntry, value, onChangeText } = props;
	const finalStyle = style ? { ...styles.input, ...style } : styles.input;

	return (
		<TextInput
			value={value}
			onChangeText={onChangeText}
			style={finalStyle}
			placeholder={placeholder}
			autoCapitalize="none"
			secureTextEntry={secureTextEntry}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		padding: 10,
		marginTop: 10,
		fontSize: 14,
		color: "black",
		backgroundColor: Colors.light,
	},
});
