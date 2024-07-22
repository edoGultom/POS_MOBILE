import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { globalSlice } from "./globalSlice";
import kategoriSlice from "./kategoriSlice";
import menuSlice from "./menuSlice";
import orderSlice from "./orderSlice";
import tableSice from "./tableSice";

const reducers = combineReducers({
    [globalSlice.name]: globalSlice.reducer,
    kategoriReducer: kategoriSlice,
    menuReducer: menuSlice,
    orderReducer: orderSlice,
    tablesReducer: tableSice
});
const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
});
export default store;