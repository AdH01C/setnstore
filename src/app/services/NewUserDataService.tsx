import { ID, User, UserApi } from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

class UserDataService {
  private userAPI: UserApi;

  constructor() {
    this.userAPI = new UserApi(configuration());
  }

  async createUser(user: User): Promise<ID> {
    return this.userAPI.createUser(user)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        throw error;
      });
  }

  async getUserById(userId: string): Promise<User> {
    return this.userAPI.getUserById(userId)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error fetching user by ID:", error);
        throw error;
      });
  }

  async updateUser(userId: string, user: User): Promise<void> {
    return this.userAPI.updateUser(userId, user)
      .then(() => {
        // No response to return for void
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        throw error;
      });
  }

}

const userDataService = new UserDataService();

export default userDataService;
