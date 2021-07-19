import { SET_TOKEN } from "../actions/notification";

const initialState = {
	pushToken: null,
};

export default reducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_TOKEN:
			return {
				...state,
				pushToken: action.token,
			};
		default:
			return state;
	}
};
