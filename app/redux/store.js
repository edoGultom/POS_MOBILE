import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { globalSlice } from "./globalSlice";
import signUpSlice from "./signUpSlice";

const reducers = combineReducers({
    [globalSlice.name]: globalSlice.reducer
});
const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
});
export default store;