import React from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/core";

import * as authActions from "../store/actions/auth";
import CustomButton from "./CustomButton";

export default function LogoutButton() {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const logoutHandler = () => {
		dispatch(authActions.logout());

		navigation.replace("List");
	};

	return <CustomButton onPress={logoutHandler}>登出</CustomButton>;
}
