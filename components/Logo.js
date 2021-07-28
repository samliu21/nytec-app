import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

const width = Dimensions.get("screen").width;

export default function Logo() {
	return (
		<View style={styles.imageContainer}>
			<Image
				source={require("../assets/紐神.png")}
				style={styles.image}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		width: width / 2,
		height: width / 2,
	},
	imageContainer: {
		alignItems: "center",
		marginBottom: "10%",
	},
});
