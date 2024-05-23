import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ page, pageSize }) => {
    const { data } = await axios.get(`/posts?page=${page}&pageSize=${pageSize}`);
    return data;
});

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => { 
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => { 
    const { data } = await axios.delete(`/posts/${id}`);
});



const initialState ={
    posts: {
        items: [],
        status: 'loading',
        page: 1,
        pageSize: 5,
        totalCount: 0, 
    },
    tags: {
        items: [],
        status: 'loading'
    },
};


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        //posts
            .addCase(fetchPosts.pending, (state) => {
                state.posts.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload.posts;
                state.posts.totalCount = action.payload.totalCount;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.posts.status = 'error';
            })
        //tags
            .addCase(fetchTags.pending, (state) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            })
            .addCase(fetchTags.rejected, (state) => {
                state.tags.items = [];
                state.tags.status = 'error';
            })
        // Delete
            .addCase(fetchRemovePost.pending, (state, action) => {
                state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
            });
    },
});

export const postsReducer = postsSlice.reducer;
