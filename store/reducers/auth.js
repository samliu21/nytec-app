import { SIGNUP, SIGNIN, SET_ROLE } from "../actions/auth";

const initialState = {
	idToken: null,
	userId: null,
	role: "user",
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