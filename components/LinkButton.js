import React from "react";
import {
	StyleSheet,
	View,
	Text,
	Linking,
	Alert,
	TouchableOpacity,
} from "react-native";

import Colors from "../constants/Colors";

export default function LinkButton(props) {
	const item = props.item;

	// Handler for when a button is clicked
	const clickHandler = async () => {
		// If item is a category, navigate to a new ButtonList screen
		if (item.type === "CATEGORY") {
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
			<Text style={styles.name}>{item.url}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 12,
		backgroundColor: Colors.primary,
		width: "70%",
		paddingVertical: 10,
		borderRadius: 15,
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
