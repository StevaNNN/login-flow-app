import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { USER } from "../../Types";
import _ from "lodash";

export interface USER_STATE {
  users: USER[];
}

const initialState: USER_STATE = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<USER_STATE["users"]>) => {
      const users = _.sortBy(action.payload, "fullName").filter(
        (user) => user.role !== "admin"
      );
      state.users = users;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;
