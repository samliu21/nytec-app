import React from "react";
import {
	StyleSheet,
	Image,
	Linking,
	Alert,
	TouchableOpacity,
	Text,
	View,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

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
		<View>
			<TouchableOpacity style={styles.touchable} onPress={clickHandler}>
				<Image source={item.image} style={styles.image} />
			</TouchableOpacity>
			<Text style={styles.name}>{item.name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	touchable: {
		marginHorizontal: horizontalMargin,
		width: buttonWidth,
		aspectRatio: 1,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	name: {
		textAlign: "center",
		marginBottom: 10,
		color: "white",
		fontWeight: "bold",
	},
});
