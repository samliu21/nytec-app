import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

export const SEND_TO_REDUX = "SEND_TO_REDUX";
export const LOGOUT = "LOGOUT";

// Auto logout timer (upon token expiry)
let timer;

// Firebase API key
// Safe to be public
const apiKey = Constants.manifest.extra.apiKey;

// Update data to AsyncStorage under key userData
export const updateAsyncStorage = async (kwargs) => {
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
export const sendToRedux = (kwargs) => {
	return {
		type: SEND_TO_REDUX,
		kwargs: kwargs,
	};
};

export const setIdToken = (
	idToken,
	refreshToken,
	expirationDate,
	expiresIn
) => {
	return async (dispatch) => { 
		// role, emailVerified, userId, email remain unchanged in AsyncStorage
		updateAsyncStorage({
			idToken: idToken,
			refreshToken: refreshToken,
			expirationDate: expirationDate,
		});

		dispatch(setLogoutTimer(expiresIn));

		dispatch(
			sendToRedux({
				idToken: idToken,
			})
		);
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

			const expirationDate = new Date(
				new Date().getTime() + expiresIn
			).toISOString();

			dispatch(
				setIdToken(
					newIdToken,
					newRefreshToken,
					expirationDate,
					expiresIn
				)
			);
		} catch (err) {
			console.log(err.message);
		}
	};
};

// When the idToken invalidates, automatically logout the user
export const setLogoutTimer = (expirationTime) => {
	return async (dispatch) => {
		clearTimer();
		timer = setTimeout(async () => {
			const userData = await AsyncStorage.getItem("userData");
			const data = JSON.parse(userData);

			if (data.refreshToken) {
				dispatch(refreshIdToken(data.refreshToken));
			} else {
				dispatch(logout());
			}
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

// Gets the role and email verification status from sendToDatabase()
// Sends data to Redux
export const authenticate = (response, pushToken) => {
	return async (dispatch) => {
		try {
			const idToken = response.data.idToken;
			const userId = response.data.localId;
			const email = response.data.email;
			const expiresIn = +response.data.expiresIn * 1000;
			const refreshToken = response.data.refreshToken;

			const expirationDate = new Date(
				new Date().getTime() + expiresIn
			).toISOString();

			// We still need to set role and emailVerified in sendToDatabase in AsyncStorage
			updateAsyncStorage({
				idToken: idToken,
				userId: userId,
				email: email,
				expirationDate: expirationDate,
				refreshToken: refreshToken,
			});

			dispatch(
				sendToRedux({
					idToken: idToken,
					userId: userId,
					email: email,
				})
			);

			dispatch(sendToDatabase(userId, idToken, pushToken));

			dispatch(setLogoutTimer(expiresIn));
		} catch (err) {
			console.log(err.message);
		}
	};
};

// Set the user's data in AsyncStorage and their role to be user if they are signing up
// Attempt to send push token to Firebase backend
const sendToDatabase = (userId, idToken, pushToken) => {
	return async (dispatch) => {
		try {
			// Attempt to get user role
			const loginResponse = await axios.get(
				`https://nytec-app-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`
			);

			const role = loginResponse.data ? loginResponse.data.role : "user";

			// Attempt to get user email verification status
			const verify = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
				{
					idToken: idToken,
				}
			);

			const emailVerified = verify.data.users[0].emailVerified;

			updateAsyncStorage({
				role: role,
				emailVerified: emailVerified,
			});

			dispatch(
				sendToRedux({
					role: role,
					emailVerified: emailVerified,
				})
			);

			// If user doesn't have a role yet, set it
			if (!loginResponse.data) {
				await axios.put(
					`https://nytec-app-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`,
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
		} catch (err) {
			console.log(err.message);
		}

		console.log(pushToken, userId, idToken);
		try {
			// If push token and user id exist, fetch current token list and append new token if not already in the list
			if (userId && idToken) {
				const response = await axios.get(
					`https://nytec-app-default-rtdb.firebaseio.com/tokens/${userId}.json?auth=${idToken}`
				);
				
				const tokens = response.data ? response.data.tokens : null;
				console.log(tokens);

				if (!tokens || !tokens.includes(pushToken)) {
					const updatedTokenList = tokens ? tokens : [];
					updatedTokenList.push(pushToken);
					console.log(updatedTokenList);

					const response = await axios.put(
						`https://nytec-app-default-rtdb.firebaseio.com/tokens/${userId}.json?auth=${idToken}`,
						{
							tokens: updatedTokenList,
						},
						{
							headers: {
								"Content-Type": "application/json",
							},
						}
					);
					console.log(response.data);
				}
			}
		} catch (err) {
			console.log(err.message);
		}
	};
};
