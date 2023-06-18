import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchQueryChanged = createAsyncThunk(
   'search/searchQueryChanged',
   async (query) => {
      console.log(query.token, "token")
      const url = `https://api.spotify.com/v1/search`;

      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${query.access_token}`
         },
         params: {
            q: query.data,
            type: "artist"
         }
      });

      if (!response.ok) {
         throw new Error('Search request failed.');
      }

      const data = await response.json();
      return data.results;
   }
);

export const searchArtist = createAsyncThunk(
   'search/searchArtist',
   async (query) => {
      console.log(query);
      const url = `https://api.spotify.com/v1/artists/${query.artistID}/top-tracks`;

      const response = await fetch(url, {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${query.access_token}`
         },
         params: {
            limit: 10,
            market: 'US'
         }
      });

      if (!response.ok) {
         throw new Error('Search request failed.');
      }

      const data = await response.json();
      return data.results;
   }
);

const searchSlice = createSlice({
   name: 'search',
   initialState: {
      searchQuery: '',
      searchResults: [],
      status: 'idle',
      error: null,
      artistDetails: [],
   },
   reducers: {
      setSearchQuery: (state, action) => {
         state.searchQuery = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(searchQueryChanged.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(searchQueryChanged.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.searchResults = action.payload;
         })
         .addCase(searchQueryChanged.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })
         .addCase(searchArtist.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(searchArtist.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.artistDetails = action.payload;
         })
         .addCase(searchArtist.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { setSearchQuery } = searchSlice.actions;

export default searchSlice.reducer;
