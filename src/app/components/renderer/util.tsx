import { LabeledValue } from "antd/es/select";

export function authRelationOptions(relations: RelationRow[]): LabeledValue[] {
  return relations.map((relationObj: RelationRow) => {
    const selectValue = relationObj.relationName || relationObj.parentEntity;

    return {
      value: sortedStringify({
        facet: relationObj.parentEntity,
        relation: relationObj.relationName,
      }),
      label: <span>{relationObj.parentEntity + "->" + selectValue}</span>,
    };
  });
}

const methods = ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"];

export function methodOptions(permissions: string[]): LabeledValue[] {
  return methods
    .filter((method) => !permissions.includes(method))
    .map((method) => ({
      label: method,
      value: method,
    }));
}

export class LabelManager {
  private labelCounts: { [key: string]: number } = {};

  getUniqueLabel(type: string): string {
    if (!this.labelCounts[type]) {
      this.labelCounts[type] = 1;
      return type; // First occurrence, no need to append
    }

    this.labelCounts[type] += 1;
    return `${type} (${this.labelCounts[type]})`; // Append count to subsequent occurrences
  }
}

export function entityTypeOptions(
  authData: AuthorizationValue,
  entity: string
): LabeledValue[] {
  const options: LabeledValue[] = [];

  Object.entries(authData).forEach(([entityKey, authProperties]) => {
    if (authProperties.permissions && entityKey === entity) {
      options.push(
        ...Object.keys(authProperties.permissions).map((type) => ({
          label: type,
          value: type,
        }))
      );
    }

    if (authProperties.relations && entityKey === entity) {
      options.push(
        ...Object.keys(authProperties.relations).map((type) => ({
          label: type,
          value: type,
        }))
      );
    }
  });

  return options;
}

export function getPermissionValue(requirement: Requirement): string {
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

export function sortedStringify(obj: any): string {
  return JSON.stringify(sortObjectKeys(obj));
}

function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = sortObjectKeys(obj[key]);
        return result;
      }, {});
  } else {
    return obj; // Primitive value
  }
}