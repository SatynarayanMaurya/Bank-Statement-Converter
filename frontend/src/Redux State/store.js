import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/UserSlice"

export const store = configureStore({
    reducer:{
        user:userSlice
    }
})