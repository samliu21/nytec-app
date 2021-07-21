import React, { useEffect } from "react";
import {
	StyleSheet,
	SafeAreaView,
	FlatList,
	Dimensions,
	ImageBackground,
} from "react-native";

import Button from "./Button";
import { flatListWidth } from "../constants/Sizes";
import data from "../data/data";
import background from "../constants/images/appBackground.png";

const width = Dimensions.get("screen").width;

export default function ButtonList(props) {
	// When ButtonList is called initially from the navigator, it won't have props
	// If it doesn't (e.g. props.route.params is undefined), we set items to be data.children or the highest level
	// Otherwise, we access the items through props.route.params.children
	const items = props.route.params
		? props.route.params.children
		: data.children;

	// const role = useSelector((state) => state.auth.role);
	// console.log(role);

	// Sets title in the navigation bar
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
		return <Button item={button.item} key={button.item.id} />;
	};

	// Render a FlatList that becomes a grid with 3 columns
	return (
		<ImageBackground source={background} style={styles.background}>
			<SafeAreaView style={styles.container}>
				{/* <Image source={background} /> */}
				<FlatList
					data={items}
					renderItem={renderButton}
					keyExtractor={(item) => item.id}
					numColumns={3}
					contentContainerStyle={styles.flatList}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: "center",
	},
	flatList: {
		width: flatListWidth,
		marginTop: "5%",
	},
});
