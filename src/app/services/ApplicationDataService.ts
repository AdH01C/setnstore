import http from "@/app/http-common";

class ApplicationDataService {
  getAllApplicationsByCompanyName(companyName: string): Promise<any> {
    return http.get(`/v0/company/${companyName}/applications`);
  }

  getApplicationByAppId(companyName: string, appId: string): Promise<any> {
    return http.get(`/v0/company/${companyName}/applications/${appId}`);
  }

  createApplication(data: any, companyName: string): Promise<any> {
    return http.post(`/v0/company/${companyName}/applications`, data);
  }

  updateApplication(data: any): Promise<any> {
    return http.post("/applicationsUpdate", data);
  }

  deleteApplication(companyName: string, appId: string): Promise<any> {
    return http.delete(`/v0/company/${companyName}/applications/${appId}`);
  }
}

const applicationDataService = new ApplicationDataService();
export default applicationDataService;
