import { LOGOUT, SEND_TO_REDUX } from "../actions/auth";

const initialState = {
	idToken: null,
	userId: null,
	role: null,
	email: null,
	emailVerified: false,
};

export default reducer = (state = initialState, action) => {
	switch (action.type) {
		case SEND_TO_REDUX:
			const newState = { ...state };
			for (const key in action.kwargs) {
				newState[key] = action.kwargs[key];
			}
			return newState;
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};
