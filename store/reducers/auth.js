import {
	SET_ROLE,
	LOGOUT,
	AUTO_LOGIN,
	AUTHENTICATE,
	SET_EMAIL_VERIFIED,
} from "../actions/auth";

const initialState = {
	idToken: null,
	userId: null,
	role: null,
	email: null,
	emailVerified: false,
};

export default reducer = (state = initialState, action) => {
	switch (action.type) {
		case AUTHENTICATE:
			return {
				...state,
				idToken: action.idToken,
				userId: action.userId,
				email: action.email,
			};
		case SET_ROLE:
			return {
				...state,
				role: action.role,
			};
		case LOGOUT:
			return initialState;
		case AUTO_LOGIN:
			return {
				...state,
				idToken: action.idToken,
				userId: action.userId,
				email: action.email,
				role: action.role,
				emailVerified: action.emailVerified,
			};
		case SET_EMAIL_VERIFIED:
			return {
				...state,
				emailVerified: action.emailVerified,
			};
		default:
			return state;
	}
};
