import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ButtonList from "../components/ButtonList";

const MainNavigatorStack = createStackNavigator();

const MainNavigator = () => {
	return (
		<MainNavigatorStack.Navigator>
			<MainNavigatorStack.Screen name="Home" component={ButtonList} />
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
