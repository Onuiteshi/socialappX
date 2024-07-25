import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {getUser, login, logout, register} from "@/auth";
import {RootState} from "@/store";
import {getAuth} from "firebase/auth";

export interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice<AuthState, {
    setUser: (state: AuthState, action: PayloadAction<User | null>) => void;
}>({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(register.rejected, (state) => {
            state.loading = false;
            state.error ='Sign up failed';
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state) => {
            state.loading = false;
            state.error ='Sign in failed';
        });
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
        });
        builder.addCase(logout.rejected, (state) => {
            state.loading = false;
            state.error ='Sign out failed';
        });
        builder.addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        });

    },
});

export const { setUser } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
