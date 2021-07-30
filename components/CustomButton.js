import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

import Colors from "../constants/Colors";
import { smallFontSize } from "../constants/Sizes";

export default function CustomButton(props) {
	const { style } = props;
	const containerStyle = { ...styles.container, ...style };

	return (
		<TouchableOpacity {...props} style={containerStyle}>
			<Text style={styles.text}>{props.children}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light,
		paddingVertical: "2.2%",
		paddingHorizontal: "3.3%",
		width: "auto",
		alignSelf: "center",
	},
	text: {
		color: Colors.accent,
		fontSize: smallFontSize,
		textAlign: "center",
		fontWeight: "bold",
	},
});
