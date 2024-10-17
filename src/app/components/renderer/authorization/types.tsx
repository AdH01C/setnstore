interface AuthorizationValue {
  [entity: string]: AuthorizationDefinition;
}

interface AuthorizationDefinition {
  relations: AuthorizationRelations;
  permissions: AuthorizationPermissions;
}

interface AuthorizationRelations {
  [relation: string]: AuthorizationRelation[];
}

interface AuthorizationRelation {
  facet: string;
  relation?: string;
}

interface AuthorizationPermissions {
  [permission: string]: AuthorizationType;
}

type AuthorizationType = AuthorizationOperations | AuthorizationRule

type AuthorizationOperationType = "union" | "intersect" | "except";

interface AuthorizationOperations {
  type: AuthorizationOperationType;
  operations: AuthorizationRule[];
}

interface AuthorizationRule {
  relation: string;
  permission?: string;
}
