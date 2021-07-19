import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import ButtonList from "../components/ButtonList";
import Test from "../components/Auth";
import Colors from "../constants/Colors";

const defaultStyle = {
	headerTintColor: Platform.OS === "ios" ? Colors.primary : "white",
	headerStyle: {
		backgroundColor: Platform.OS === "ios" ? "white" : Colors.primary,
	},
	headerTitleAlign: "center",
};

const MainNavigatorStack = createStackNavigator();

const MainNavigator = () => {
	return (
		<MainNavigatorStack.Navigator screenOptions={defaultStyle}>
			<MainNavigatorStack.Screen name="Test" component={Test} />
			<MainNavigatorStack.Screen name="List" component={ButtonList} />
		</MainNavigatorStack.Navigator>
	);
};

// Main function

export default function Navigator() {
	const role = useSelector((state) => state.auth.role);
	console.log(role);

	return (
		<NavigationContainer>
			<MainNavigator />
		</NavigationContainer>
	);
}
