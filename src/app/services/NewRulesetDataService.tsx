import {
  RulesetApi,
  ID,
  RulesetWithRulesetJson,
  RulesetJson,
  RulesetSnapshot,
  RulesetSnapshotWithRulesetJson,
} from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

class RulesetDataService {
  private rulesetAPI: RulesetApi;

  constructor() {
    this.rulesetAPI = new RulesetApi(configuration(true));
  }

  async getRulesetByID(
    companyID: string,
    appID: string,
    rulesetID: string
  ): Promise<RulesetWithRulesetJson> {
    try {
      const response = await this.rulesetAPI.getRulesetById(
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

  async getRulesets(companyId: string, appId: string): Promise<Array<string>> {
    try {
      const response = await this.rulesetAPI.getRulesets(companyId, appId);
      return response;
    } catch (error) {
      console.error("Error fetching rulesets:", error);
      throw error;
    }
  }

  async createRuleset(
    companyID: string,
    appID: string,
    rulesetJson: RulesetJson
  ): Promise<ID> {
    try {
      const response = await this.rulesetAPI.createRuleset(
        companyID,
        appID,
        rulesetJson
      );
      return response;
    } catch (error) {
      console.error("Error creating ruleset:", error);
      throw error;
    }
  }

  async deleteRulesetByID(
    companyID: string,
    appID: string,
    rulesetID: string
  ): Promise<void> {
    try {
      await this.rulesetAPI.deleteRulesetById(companyID, appID, rulesetID);
    } catch (error) {
      console.error("Error deleting ruleset:", error);
      throw error;
    }
  }

  async getRulesetHistory(
    companyID: string,
    appID: string,
    rulesetID: string
  ): Promise<Array<RulesetSnapshot>> {
    try {
      const response = await this.rulesetAPI.getRulesetHistory(
        companyID,
        appID,
        rulesetID
      );
      return response;
    } catch (error) {
      console.error("Error fetching ruleset history:", error);
      throw error;
    }
  }

  async getRulesetSnapshot(
    companyID: string,
    appID: string,
    rulesetID: string,
    snapshotID: string
  ): Promise<RulesetSnapshotWithRulesetJson> {
    try {
      const response = await this.rulesetAPI.getRulesetSnapshot(
        companyID,
        appID,
        rulesetID,
        snapshotID
      );
      return response;
    } catch (error) {
      console.error("Error fetching ruleset snapshot:", error);
      throw error;
    }
  }

  async updateRuleset(
    companyID: string,
    appID: string,
    rulesetID: string,
    rulesetJson: RulesetJson
  ): Promise<void> {
    try {
      await this.rulesetAPI.updateRuleset(
        companyID,
        appID,
        rulesetID,
        rulesetJson
      );
    } catch (error) {
      console.error("Error updating ruleset:", error);
      throw error;
    }
  }
}

const rulesetDataService = new RulesetDataService();

export default rulesetDataService;
