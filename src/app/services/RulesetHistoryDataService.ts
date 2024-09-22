import http from "@/http-common";

class RulesetHistoryDataService {
    getRulesetHistories(rulesetId: string): Promise<any> {
      return http.get(`/histories/${rulesetId}`);
    }

}

export default new RulesetHistoryDataService();