import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    setUserLoading: (state, action) => {
      state.loading = !!action.payload;
    },
  },
});

export const { setUserData, setUserLoading } = userSlice.actions;
export default userSlice.reducer;