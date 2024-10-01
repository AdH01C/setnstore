import http from "@/app/http-common";

class RulesetDataService {
  getRulesetsByAppId(companyName: string, appId: string): Promise<any> {
    return http.get(`v0/company/${companyName}/applications/${appId}/rulesets`);
  }

  async getRulesetByRulesetId(
    companyName: string,
    appId: string,
    rulesetId: string
  ): Promise<any | null> {
    try {
      const response = await http.get(
        `/v0/company/${companyName}/applications/${appId}/rulesets/${rulesetId}`
      );

      return response.data; // Return the ruleset data if found
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // Return null if ruleset is not found
      }
      throw error; // Rethrow if it's another error
    }
  }

  createRuleset(data: any, companyName: string, appId: string): Promise<any> {
    return http.post(
      `/v0/company/${companyName}/applications/${appId}/rulesets`,
      data
    );
  }

  updateRuleset(
    data: any,
    companyName: string,
    appId: string,
    rulesetId: string
  ): Promise<any> {
    return http.put(
      `v0/company/${companyName}/applications/${appId}/rulesets/${rulesetId}`,
      data
    );
  }

  deleteRulesetByAppId(appId: string): Promise<any> {
    return http.delete(`/rulesets/${appId}`);
  }

  deleteRulesetByRulesetId(rulesetId: string): Promise<any> {
    return http.delete(`/rulesetByRulesetId/${rulesetId}`);
  }
}

const rulesetDataService = new RulesetDataService();
export default rulesetDataService;
