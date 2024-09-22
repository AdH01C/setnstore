import http from "@/app/http-common";

class AuthorizationSchemaDataService {
  getAuthorizationSchemaByRulesetId(rulesetId: string): Promise<any> {
    return http.get(`/authorizationSchema/${rulesetId}`);
  }

  getDefinitionsBySchemaId(schemaId: string): Promise<any> {
    return http.get(`/definitions/${schemaId}`);
  }

  getRelationsByDefinitionId(definitionId: string): Promise<any> {
    return http.get(`/relations/${definitionId}`);
  }

  getPermissionsByDefinitionId(definitionId: string): Promise<any> {
    return http.get(`/permissions/${definitionId}`);
  }

  getRelationshipsByDefinitionId(definitionId: string): Promise<any> {
    return http.get(`/relationships/${definitionId}`);
  }

  getRelationDefinitionsByDefinitionId(definitionId: string): Promise<any> {
    return http.get(`/relationDefinitions/${definitionId}`);
  }

  saveAuthorizationSchema(data: any): Promise<any> {
    return http.post("/authorizationSchemas", data);
  }

  insertAuthorizationSchemaDefinition(data: any): Promise<any> {
    return http.post("/definitions", data);
  }

  insertAuthorizationSchemaRelation(data: any): Promise<any> {
    return http.post("/relations", data);
  }

  insertAuthorizationSchemaPermission(data: any): Promise<any> {
    return http.post("/permissions", data);
  }

  insertAuthorizationSchemaRelationship(data: any): Promise<any> {
    return http.post("/relationships", data);
  }

  insertAuthorizationSchemaRelationDefinition(data: any): Promise<any> {
    return http.post("/relationDefinitions", data);
  }

  deleteAuthorizationSchema(rulesetId: string): Promise<any> {
    return http.delete(`/authorizationSchemas/${rulesetId}`);
  }

  deleteDefinitionByDefinitionId(definitionId: string): Promise<any> {
    return http.delete(`/definitions/${definitionId}`);
  }

  deleteRelationByRelationId(relationId: string): Promise<any> {
    return http.delete(`/relations/${relationId}`);
  }

  deletePermissionByPermissionId(permissionId: string): Promise<any> {
    return http.delete(`/permissions/${permissionId}`);
  }

  deleteRelationshipByIds(relationshipId: string): Promise<any> {
    return http.delete(`/relationships/${relationshipId}`);
  }

  deleteRelationDefinitionByIds(
    assignId: string,
    assignedId: string
  ): Promise<any> {
    return http.delete(`/relationDefinitions/${assignId}/${assignedId}`);
  }
}

const authorizationSchemaDataService = new AuthorizationSchemaDataService();
export default authorizationSchemaDataService;
