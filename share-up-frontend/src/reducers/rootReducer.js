const { combineReducers } = require("redux");
const { userReducer } = require("./userReducer");

export const rootReducer = combineReducers({
    user: userReducer
})