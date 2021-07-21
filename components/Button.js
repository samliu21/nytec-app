import React from "react";
import {
	StyleSheet,
	Image,
	Linking,
	Alert,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

import Colors from "../constants/Colors";
import { buttonWidth, horizontalMargin } from "../constants/Sizes";

export default function Button(props) {
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
			{/* <Text style={styles.name}>{item.name}</Text>
			<Text style={styles.name}>{item.url ? "Link" : "Nav"}</Text> */}
			<Image source={item.image} style={styles.image} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.primary,
		width: buttonWidth,
		aspectRatio: 1,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		margin: horizontalMargin,
	},
	image: {
		width: "100%",
		height: "100%",
	},
});
