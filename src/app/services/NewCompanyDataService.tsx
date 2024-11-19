import {
  Company,
  CompanyApi,
  CompanyDetails,
  ID,
} from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

class CompanyDataService {
  private companyAPI: CompanyApi;

  constructor() {
    this.companyAPI = new CompanyApi(configuration(false));
  }

  async createCompany(userId: string, company: Company): Promise<ID> {
    try {
      const response = await this.companyAPI.createCompany(userId, company);
      return response;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  }

  async getCompanyByUserId(userId: string): Promise<CompanyDetails> {
    try {
      const response = await this.companyAPI.getCompanyByUserId(userId);
      return response;
    } catch (error) {
      console.error("Error fetching company by user ID:", error);
      throw error;
    }
  }

  async updateCompanyName(companyId: string, company: Company): Promise<void> {
    try {
      await this.companyAPI.updateCompanyName(companyId, company);
    } catch (error) {
      console.error("Error updating company name:", error);
      throw error;
    }
  }
}

const companyDataService = new CompanyDataService();

export default companyDataService;
