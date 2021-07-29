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

import { buttonWidth, horizontalMargin, smallFontSize } from "../constants/Sizes";

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
			Alert.alert("錯誤", "無法打開網址", [{ text: "Ok" }]);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.touchable} onPress={clickHandler}>
				<Image source={item.image} style={styles.image} />
			</TouchableOpacity>
			<Text style={styles.name}>{item.name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: horizontalMargin,
		width: buttonWidth,
		alignItems: "center",
		marginBottom: "3%",
	},
	touchable: {
		width: "100%",
		aspectRatio: 1,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	name: {
		textAlign: "center",
		color: "white",
		fontWeight: "bold",
		fontSize: smallFontSize,
		marginTop: 6,
	},
});
