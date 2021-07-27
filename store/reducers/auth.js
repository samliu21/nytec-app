import {
	LOGOUT,
	AUTHENTICATE,
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
				role: action.role,
				emailVerified: action.emailVerified,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};
