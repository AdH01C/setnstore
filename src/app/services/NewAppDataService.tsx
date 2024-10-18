import {
  App,
  AppDetails,
  AppDetailsWithID,
  ApplicationApi,
  ID,
} from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

const appAPI = new ApplicationApi(configuration);

class ApplicationDataService {
  async getApplicationByAppID(
    companyID: string,
    appID: string
  ): Promise<AppDetailsWithID> {
    try {
      const response = await appAPI.getApplicationById(companyID, appID);
      const appDetailsWithID: AppDetailsWithID = { ...response, id: appID };
      return appDetailsWithID;
    } catch (error) {
      console.error("Error fetching application by ID:", error);
      throw error;
    }
  }

  async createApplication(companyID: string, app: App): Promise<ID> {
    try {
      const response = await appAPI.createApplication(companyID, app);
      const appDetailsWithID: AppDetailsWithID =
        await this.getApplicationByAppID(companyID, response.id);
      return appDetailsWithID;
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  }

  async deleteApplication(companyId: string, appId: string): Promise<void> {
    try {
      await appAPI.deleteApplication(companyId, appId);
    } catch (error) {
      console.error("Error deleting application:", error);
      throw error;
    }
  }

  async getApplicationById(
    companyId: string,
    appId: string
  ): Promise<AppDetails> {
    try {
      const response = await appAPI.getApplicationById(companyId, appId);
      return response;
    } catch (error) {
      console.error("Error fetching application by ID:", error);
      throw error;
    }
  }

  async getApplications(companyId: string): Promise<Array<AppDetailsWithID>> {
    try {
      const response = await appAPI.getApplications(companyId);
      return response;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  }

  async updateApplication(
    appId: string,
    companyId: string,
    app: App
  ): Promise<void> {
    try {
      await appAPI.updateApplication(appId, companyId, app);
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  }
}

export default new ApplicationDataService();
