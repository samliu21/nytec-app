import React from "react";
import { useDispatch } from "react-redux";

import * as authActions from "../store/actions/auth";
import CustomButton from "./CustomButton";

export default function LogoutButton() {
	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(authActions.logout());
	};

	return <CustomButton onPress={logoutHandler}>注销</CustomButton>;
}

