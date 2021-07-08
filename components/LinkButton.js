import React from "react";
import {
	StyleSheet,
	Text,
	Linking,
	Alert,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

import Colors from "../constants/Colors";

const width = Dimensions.get("window").width;

export default function LinkButton(props) {
	const item = props.item;

	const navigation = useNavigation();

	// Handler for when a button is clicked
	const clickHandler = async () => {
		// If item is a category, navigate to a new ButtonList screen
		if (item.type === "CATEGORY") {
			navigation.push("List", {
				children: item.children,
				name: item.name,
			});
			return;
		}

		// If item is a link, open the link if supported
		const supported = await Linking.canOpenURL(item.url);
		if (supported) {
			Linking.openURL(item.url);
		} else {
			Alert.alert("Error", "Can't open URL", [{ text: "Ok" }]);
		}
	};

	return (
		<TouchableOpacity style={styles.container} onPress={clickHandler}>
			<Text style={styles.name}>{item.name}</Text>
			<Text style={styles.name}>{item.url ? "Link" : "Nav"}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.primary,
		width: width / 3.3,
		aspectRatio: 1,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		margin: "1%",
		padding: "2%",
	},
	link: {
		color: "white",
	},
	name: {
		textAlign: "center",
		marginBottom: 5,
		color: "white",
	},
});
