import React from "react";
import { StyleSheet, View, Text, Linking, Alert } from "react-native";

export default function LinkButton(props) {
	const item = props.item;

	// If URL can be opened, do so. If not, send an alert
	const clickHandler = async () => {
		if (item.type === "CATEGORY") {
			return;
		}

		const supported = await Linking.canOpenURL(item.url);
		if (supported) {
			Linking.openURL(item.url);
		} else {
			Alert.alert("Error", "Can't open URL", [{ text: "Ok" }]);
		}
	};

	return (
		<View style={styles.container}>
			<Text>{item.name}</Text>
			<Text onPress={clickHandler}>{item.url ?? "None"}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	}
});
