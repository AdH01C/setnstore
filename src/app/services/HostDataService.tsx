import { HostApi, RulesetJson, Host } from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

class HostDataService {
  private hostAPI: HostApi;

  constructor() {
    this.hostAPI = new HostApi(configuration(false));
  }

  async getHostByRulesetID(
    companyID: string,
    appID: string,
    rulesetID: string
  ): Promise<Host> {
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

  async getRulesetByHost(
    companyId: string,
    appId: string,
    host: string
  ): Promise<RulesetJson> {
    try {
      const response = await this.hostAPI.getRulesetByHost(
        companyId,
        appId,
        host
      );
      return response;
    } catch (error) {
      console.error("Error fetching ruleset by host:", error);
      throw error;
    }
  }
}

const hostDataService = new HostDataService();

export default hostDataService;
