import { HostApi } from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

class HostDataService {
  private hostAPI: HostApi;

  constructor() {
    this.hostAPI = new HostApi(configuration);
  }

  async getHostByRulesetID(
    companyID: string,
    appID: string,
    rulesetID: string
  ): Promise<string> {
    try {
      const response = await this.hostAPI.getHostByRulesetId(
        companyID,
        appID,
        rulesetID
      );
      return response;
    } catch (error) {
      console.error("Error fetching ruleset by ID:", error);
      throw error;
    }
  }
}

const hostDataService = new HostDataService();

export default hostDataService;
