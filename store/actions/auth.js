import axios from "axios";

export const SIGNIN = "SIGNIN";
export const SIGNUP = "SIGNUP";
export const SET_ROLE = "SET_ROLE";
export const LOGOUT = "LOGOUT";

// Signup using Firebase's REST authentication API
export const signUp = (email, password, pushToken) => {
	return async (dispatch) => {
		try {
			const response = await axios.post(
				"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBGB5fNb0pgtMfj4ZrnFxgD1-LryeSnQMo",
				{
					email: email,
					password: password,
					returnSecureToken: true,
				},
				{
					"Content-Type": "application/json",
				}
			);

			const idToken = response.data.idToken;
			const userId = response.data.localId;

			await sendToDatabase(false, userId, idToken, pushToken);

			dispatch({
				type: SIGNUP,
				idToken: idToken,
				userId: userId,
				email: email,
			});
		} catch (err) {
			let message = "There was an error handling your credentials";
			switch (err.response.data.error.message) {
				case "EMAIL_EXISTS":
					message = "Email already exists.";
					break;
				case "INVALID_PASSWORD":
					message = "Invalid password.";
					break;
				case "USER_DISABLED":
					message = "User has been disabled.";
					break;
				case "TOO_MANY_ATTEMPTS_TRY_LATER":
					message = "Too many attempts.";
					break;
				case "WEAK_PASSWORD : Password should be at least 6 characters":
					message = "Password should be at least 6 characters.";
					break;
			}
			throw new Error(message);
		}
	};
};

// Sign in using Firebase's REST authentication API
export const signIn = (email, password, pushToken) => {
	return async (dispatch) => {
		try {
			const response = await axios.post(
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBGB5fNb0pgtMfj4ZrnFxgD1-LryeSnQMo",
				{
					email: email,
					password: password,
					returnSecureToken: true,
				},
				{
					"Content-Type": "application/json",
				}
			);

			const idToken = response.data.idToken;
			const userId = response.data.localId;

			const role = await sendToDatabase(true, userId, idToken, pushToken);
			dispatch({
				type: SET_ROLE,
				role: role,
			});

			dispatch({
				type: SIGNIN,
				idToken: idToken,
				userId: userId,
				email: email,
			});
		} catch (err) {
			let message = "There was an error handling your credentials";
			switch (err.response.data.error.message) {
				case "EMAIL_NOT_FOUND":
					message = "Email does not exist.";
					break;
				case "INVALID_PASSWORD":
					message = "Invalid password.";
					break;
				case "USER_DISABLED":
					message = "User has been disabled.";
					break;
			}
			throw new Error(message);
		}
	};
};

export const logout = () => {
	return {
		type: LOGOUT,
	};
};

const sendToDatabase = async (isLogin, userId, idToken, pushToken) => {
	// User's role status (e.g. user, admin)
	let role;

	try {
		if (userId && idToken) {
			const loginResponse = await axios.get(
				`https://nytec-practice-default-rtdb.firebaseio.com/users/${userId}.json?auth=${idToken}`
			);

			role = loginResponse.data ? loginResponse.data.role : "user";

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
