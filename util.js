import axios from "axios";

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
		switch (err.response.data.error.message) {
			case "EMAIL_EXISTS":
				console.log("Email already exists.");
				break;
			case "INVALID_PASSWORD":
				console.log("Invalid password.");
				break;
			case "USER_DISABLED":
				console.log("User has been disabled.");
				break;
			case "TOO_MANY_ATTEMPTS_TRY_LATER":
				console.log("Too many attempts.");
			default:
				console.log(err.message);
		}
	}
};

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
		switch (err.response.data.error.message) {
			case "EMAIL_NOT_FOUND":
				console.log("Email does not exist.");
				break;
			case "INVALID_PASSWORD":
				console.log("Invalid password.");
				break;
			case "USER_DISABLED":
				console.log("User has been disabled.");
				break;
			default:
				console.log(err.message);
		}
	}
};
