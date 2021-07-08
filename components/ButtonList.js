import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, FlatList, Dimensions } from "react-native";

import LinkButton from "./LinkButton";
import data from "../data/data";

const width = Dimensions.get("window").width;

export default function ButtonList(props) {
	let items = props.route.params
		? props.route.params.children
		: data.children;

	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: props.route.params
				? props.route.params.name
				: data.name,
		});
	});

	// Render function for home screen
	// Maps each data item to a LinkButton
	const renderButton = (button) => {
		return <LinkButton item={button.item} key={button.item.id} />;
	};

	// Call renderButtons method
	// return <View style={styles.container}>{renderButtons()}</View>;
	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={items}
				renderItem={renderButton}
				keyExtractor={(item) => item.id}
				numColumns={3}
				contentContainerStyle={styles.flatList}
				columnWrapperStyle={styles.rowStyle}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	// The whole screen
	container: {
		width: "100%",
		height: "100%",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	// The whole FlatList
	flatList: {
		justifyContent: "center",
		width: "100%",
		// borderWidth: 10,
		marginTop: "5%",
	},
	// Each row in the FlatList
	rowStyle: { 
		// alignItems: "center", 
		// justifyContent: "center",
	},
});
