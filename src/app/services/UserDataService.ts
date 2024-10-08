import http from "@/app/http-common";

class UserDataService {
  getUserByUsername(username: string): Promise<any> {
    return http.get(`/v0/user/${username}`);
  }

  getCompanyByUserId(username: string): Promise<any> {
    return http.get(`/v0/user/${username}/company`);
  }
}

const userDataService = new UserDataService();
export default userDataService;
