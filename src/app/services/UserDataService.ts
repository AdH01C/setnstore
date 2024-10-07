import http from "@/app/http-common";

class UserDataService {
    createUser(data: any): Promise<any> {
        return http.post(`/user`, data);
    }

    getUserById(userId: string): Promise<any> {
        return http.get(`/user/${userId}`);
    }

    getUserByUsername(username: string): Promise<any> {
        return http.get(`/user/${username}`)
    }

    updateUser(userId: string, data: any): Promise<any> {
        return http.put(`/user/${userId}`, data);
    }
}

const userDataService = new UserDataService();
export default userDataService;
