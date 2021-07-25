import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

export const AUTHENTICATE = "AUTHENTICATE";
export const SIGNIN = "SIGNIN";
export const SIGNUP = "SIGNUP";
export const SET_ROLE = "SET_ROLE";
export const LOGOUT = "LOGOUT";
export const AUTO_LOGIN = "AUTO_LOGIN";
export const SET_EMAIL_VERIFIED = "SET_EMAIL_VERIFIED";

// Auto logout timer (upon token expiry)
let timer;

// Set whether the user's state is verified
export const setEmailVerified = (value) => {
	return async (dispatch) => {
		dispatch({
			type: SET_EMAIL_VERIFIED,
			emailVerified: value,
		});
	};
};

// Check whether the user's account is verified
// Dispatch state to redux
const authenticate = (idToken, userId, email, role, expiresIn) => {
	return async (dispatch) => {
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

			const [role, emailVerified] = await sendToDatabase(
				false,
				userId,
				idToken,
				pushToken,
				email,
				expirationDate
			);

			dispatch(setEmailVerified(emailVerified));

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

			const [role, emailVerified] = await sendToDatabase(
				true,
				userId,
				idToken,
				pushToken,
				email,
				expirationDate
			);

			dispatch(setEmailVerified(emailVerified));

			dispatch(authenticate(idToken, userId, email, role, expiresIn));
		} catch (err) {
			console.log(err.message);
		}
	};
};

// When the idToken invalidates, automatically logout the user
const setLogoutTimer = (expirationTime) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout());
		}, expirationTime);
	};
};

// If the user manually logs out, clear the logout timer
const clearTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};

// Clear redux state and remove any storage in AsyncStorage
export const logout = () => {
	AsyncStorage.removeItem("userData");
	clearTimer();

	return {
		type: LOGOUT,
	};
};

// Auto login if data can be found with the userData key
export const autoLogin = (idToken, userId, email, role, emailVerified) => {
	return {
		type: AUTO_LOGIN,
		idToken: idToken,
		userId: userId,
		email: email,
		role: role,
		emailVerified: emailVerified,
	};
};

// Set the user's data in AsyncStorage and their role to be user if they are signing up
// Attempt to send push token to Firebase backend
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
	let emailVerified;

	try {
		if (userId && idToken) {
			const loginResponse = await axios.get(
				`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`
			);

			role = loginResponse.data ? loginResponse.data.role : "user";

			const apiKey = Constants.manifest.extra.apiKey;

			const verify = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
				{
					idToken: idToken,
				}
			);

			emailVerified = verify.data.users[0].emailVerified;

			// Save data to local storage
			AsyncStorage.setItem(
				"userData",
				JSON.stringify({
					idToken: idToken,
					userId: userId,
					email: email,
					role: role,
					emailVerified: emailVerified,
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

	return [role, emailVerified];
};
