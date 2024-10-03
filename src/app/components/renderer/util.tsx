import { Select } from "antd";

const { Option } = Select;

export function relationOptions(relations: string[]) {
  return relations.map((relation: string, index: number) => (
    <Option key={relation + index} value={relation}>
      {relation}
    </Option>
  ));
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
    if (authProperties.permissions && entityKey === entity) {
      return Object.keys(authProperties.permissions).map((type) => {
        return (
          <Option key={`${entity}_${type}`} value={type}>
            {type}
          </Option>
        );
      });
    }
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
    typeString === "except" ||
    typeString === "noop"
  ) {
    return {
      type: typeString,
      operations: [],
    } as AuthorizationOperations;
  }
  return undefined;
}

export function getAuthorizationOperationValue(type: AuthorizationOperations) {
  return type.operations.map((rule: AuthorizationRule) => rule.relation);
}

export function getAuthorizationOperationObject(
  relationList: string[]
): AuthorizationRule[] {
  return relationList.map((relation) => ({
    relation: relation,
  }));
}
