import React from "react";
import { StyleSheet, View, Text } from "react-native";

import LinkButton from "./LinkButton";
import data from "../data/data";

export default function ButtonList(props) {
	let items = props.route.params ? props.route.params.children : data.children;

	// Render function for home screen
	// Maps each data item to a LinkButton
	const renderButtons = () => {
		{
			return items.map((item) => {
				return <LinkButton item={item} key={item.id} />;
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