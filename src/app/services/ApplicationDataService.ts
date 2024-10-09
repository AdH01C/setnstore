import http from "@/app/http-common";

class ApplicationDataService {
  getAllApplicationsByCompanyId(companyId: string): Promise<any> {
    return http.get(`/v0/company/${companyId}/applications`);
  }

  getApplicationByAppId(companyId: string, appId: string): Promise<any> {
    return http.get(`/v0/company/${companyId}/applications/${appId}`);
  }

  createApplication(data: any, companyId: string): Promise<any> {
    return http.post(`/v0/company/${companyId}/applications`, data);
  }

  updateApplication(data: any): Promise<any> {
    return http.post("/applicationsUpdate", data);
  }

  deleteApplication(companyId: string, appId: string): Promise<any> {
    return http.delete(`/v0/company/${companyId}/applications/${appId}`);
  }
}

const applicationDataService = new ApplicationDataService();
export default applicationDataService;
