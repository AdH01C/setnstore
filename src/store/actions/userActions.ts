import { ApiException, Identity, IdentityApi, UserApi } from "@inquisico/ruleset-editor-api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import configuration from "@/app/services/apiConfig";
import { redirect } from "next/navigation";

// Helper function to transform ApiException into a serializable object
function serializeApiException(e: ApiException<any>): { message: string; code?: number; body?: string } {
  return {
    message: e.message,
    code: e.code,
    body: e.body ? JSON.stringify(e.body) : undefined, // Ensure body is stringified for serialization
  };
}

export const fetchUserInit = createAsyncThunk<Identity, { isRedirect: boolean } | undefined>(
  "user/fetchUserInit",
  async ({ isRedirect } = { isRedirect: false }, thunkAPI) => {
    try {
      const identityApi = new IdentityApi(configuration(isRedirect));
      const identityRes = await identityApi.getIdentity();
      return identityRes;
    } catch (e) {
      console.log("Error code: ", (e as ApiException<any>).code);

      // Check if 404 -> create user logic
      if (e instanceof ApiException && e.code === 404) {
        const userApi = new UserApi(configuration(isRedirect));
        
        console.log("User to be created", userApi);
        // await userApi.createUser();

        // Retry fetching identity
        try {
          const identityApi = new IdentityApi(configuration(isRedirect));
          const identityRes = await identityApi.getIdentity();
          return identityRes;
        } catch (retryError) {
          return thunkAPI.rejectWithValue(serializeApiException(retryError as ApiException<any>));
        }
      }

      // Reject with a serialized version of the error
      return thunkAPI.rejectWithValue(serializeApiException(e as ApiException<any>));
    }
  },
);
