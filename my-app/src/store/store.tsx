
/*
npm install react-redux   
npm install @reduxjs/toolkit
*/

import accountReducer from './accountslice';

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    
    reducer: {
        account : accountReducer

    }

}
);

export type RootState =  ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
