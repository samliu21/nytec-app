import React from "react";
import { StyleSheet, ImageBackground } from "react-native";

import background from "../assets/appBackground.png";

export default function Background(props) {
	return (
		<ImageBackground source={background} style={styles.background}>
			{props.children}
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
});