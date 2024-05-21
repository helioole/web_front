import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (params) => {
    const { data } = await axios.post('/auth/login', params);
    return data;
});

const initialState = {
    data: null,
    status: 'loading',
};

// Correctly define the slice with `reducers` instead of `reducer`
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            });
    },
});

// Selector to check if user is authenticated
export const selectIsAuth = (state) => Boolean(state.auth.data);

// Export the reducer and actions
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
