import {
    ApplicationApi,
    ID,
    AppDetailsWithID,
    AppDetails
} from '@inquisico/ruleset-editor-api';

import configuration from './apiConfig';


class NewApplicationDataService {
    private applicationAPI: ApplicationApi;

    constructor() {
        this.applicationAPI = new ApplicationApi(configuration());
    }

    async getApplications(companyId: string): Promise<AppDetailsWithID[]> {
        try {
            const response = await this.applicationAPI.getApplications(companyId);
            return response;
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    async createApplication(companyId: string, application: AppDetailsWithID): Promise<ID> {
        try {
            const response = await this.applicationAPI.createApplication(companyId, application);
            return response;
        } catch (error) {
            console.error('Error creating application:', error);
            throw error;
        }
    }

    async updateApplication(companyId: string, applicationId: string, application: AppDetailsWithID): Promise<void> {
        try {
            await this.applicationAPI.updateApplication(companyId, applicationId, application);
        } catch (error) {
            console.error('Error updating application:', error);
            throw error;
        }
    }

    async deleteApplication(companyId: string, applicationId: string): Promise<void> {
        try {
            await this.applicationAPI.deleteApplication(companyId, applicationId);
        } catch (error) {
            console.error('Error deleting application:', error);
            throw error;
        }
    }
}