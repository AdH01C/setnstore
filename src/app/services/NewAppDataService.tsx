import { ApplicationApi } from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";
import { AppDetails } from "@inquisico/ruleset-editor-api";

const appAPI = new ApplicationApi(configuration);

class ApplicationDataService {
  async getApplicationByAppID(
    companyID: string,
    appID: string
  ): Promise<AppDetails> {
    try {
      const response = await appAPI.getApplicationById(companyID, appID);
      return response;
    } catch (error) {
      console.error("Error fetching application by ID:", error);
      throw error;
    }
  }

  // Add more methods
}

export default new ApplicationDataService();
