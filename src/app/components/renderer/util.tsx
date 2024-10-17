import { Select } from "antd";

export function relationOptions(relations: string[]) {
  return relations.map((relation: string, index: number) => (
    <Select.Option key={relation + index} value={relation}>
      {relation}
    </Select.Option>
  ));
}

export function authRelationOptions(relations: RelationRow[]) {
  return relations.map((relationObj: RelationRow) => {
    const selectValue = relationObj.relationName || relationObj.parentEntity;

    return {
      value: JSON.stringify({
        facet: relationObj.parentEntity,
        relation: relationObj.relationName,
      }),
      label: <span>{selectValue}</span>,
    };
  });
}

const methods = ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"];

export function methodOptions(permissions: string[]) {
  return methods
    .filter((method) => !permissions.includes(method))
    .map((method) => (
      <Select.Option key={method} value={method}>
        {method}
      </Select.Option>
    ));
}

export function entityTypeOptions(
  authData: AuthorizationValue,
  entity: string
) {
  return Object.entries(authData).map(([entityKey, authProperties]) => {
    const result = [];

    if (authProperties.permissions && entityKey === entity) {
      result.push(
        ...Object.keys(authProperties.permissions).map((type) => (
          <Select.Option key={`${entity}_${type}`} value={type}>
            {type}
          </Select.Option>
        ))
      );
    }

    if (authProperties.relations && entityKey === entity) {
      result.push(
        ...Object.keys(authProperties.relations).map((type) => (
          <Select.Option key={`${entity}_${type}`} value={type}>
            {type}
          </Select.Option>
        ))
      );
    }

    return result;
  });
}

export function getPermissionValue(requirement: Requirement) {
  if (requirement === null) {
    return "Public";
  }

  if (
    typeof requirement === "object" &&
    Object.keys(requirement).length === 0
  ) {
    return "Only Authentication";
  }

  if (
    typeof requirement === "object" &&
    "entity" in requirement &&
    "type" in requirement
  ) {
    return "Both Authentication and Authorization";
  }
  return "";
}

export function isAuthorizationOperations(
  obj: AuthorizationType
): obj is AuthorizationOperations {
  return "operations" in obj;
}

export function isAuthorizationRule(
  obj: AuthorizationType
): obj is AuthorizationRule {
  return "relation" in obj;
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getAuthorizationTypeValue(type: AuthorizationType): string {
  if (isAuthorizationOperations(type)) {
    const capitalizedType = capitalizeFirstLetter(type.type);
    return capitalizedType;
  } else if (isAuthorizationRule(type)) {
    return "Single";
  }
  return "Unknown Authorization Type";
}

export function getAuthorizationTypeObject(
  typeString: string,
  relationString: string = ""
): AuthorizationType | undefined {
  if (typeString === "single") {
    return { relation: relationString } as AuthorizationRule;
  }

  if (
    typeString === "union" ||
    typeString === "intersect" ||
    typeString === "except"
  ) {
    return {
      type: typeString,
      operations: [],
    } as AuthorizationOperations;
  }
  return undefined;
}

export function getAvailableMethod(methodList: string[]): HttpMethod | null {
  const validMethods: HttpMethod[] = [
    "GET",
    "POST",
    "PATCH",
    "PUT",
    "DELETE",
    "OPTIONS",
  ];

  for (const method of validMethods) {
    if (!methodList.includes(method)) {
      return method as HttpMethod;
    }
  }

  return null;
}

export interface RelationRow {
  parentEntity: string;
  relationName: string;
  relatedEntity: AuthorizationRelation[];
}

export interface PermissionRow {
  parentEntity: string;
  permissionName: string;
}
