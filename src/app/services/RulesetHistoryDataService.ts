import http from "@/app/http-common";

class RulesetHistoryDataService {
  getRulesetHistories(rulesetId: string): Promise<any> {
    return http.get(`/histories/${rulesetId}`);
  }
}

const rulesetHistoryDataService = new RulesetHistoryDataService();
export default rulesetHistoryDataService;
