import {
    IdentityApi,
    Identity,
} from "@inquisico/ruleset-editor-api";

import configuration from "./apiConfig";

class IdentityDataService {
    private identityAPI: IdentityApi;

    constructor() {
        this.identityAPI = new IdentityApi(configuration(false));
    }

    async getIdentity(): Promise<Identity> {
        try {
            const response = await this.identityAPI.getIdentity();
            const serializableIdentity = {
                ...response,
                // Remove or convert non-serializable fields
            };
            console.log('Identity fetched:', serializableIdentity);
            return response;
            
        } catch (error) {
            console.error('Error fetching identity:', error);
            throw error;
        }
    }
}

const identityDataService = new IdentityDataService();

export default identityDataService;