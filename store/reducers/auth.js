import { SIGNUP, SIGNIN, SET_ROLE } from "../actions/auth";

const initialState = {
	idToken: null,
	userId: null,
	role: null,
};

export default reducer = (state = initialState, action) => {
	switch (action.type) {
		case SIGNUP:
			return {
				...state,
				idToken: action.idToken,
				userId: action.userId,
			}
		case SIGNIN:
			return {
				...state,
				idToken: action.idToken,
				userId: action.userId,
			}
		case SET_ROLE:
			return {
				...state,
				role: action.role,
			}
		default:
			return state;
	}
}