import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

export const AUTHENTICATE = "AUTHENTICATE";
export const SET_ROLE = "SET_ROLE";
export const LOGOUT = "LOGOUT";
export const AUTO_LOGIN = "AUTO_LOGIN";
export const SET_EMAIL_VERIFIED = "SET_EMAIL_VERIFIED";
export const SET_ID_TOKEN = "SET_ID_TOKEN";

// Auto logout timer (upon token expiry)
let timer;

// Firebase API key
// Safe to be public
const apiKey = Constants.manifest.extra.apiKey;

// Update data to AsyncStorage under key userData
const updateAsyncStorage = async (kwargs) => {
	const jsonData = await AsyncStorage.getItem("userData");
	const data = JSON.parse(jsonData);

	const newData = {
		...data,
		...kwargs,
	};
	AsyncStorage.setItem("userData", JSON.stringify(newData));
};

// Set idToken, userId, email, user role, and email verification status to redux
// Start the logout timer, which triggers a logout after an hour—when the idToken expires
export const sendToRedux = (idToken, userId, email, role, emailVerified) => {
	return {
		type: AUTHENTICATE,
		idToken: idToken,
		userId: userId,
		email: email,
		role: role,
		emailVerified: emailVerified,
	};
};

export const setIdToken = (idToken, refreshToken, expirationDate) => {
	return async (dispatch) => {
		updateAsyncStorage({
			idToken: idToken,
			refreshToken: refreshToken,
			expirationDate: expirationDate,
		});

		dispatch({
			type: SET_ID_TOKEN,
			idToken: idToken,
		});
	};
};

export const setEmailVerified = (val) => {
	return async (dispatch) => {
		updateAsyncStorage({
			emailVerified: val,
		});

		dispatch({
			type: SET_EMAIL_VERIFIED,
			value: val,
		});
	};
};

export const refreshIdToken = (refreshToken) => {
	return async (dispatch) => {
		try {
			const response = await axios.post(
				`https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
				{
					grant_type: "refresh_token",
					refresh_token: refreshToken,
				}
			);
			const newIdToken = response.data.id_token;
			const newRefreshToken = response.data.refresh_token;
			const expiresIn = +response.data.expires_in * 1000;

			dispatch({
				type: SET_ID_TOKEN,
				idToken: newIdToken,
			});

			const expirationDate = new Date(
				new Date().getTime() + expiresIn
			).toISOString();

			updateAsyncStorage({
				idToken: newIdToken,
				refreshToken: newRefreshToken,
				expirationDate: expirationDate,
			});

			dispatch(setLogoutTimer(expiresIn));
		} catch (err) {
			console.log(err.message);
		}
	};
};

// Gets the role and email verification status from sendToDatabase()
// Sends data to Redux
export const authenticate = (response, pushToken) => {
	return async (dispatch) => {
		try {
			const idToken = response.data.idToken;
			const userId = response.data.localId;
			const email = response.data.email;
			const expirationTime = response.data.expiresIn;
			const refreshToken = response.data.refreshToken;
			const expiresIn = +expirationTime * 1000;

			const expirationDate = new Date(
				new Date().getTime() + expiresIn
			).toISOString();

			const [role, emailVerified] = await sendToDatabase(
				userId,
				idToken,
				pushToken,
				email,
				expirationDate,
				refreshToken
			);

			dispatch(sendToRedux(idToken, userId, email, role, emailVerified));

			dispatch(setLogoutTimer(expiresIn));
		} catch (err) {
			console.log(err.message);
		}
	};
};

// When the idToken invalidates, automatically logout the user
const setLogoutTimer = (expirationTime) => {
	return async (dispatch) => {
		const userData = await AsyncStorage.getItem("userData");
		const data = JSON.parse(userData);

		timer = setTimeout(() => {
			if (data.refreshToken) {
				dispatch(refreshIdToken(data.refreshToken));
			} else {
				dispatch(logout());
			}
		}, 3000);
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

// Set the user's data in AsyncStorage and their role to be user if they are signing up
// Attempt to send push token to Firebase backend
const sendToDatabase = async (
	userId,
	idToken,
	pushToken,
	email,
	expirationDate,
	refreshToken
) => {
	// Return values
	let role;
	let emailVerified;

	try {
		if (userId && idToken) {
			// Attempt to get user role
			const loginResponse = await axios.get(
				`https://nytec-app-default-rtdb.firebaseio.com//users/${userId}.json?auth=${idToken}`
			);

			role = loginResponse.data ? loginResponse.data.role : "user";

			// Attempt to get user email verification status
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
					refreshToken: refreshToken,
				})
			);

			// If user doesn't have a role yet, set it
			if (!loginResponse.data) {
				await axios.put(
					`https://nytec-app-default-rtdb.firebaseio.com//users/${userId}.json?auth=${idToken}`,
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
		console.log(err.message);
	}

	try {
		// If push token and user id exist, fetch current token list and append new token if not already in the list
		if (pushToken && userId && idToken) {
			const response = await axios.get(
				`https://nytec-app-default-rtdb.firebaseio.com//tokens/${userId}.json?auth=${idToken}`
			);

			const tokens = response.data ? response.data.tokens : null;

			if (!tokens || !tokens.includes(pushToken)) {
				const updatedTokenList = tokens ? tokens : [];
				updatedTokenList.push(pushToken);

				await axios.put(
					`https://nytec-app-default-rtdb.firebaseio.com//tokens/${userId}.json?auth=${idToken}`,
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
	}

	return [role, emailVerified];
};
