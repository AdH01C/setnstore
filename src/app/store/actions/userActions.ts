import { ApiException, CompanyApi, Identity, IdentityApi, User, UserApi } from "@inquisico/ruleset-editor-api";
import { createAsyncThunk } from "@reduxjs/toolkit";

import configuration from "@/app/constants/apiConfig";

export const fetchUserInit = createAsyncThunk<Identity, { isRedirect: boolean } | undefined>(
  "user/fetchUserInit",
  async ({ isRedirect } = { isRedirect: false }, thunkAPI) => {
    try {
      const identityApi = new IdentityApi(configuration(isRedirect));
      const identityRes = await identityApi.getIdentity();
      let companyRes;
      try {
        const companyApi = new CompanyApi(configuration(isRedirect));
        companyRes = await companyApi.getCompanyByUserId(identityRes.id);
      } catch {
        // do something?
      }

      const serializableIdentity = {
        ...identityRes,
        ...(companyRes && {
          company: companyRes
            ? {
                ...companyRes,
                createdDatetime: companyRes.createdDatetime?.toISOString(), // Convert Date to string
              }
            : null,
        }),
      };
      return serializableIdentity;
    } catch (e) {
      //check if 404 -> create user
      if (e instanceof ApiException && e.code === 404) {
        const userApi = new UserApi(configuration(isRedirect));
        await userApi.createUser(new User());
        //retry
        try {
          const identityApi = new IdentityApi(configuration(isRedirect));
          const identityRes = await identityApi.getIdentity();
          const serializableIdentity = {
            ...identityRes,
          };
          return serializableIdentity;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }

      return thunkAPI.rejectWithValue(e);
    }
  },
);
