import React from "react";
import { StyleSheet, View, Text } from "react-native";

import LinkButton from "./LinkButton";

export default function ButtonList(props) {
	// Render function for home screen
	// Maps each data item to a LinkButton
	const renderButtons = () => {
		{
			return props.children.map((item) => {
				return <LinkButton item={item} />;
			});
		}
	};

	// Call renderButtons method
	return (
		<View style={styles.container}>
			{renderButtons()}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});