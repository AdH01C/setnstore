import { ApiException, CompanyApi, Identity, IdentityApi, User, UserApi } from "@inquisico/ruleset-editor-api";
import { createAsyncThunk } from "@reduxjs/toolkit";

import configuration from "@/app/constants/apiConfig";

export const fetchUserInit = createAsyncThunk<Identity, { isRedirect: boolean } | undefined>(
  "user/fetchUserInit",
  async ({ isRedirect } = { isRedirect: false }, thunkAPI) => {
    try {
      // Step 1: Fetch identity data
      const identityApi = new IdentityApi(configuration(isRedirect));
      const identityRes = await identityApi.getIdentity();

      // Step 2: Fetch company data if identity exists
      let companyRes = null;
      if (identityRes) {
        try {
          const companyApi = new CompanyApi(configuration(isRedirect));
          companyRes = await companyApi.getCompanyByUserId(identityRes.id);
        } catch (e) {
          // If company fetch fails, we can return only the identity.
          if (e instanceof ApiException && e.code === 404) {
            return { ...identityRes };
          }
          return thunkAPI.rejectWithValue(e);
        }
      }

      // Step 3: Return identity with company data (if available)
      return {
        ...identityRes,
        ...(companyRes && {
          company: {
            ...companyRes,
            createdDatetime: companyRes.createdDatetime?.toISOString(), // Convert Date to string
          },
        }),
      };
    } catch (e) {
      // Step 4: Handle identity fetch failure
      if (e instanceof ApiException && e.code === 404) {
        // Create a new user if identity doesn't exist
        const userApi = new UserApi(configuration(isRedirect));
        await userApi.createUser(new User());

        // Retry fetching the newly created identity
        try {
          const identityApi = new IdentityApi(configuration(isRedirect));
          const identityRes = await identityApi.getIdentity();
          return { ...identityRes }; // Return the new identity
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }

      return thunkAPI.rejectWithValue(e);
    }
  },
);
