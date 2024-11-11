import configuration from "@/app/services/apiConfig";
import { ApiException, Identity, IdentityApi, User, UserApi } from "@inquisico/ruleset-editor-api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchUserInit = createAsyncThunk<Identity, { isRedirect: boolean } | undefined>(
  "user/fetchUserInit",
  async ({ isRedirect } = { isRedirect: false }, thunkAPI) => {
    try {
      const identityApi = new IdentityApi(configuration(isRedirect));
      const identityRes = await identityApi.getIdentity();
      return identityRes;
    } catch (e) {
      //check if 404 -> create user
      if (e instanceof ApiException && e.code === 404) {
        const userApi = new UserApi(configuration(isRedirect));
        await userApi.createUser(new User());
        //retry
        try {
          const identityApi = new IdentityApi(configuration(isRedirect));
          const identityRes = await identityApi.getIdentity();
          return identityRes;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }

      return thunkAPI.rejectWithValue(e);
    }
  },
);
