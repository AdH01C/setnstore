import {
  App,
  AppDetailsWithID,
  ApplicationApi,
  ID,
} from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

class ApplicationDataService {
  private appAPI: ApplicationApi;

  constructor() {
    this.appAPI = new ApplicationApi(configuration(false));
  }

  async getApplicationByID(
    companyID: string,
    appID: string
  ): Promise<AppDetailsWithID> {
    try {
      const response = await this.appAPI.getApplicationById(companyID, appID);
      const appDetailsWithID: AppDetailsWithID = { ...response, id: appID };
      return appDetailsWithID;
    } catch (error) {
      console.error("Error fetching application by ID:", error);
      throw error;
    }
  }

  async createApplication(companyID: string, app: App): Promise<ID> {
    try {
      const response = await this.appAPI.createApplication(companyID, app);
      const appDetailsWithID: AppDetailsWithID = await this.getApplicationByID(
        companyID,
        response.id
      );
      return appDetailsWithID;
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  }

  async deleteApplication(companyID: string, appID: string): Promise<void> {
    try {
      await this.appAPI.deleteApplication(companyID, appID);
    } catch (error) {
      console.error("Error deleting application:", error);
      throw error;
    }
  }

  async getApplications(companyID: string): Promise<Array<AppDetailsWithID>> {
    try {
      const response = await this.appAPI.getApplications(companyID);
      return response;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  }

  async updateApplication(
    appID: string,
    companyID: string,
    app: App
  ): Promise<void> {
    try {
      await this.appAPI.updateApplication(appID, companyID, app);
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  }
}

const applicationDataService = new ApplicationDataService();

export default applicationDataService;
