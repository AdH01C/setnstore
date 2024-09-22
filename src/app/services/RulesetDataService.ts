import http from "@/app/http-common";

class RulesetDataService {
  getRulesetByAppId(appId: string): Promise<any> {
    return http.get(`/ruleset/${appId}`);
  }

  getRulesetByRulesetId(rulesetId: string): Promise<any> {
    return http.get(`/rulesetByRulesetId/${rulesetId}`);
  }

  createRuleset(data: any, companyName: string, appId: string): Promise<any> {
    return http.post(
      `/v0/company/${companyName}/applications/${appId}/rulesets`,
      data
    );
  }

  updateRuleset(data: any): Promise<any> {
    return http.post("/rulesetsUpdate", data);
  }

  deleteRulesetByAppId(appId: string): Promise<any> {
    return http.delete(`/rulesets/${appId}`);
  }

  deleteRulesetByRulesetId(rulesetId: string): Promise<any> {
    return http.delete(`/rulesetByRulesetId/${rulesetId}`);
  }
}

export default new RulesetDataService();
