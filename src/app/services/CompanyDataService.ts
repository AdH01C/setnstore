import http from "@/app/http-common";

class CompanyDataService {

    createCompany(userId: string, data: any): Promise<any> {
        return http.post(`/user/${userId}/company`, data);
    }

    updateCompanyName(companyId: string, data: any): Promise<any> {
        return http.put(`/company/${companyId}`, data);
    }
}

const companyDataService = new CompanyDataService();
export default companyDataService;