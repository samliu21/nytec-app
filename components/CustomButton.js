import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

import Colors from "../constants/Colors";

export default function CustomButton(props) {
	return (
		<TouchableOpacity {...props} style={styles.container}>
			<Text style={styles.text}>{props.children.toUpperCase()}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light,
		paddingVertical: "2.5%",
		paddingHorizontal: "4%",
		width: "auto",
		alignSelf: "center",
	},
	text: {
		color: Colors.accent,
		textAlign: "center",
		fontWeight: "bold",
	},
});
