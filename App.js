import React from "react";
import { StyleSheet, View, Text } from "react-native";

import data from "./data/data";
import LinkButton from "./components/LinkButton";

export default function App() {
	// Render function for home screen
	// Maps each data item to a LinkButton
	const renderButtons = () => {
		{
			return data.map((item) => {
				return <LinkButton item={item} />;
			});
		}
	};

	return (
		<View style={styles.container}>
			<Text>Hello!</Text>
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
