import { ID, User, UserApi, UserDetails } from "@inquisico/ruleset-editor-api";
import configuration from "./apiConfig";

class UserDataService {
  private userAPI: UserApi;

  constructor() {
    this.userAPI = new UserApi(configuration);
  }

  async createUser(user: User): Promise<ID> {
    try {
      const response = await this.userAPI.createUser(user);
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserDetails> {
    try {
      const response = await this.userAPI.getUserById(userId);
      return response;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<UserDetails> {
    try {
      const response = await this.userAPI.getUserByUsername(username);
      return response;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async updateUser(userId: string, user: User): Promise<void> {
    try {
      await this.userAPI.updateUser(userId, user);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

const userDataService = new UserDataService();

export default userDataService;
