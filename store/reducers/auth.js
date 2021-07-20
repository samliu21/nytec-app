import { SIGNUP, SIGNIN, SET_ROLE, LOGOUT } from "../actions/auth";

const initialState = {
	idToken: null,
	userId: null,
	role: null,
	email: null,
};

export default reducer = (state = initialState, action) => {
	switch (action.type) {
		case SIGNUP:
			return {
				...state,
				idToken: action.idToken,
				userId: action.userId,
				email: action.email,
			}
		case SIGNIN:
			return {
				...state,
				idToken: action.idToken,
				userId: action.userId,
				email: action.email,
			}
		case SET_ROLE:
			return {
				...state,
				role: action.role,
			}
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
}