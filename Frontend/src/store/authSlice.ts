import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/type";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
