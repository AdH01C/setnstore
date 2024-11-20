import { CompanyDetails, Identity } from "@inquisico/ruleset-editor-api";
import { SerializedError, createSlice } from "@reduxjs/toolkit";

import { fetchUserInit } from "../actions/userActions";

export interface IdentityExtended extends Identity {
  company?: CompanyDetails;
}

export type UserState = {
  dataFetched: boolean;
  isFetching: boolean;
  isError: boolean;
  error?: SerializedError;
  // identity: Identity | null;
  identity: IdentityExtended | null;
};

const initialState: UserState = {
  dataFetched: false,
  isFetching: false,
  isError: false,
  identity: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchUserInit.pending,
      (state): UserState => ({
        ...state,
        isFetching: true,
        dataFetched: false,
        isError: false,
        error: undefined,
        identity: null,
      }),
    );
    builder.addCase(
      fetchUserInit.fulfilled,
      (state, action): UserState => ({
        ...state,
        dataFetched: true,
        isFetching: false,
        identity: action.payload,
      }),
    );
    builder.addCase(fetchUserInit.rejected, (state, action) => ({
      ...state,
      dataFetched: true,
      isFetching: false,
      error: action.error,
      isError: true,
      identity: null,
    }));
  },
});

export const userReducer = userSlice.reducer;
