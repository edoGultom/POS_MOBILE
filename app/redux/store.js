import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { globalSlice } from "./globalSlice";

const reducers = combineReducers({
    [globalSlice.name]: globalSlice.reducer,
});
const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
});
export default store;