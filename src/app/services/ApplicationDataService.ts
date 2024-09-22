import http from "../http-common";

class ApplicationDataService {
  getAllApplicationsByCompanyName(companyName: string): Promise<any> {
    return http.get(`/applications/${companyName}`);
  }

  getApplicationByAppId(appId: string): Promise<any> {
    return http.get(`/applicationsById/${appId}`);
  }

  createApplication(data: any): Promise<any> {
    return http.post("/applications", data);
  }

  updateApplication(data: any): Promise<any> {
    return http.post("/applicationsUpdate", data);
  }

  deleteApplication(appId: string): Promise<any> {
    return http.delete(`/applications/${appId}`);
  }
}

export default new ApplicationDataService();
