import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ButtonList from "../components/ButtonList";
import Colors from "../constants/Colors";

const defaultStyle = {
	headerTintColor: Platform.OS === "ios" ? Colors.primary : "white",
	headerStyle: {
		backgroundColor: Platform.OS === "ios" ? "white" : Colors.primary,
	},
	headerTitleAlign: "center",
}

const MainNavigatorStack = createStackNavigator();

const MainNavigator = () => {
	return (
		<MainNavigatorStack.Navigator screenOptions={defaultStyle}>
			<MainNavigatorStack.Screen name="List" component={ButtonList} />
		</MainNavigatorStack.Navigator>
	);
};

export default function Navigator() {
	return (
		<NavigationContainer>
			<MainNavigator />
		</NavigationContainer>
	);
}
