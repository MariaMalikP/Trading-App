// accountSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  username: string;
  password: string;
  logged: string;
}

const initialState: AccountState = {
  username: "",
  password: "",
  logged:"",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setLogin: (state, action: PayloadAction<string>) => {
      state.logged = action.payload;
    },
  },
});

export const { setUsername, setPassword, setLogin } = accountSlice.actions;
export default accountSlice.reducer;