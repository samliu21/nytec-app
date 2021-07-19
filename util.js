import axios from "axios";

// Signup using Firebase's REST authentication API
export const signUp = async (email, password) => {
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

		return response.data;
	} catch (err) {
		let message = "There was an error handling your credentials";
		console.log(err.response.data.error.message);
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

// Sign in using Firebase's REST authentication API
export const signIn = async (email, password) => {
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

		return response.data;
	} catch (err) {
		let message = "There was an error handling your credentials";
		switch (err.response.data.error.message) {
			case "EMAIL_NOT_FOUND":
				message = "Email does not exist."
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
