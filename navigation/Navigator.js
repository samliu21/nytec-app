import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";

import ButtonList from "../components/ButtonList";
import Auth from "../components/Auth";
import Admin from "../components/Admin";
import Colors from "../constants/Colors";

// Default stack navigator header style
const defaultStyle = {
	headerTintColor: Platform.OS === "ios" ? Colors.primary : "white",
	headerStyle: {
		backgroundColor: Platform.OS === "ios" ? "white" : Colors.primary,
	},
	headerTitleAlign: "center",
};

// Auth screen
const AuthNavigatorStack = createStackNavigator();

const AuthNavigator = () => {
	return (
		<AuthNavigatorStack.Navigator screenOptions={defaultStyle}>
			<AuthNavigatorStack.Screen name="Auth" component={Auth} />
		</AuthNavigatorStack.Navigator>
	)
}

// Main app screen
const ButtonNavigatorStack = createStackNavigator();

const ButtonNavigator = () => {
	return (
		<ButtonNavigatorStack.Navigator screenOptions={defaultStyle}>
			<ButtonNavigatorStack.Screen name="List" component={ButtonList} />
		</ButtonNavigatorStack.Navigator>
	);
};

// Admin Screen
const AdminNavigatorStack = createStackNavigator();

const AdminNavigator = () => {
	return (
		<AdminNavigatorStack.Navigator screenOptions={defaultStyle}>
			<AdminNavigatorStack.Screen name="Admin" component={Admin} />
		</AdminNavigatorStack.Navigator>
	);
};

// Bottom Tab Navigator
const MainAdminNavigatorBottomTabs = createBottomTabNavigator();

const MainAdminNavigator = () => {
	return (
		<MainAdminNavigatorBottomTabs.Navigator>
			<MainAdminNavigatorBottomTabs.Screen
				name="Button"
				component={ButtonNavigator}
			/>
			<MainAdminNavigatorBottomTabs.Screen
				name="Admin"
				component={AdminNavigator}
			/>
		</MainAdminNavigatorBottomTabs.Navigator>
	);
};

// Main function
export default function Navigator() {
	const role = useSelector((state) => state.auth.role);
	console.log(role);

	return (
		<NavigationContainer>
			{!role && <AuthNavigator />}
			{role === "user" && <ButtonNavigator />}
			{role === "admin" && <MainAdminNavigator />}
		</NavigationContainer>
	);
	// return (
	// 	<NavigationContainer>
	// 		<Auth />
	// 	</NavigationContainer>
	// )
}
