import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { globalSlice } from "./globalSlice";
import kategoriSlice from "./kategoriSlice";
import menuSlice from "./menuSlice";
import orderSlice from "./orderSlice";
import tableSice from "./tableSice";
import unitsSlice from "./unitsSlice";
import ingridientsSlice from "./ingridientsSlice";
import menuIngridientsSlice from "./menuIngridientsSlice";
import stockSlice from "./stockSlice";
import stockDetailSlice from "./stockDetailSlice";
import signUpSlice from "./signUpSlice";
import tokenSlice from "./tokenSlice";

const reducers = combineReducers({
    [globalSlice.name]: globalSlice.reducer,
    unitsReducer: unitsSlice,
    kategoriReducer: kategoriSlice,
    ingridientsReducer: ingridientsSlice,
    menuReducer: menuSlice,
    orderReducer: orderSlice,
    tablesReducer: tableSice,
    menuIngridientsReducer: menuIngridientsSlice,
    stockReducer: stockSlice,
    stockDetailReducer: stockDetailSlice,
    signUpReducer: signUpSlice,
    tokenReducer: tokenSlice,
});
const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
});
export default store;