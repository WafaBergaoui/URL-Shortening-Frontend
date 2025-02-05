import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UrlState {
  shortUrl: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: UrlState = {
  shortUrl: '',
  isLoading: false,
  error: null,
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setShortUrl(state, action: PayloadAction<string>) {
      state.shortUrl = action.payload;
      state.isLoading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { startLoading, setShortUrl, setError } = urlSlice.actions;
export default urlSlice.reducer;
