import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import authReducer from "./reducers/auth";
import notificationReducer from "./reducers/notification";

const rootReducer = combineReducers({
	auth: authReducer,
	notification: notificationReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
