import React, { useEffect, useState } from "react";
import { TextInput, StyleSheet } from "react-native";

export default function Input(props) {
	const { style } = props;
	const finalStyle = style ? { ...styles.input, ...style } : styles.input;

	const [propsWithoutStyle, setPropsWithoutStyle] = useState({});

	useEffect(() => {
		const temp = {};
		for (const key in props) {
			if (key !== "style") {
				temp[key] = props[key];
			}
		}
		setPropsWithoutStyle(temp);
	}, [props]);

	return (
		<TextInput
			{...propsWithoutStyle}
			autoCapitalize="none"
			style={finalStyle}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 2,
		padding: 10,
		marginTop: 15,
		fontSize: 14,
	},
});