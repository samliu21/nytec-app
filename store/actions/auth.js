import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AUTHENTICATE = "AUTHENTICATE";
export const SIGNIN = "SIGNIN";
export const SIGNUP = "SIGNUP";
export const SET_ROLE = "SET_ROLE";
export const LOGOUT = "LOGOUT";
export const AUTO_LOGIN = "AUTO_LOGIN";
export const SET_EMAIL_VERIFIED = "SET_EMAIL_VERIFIED";

// Auto logout timer (upon token expiry)
let timer;

export const setEmailVerified = (value) => {
	return async (dispatch) => {
		dispatch({
			type: SET_EMAIL_VERIFIED,
			emailVerified: value,
		});
	};
};

const authenticate = (idToken, userId, email, role, expiresIn) => {
	return async (dispatch) => {
		try {
			const verify = await axios.post(
				"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBGB5fNb0pgtMfj4ZrnFxgD1-LryeSnQMo",
				{
					idToken: idToken,
				}
			);

			const emailVerified = verify.data.users[0].emailVerified;

			dispatch(setEmailVerified(emailVerified));
		} catch (err) {
			console.log(err.message);
		}

		dispatch({
			type: AUTHENTICATE,
			idToken: idToken,
			userId: userId,
			email: email,
		});

		dispatch({
			type: SET_ROLE,
			role: role,
		});

		dispatch(setLogoutTimer(expiresIn));
	};
};

// Signup using Firebase's REST authentication API
export const signUp = (response, pushToken) => {
	return async (dispatch) => {
		try {
			const idToken = response.data.idToken;
			const userId = response.data.localId;
			const email = response.data.email;
			const expirationTime = response.data.expiresIn;
			const expiresIn = +expirationTime * 1000;

			const expirationDate = new Date(
				new Date().getTime() + expiresIn
			).toISOString();

			const role = await sendToDatabase(
				false,
				userId,
				idToken,
				pushToken,
				email,
				expirationDate
			);

			dispatch(authenticate(idToken, userId, email, role, expiresIn));
		} catch (err) {
			console.log(err.message);
		}
	};
};

// Sign in using Firebase's REST authentication API
export const signIn = (response, pushToken) => {
	return async (dispatch) => {
		try {
			const idToken = response.data.idToken;
			const userId = response.data.localId;
			const email = response.data.email;
			const expirationTime = response.data.expiresIn;
			const expiresIn = +expirationTime * 1000;

			const expirationDate = new Date(
				new Date().getTime() + expiresIn
			).toISOString();

			const role = await sendToDatabase(
				true,
				userId,
				idToken,
				pushToken,
				email,
				expirationDate
			);

			dispatch(authenticate(idToken, userId, email, role, expiresIn));
		} catch (err) {
			console.log(err.message);
		}
	};
};

const setLogoutTimer = (expirationTime) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout());
		}, expirationTime);
	};
};

const clearTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};

// Logout (clear redux state)
export const logout = () => {
	AsyncStorage.removeItem("userData");
	clearTimer();

	return {
		type: LOGOUT,
	};
};

// Auth login
export const autoLogin = (idToken, userId, email, role) => {
	return {
		type: AUTO_LOGIN,
		idToken: idToken,
		userId: userId,
		email: email,
		role: role,
	};
};

const sendToDatabase = async (
	isLogin,
	userId,
	idToken,
	pushToken,
	email,
	expirationDate
) => {
	// User's role status (e.g. user, admin)
	let role;

	try {
		if (userId && idToken) {
			const loginResponse = await axios.get(
				`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`
			);

			role = loginResponse.data ? loginResponse.data.role : "user";

			// Save data to local storage
			AsyncStorage.setItem(
				"userData",
				JSON.stringify({
					idToken: idToken,
					userId: userId,
					email: email,
					role: role,
					expirationDate: expirationDate,
				})
			);

			if (!loginResponse.data && !isLogin) {
				await axios.put(
					`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`,
					{
						role: "user",
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
			}
		}
	} catch (err) {
		// Error will be thrown if role already exists
		console.log(err.message);
	}

	try {
		// If push token and user id exist, fetch current token list and append new token if not already in the list
		if (pushToken && userId && idToken) {
			const response = await axios.get(
				`https://nytec-practice-default-rtdb.firebaseio.com/tokens/${userId}.json?auth=${idToken}`
			);

			const tokens = response.data ? response.data.tokens : null;

			if (!tokens || !tokens.includes(pushToken)) {
				const updatedTokenList = tokens ? tokens : [];
				updatedTokenList.push(pushToken);

				await axios.put(
					`https://nytec-practice-default-rtdb.firebaseio.com/tokens/${userId}.json?auth=${idToken}`,
					{
						tokens: updatedTokenList,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
			}
		}
	} catch (err) {
		console.log(err.message);
		Alert.alert("Error handling your credentials");
	}

	return role;
};
