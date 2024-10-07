import http from "@/app/http-common";

class CompanyDataService {
    getCompanyByUserId(userId: string): Promise<any> {
        return http.get(`/user/${userId}/company`);
    }

    createCompany(userId: string, data: any): Promise<any> {
        return http.post(`/user/${userId}/company`, data);
    }

    updateCompanyName(companyId: string, data: any): Promise<any> {
        return http.put(`/company/${companyId}`, data);
    }
}

const companyDataService = new CompanyDataService();
export default companyDataService;