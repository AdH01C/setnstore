import http from "@/app/http-common";

class UserDataService {
  getUserByUsername(username: string): Promise<any> {
    return http.get(`/v0/user/name/${username}`);
  }

  getCompanyByUserId(username: string): Promise<any> {
    return http.get(`/v0/user/${username}/company`);
  }

  createUser(data: any): Promise<any> {
    return http.post(`/v0/user`, data);
  }

  getUserById(userId: string): Promise<any> {
    return http.get(`/v0/user/${userId}`);
  }
}

const userDataService = new UserDataService();
export default userDataService;
