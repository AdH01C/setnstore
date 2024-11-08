import configuration from "./apiConfig";
import { Identity, IdentityApi } from "@inquisico/ruleset-editor-api";

export default class IdentityDataService {
  private identityAPI: IdentityApi;

  constructor() {
    this.identityAPI = new IdentityApi(configuration);
  }

  async getIdentity(): Promise<Identity> {
    try {
      const response = await this.identityAPI.getIdentity();
      return response;
    } catch (error) {
      console.error("Error fetching identity:", error);
      throw error;
    }
  }
}