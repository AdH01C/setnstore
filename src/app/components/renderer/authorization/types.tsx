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
  [permission: string]: AuthorizationOperations | AuthorizationOperation;
}

type AuthorizationType = "noop" | "union" | "intersect" | "except";

interface AuthorizationOperations {
  type: AuthorizationType;
  operations: AuthorizationOperation[];
}

interface AuthorizationOperation {
  relation: string;
}
