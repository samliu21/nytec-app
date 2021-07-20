import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import ButtonList from "../components/ButtonList";
import Auth from "../components/Auth";
import Admin from "../components/Admin";
import Account from "../components/Account";
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
	);
};

// Account screen
const AccountNavigatorStack = createStackNavigator();

const AccountNavigator = () => {
	return (
		<AccountNavigatorStack.Navigator screenOptions={defaultStyle}>
			<AccountNavigatorStack.Screen name="Account" component={Account} />
		</AccountNavigatorStack.Navigator>
	);
};

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

const bottomTabBarOptions = {
	activeTintColor: Colors.primary,
	tabStyle: {
		backgroundColor: Platform.OS === "android" ? Colors.primary : "white",
	},
	labelStyle: {
		fontSize: 18,
	},
	showLabel: false,
};

const bottomTabBarScreenOptions = (navData) => ({
	tabBarIcon: (tabInfo) => {
		if (navData.route.name === "App") {
			return <Ionicons name="list" size={23} color={tabInfo.color} />;
		} else if (navData.route.name === "Account") {
			return <Ionicons name="person" size={23} color={tabInfo.color} />;
		} else {
			return <Ionicons name="key" size={23} color={tabInfo.color} />
		}
	}
});

// Main User Navigator 
const MainUserNavigatorBottomTabs = createBottomTabNavigator();

const MainUserNavigator = () => {
	return (
		<MainUserNavigatorBottomTabs.Navigator
			tabBarOptions={bottomTabBarOptions}
			screenOptions={bottomTabBarScreenOptions}
		>
			<MainUserNavigatorBottomTabs.Screen
				name="App"
				component={ButtonNavigator}
			/>
			<MainUserNavigatorBottomTabs.Screen
				name="Account"
				component={AccountNavigator}
			/>
		</MainUserNavigatorBottomTabs.Navigator>
	);
};

// Main Admin Navigator
const MainAdminNavigatorBottomTabs = createBottomTabNavigator();

const MainAdminNavigator = () => {
	return (
		<MainAdminNavigatorBottomTabs.Navigator
			tabBarOptions={bottomTabBarOptions}
			screenOptions={bottomTabBarScreenOptions}
		>
			<MainAdminNavigatorBottomTabs.Screen
				name="App"
				component={ButtonNavigator}
			/>
			<MainAdminNavigatorBottomTabs.Screen
				name="Account"
				component={AccountNavigator}
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

	return (
		<NavigationContainer>
			{!role && <AuthNavigator />}
			{role === "user" && <MainUserNavigator />}
			{role === "admin" && <MainAdminNavigator />}
		</NavigationContainer>
	);
}
