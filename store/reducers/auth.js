import { LOGOUT, AUTHENTICATE, SET_EMAIL_VERIFIED, SET_ID_TOKEN } from "../actions/auth";

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
				role: action.role,
				emailVerified: action.emailVerified,
			};
		case SET_EMAIL_VERIFIED:
			return {
				...state,
				emailVerified: action.value,
			};
		case SET_ID_TOKEN:
			return {
				...state,
				idToken: action.idToken,
			}
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};
