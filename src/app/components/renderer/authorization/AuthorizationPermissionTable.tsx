import { TableColumnsType, Select, Button, Table, Input } from "antd";
import {
  getAuthorizationTypeValue,
  getAuthorizationTypeObject,
  isAuthorizationOperations,
  isAuthorizationRule,
  PermissionRow,
  RelationRow,
  sortedStringify,
} from "../util";

interface AuthPermissionTableDataType {
  key: React.Key;
  permission: string;
  type: AuthorizationType;
}

export const AuthPermissionTable = ({
  entity,
  authData,
  relationList,
  permissionList,
  updateValue,
}: {
  entity: string;
  authData: AuthorizationDefinition;
  relationList: RelationRow[];
  permissionList: PermissionRow[];
  updateValue: (newValue: AuthorizationPermissions) => void;
}) => {
  const permissionData = authData.permissions;

  function handleAddPermission() {
    const newPermissions = {
      ...permissionData,
    };
    newPermissions[`new-permission-${Object.keys(newPermissions).length + 1}`] =
      {
        type: "union",
        operations: [],
      };
    updateValue(newPermissions);
  }

  function handleDeletePermission(permission: string) {
    const newPermissions = {
      ...permissionData,
    };
    delete newPermissions[permission];
    updateValue(newPermissions);
  }

  function handleAuthRuleChange(permission: string, selectedRelation: string) {
    const newPermissions = {
      ...permissionData,
      [permission]: permissionData[permission],
    };

    (newPermissions[permission] as AuthorizationRule) = JSON.parse(
      selectedRelation
    ) as AuthorizationRule;

    updateValue(newPermissions);
  }

  function handleAuthOperationsChange(
    permission: string,
    selectedRelations: string[]
  ) {
    const newPermissions = {
      ...permissionData,
      [permission]: permissionData[permission],
    };

    (newPermissions[permission] as AuthorizationOperations).operations =
      selectedRelations.map((relation) => JSON.parse(relation));
    updateValue(newPermissions);
  }

  function handleAuthTypeChange(permission: string, selectedType: string) {
    const newAuthorizationObject = getAuthorizationTypeObject(selectedType);

    if (newAuthorizationObject) {
      const newPermissions: AuthorizationPermissions = {
        ...permissionData,
        [permission]: newAuthorizationObject,
      };
      updateValue(newPermissions);
    } else {
      console.warn(`Invalid selected type: ${selectedType}`);
    }
  }

  function handlePermissionNameChange(
    e: React.FocusEvent<HTMLInputElement, Element>,
    permission: string
  ) {
    const newPermissionName = e.target.value;

    if (newPermissionName === permission) {
      return;
    }

    const newPermissions = Object.keys(permissionData).reduce((acc, key) => {
      if (key === permission) {
        acc[newPermissionName] = permissionData[permission];
      } else {
        acc[key] = permissionData[key];
      }
      return acc;
    }, {} as typeof permissionData);

    updateValue(newPermissions);
  }

  function renderSettings(record: AuthPermissionTableDataType) {
    {
      const entityRelations = relationList
        .filter((authRelation) => authRelation.parentEntity === entity)
        .map((authRelation) => ({
          value: sortedStringify({
            relation: authRelation.relationName,
          }),
          label: <span>{authRelation.relationName}</span>,
        }));

      const entityPermissions = permissionList
        .filter(
          (authPermission) =>
            authPermission.parentEntity === entity &&
            authPermission.permissionName !== record.permission
        )
        .map((authPermission) => ({
          value: sortedStringify({
            relation: authPermission.permissionName,
          }),
          label: <span>{authPermission.permissionName}</span>,
        }));

      const inheritedEntity = relationList
        .filter((relationRow) => relationRow.parentEntity === entity)
        .flatMap((relationRow) =>
          relationRow.relatedEntity.map((authRelation) => ({
            facet: authRelation.facet,
            relationName: relationRow.relationName,
            ...(authRelation.relation !== undefined && {
              relation: authRelation.relation,
            }),
          }))
        );

      const resultArray = inheritedEntity.flatMap((authRelation) => {
        const inheritedRelation = relationList
          .filter((relation) => relation.parentEntity === authRelation.facet)
          .map((relation) => relation.relationName);

        const inheritedPermission = permissionList
          .filter(
            (permission) => permission.parentEntity === authRelation.facet
          )
          .map((permission) => permission.permissionName);

        const combinedValues = [...inheritedRelation, ...inheritedPermission];

        const valueLabelObjects = combinedValues.map((combinedValue) => ({
          value: sortedStringify({
            relation: authRelation.relationName,
            permission: combinedValue,
          }),
          label: authRelation.relationName + "->" + combinedValue,
        }));

        return valueLabelObjects;
      });

      if (isAuthorizationOperations(record.type)) {
        return (
          <Select
            className="w-fit min-w-[216px]"
            mode={"tags"}
            value={record.type.operations.map((authOp) =>
              sortedStringify(authOp)
            )}
            onChange={(selectedRelations) => {
              handleAuthOperationsChange(record.permission, selectedRelations);
            }}
            placeholder="Select relations"
            options={[...entityRelations, ...entityPermissions, ...resultArray]}
          />
        );
      }
      if (isAuthorizationRule(record.type)) {
        return (
          <Select
            className="w-[156px]"
            value={
              record.type &&
              sortedStringify(record.type) !== sortedStringify({ relation: "" })
                ? sortedStringify(record.type)
                : undefined
            }
            onChange={(selectedRelation) => {
              handleAuthRuleChange(record.permission, selectedRelation);
            }}
            placeholder="Select relation"
            options={[...entityRelations, ...entityPermissions, ...resultArray]}
          />
        );
      }
    }
  }

  const dataSource: AuthPermissionTableDataType[] = permissionData
    ? Object.entries(permissionData).map(([permission, type]) => ({
        key: permission,
        permission: permission,
        type: type,
      }))
    : [];

  const columns: TableColumnsType<AuthPermissionTableDataType> = [
    {
      title: "Permission",
      dataIndex: "permission",
      render: (permission, record) => {
        return (
          <Input
            defaultValue={permission}
            onBlur={(e) => handlePermissionNameChange(e, record.permission)}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: AuthorizationType, record) => {
        return (
          <Select
            value={getAuthorizationTypeValue(type)}
            onChange={(selectedType) =>
              handleAuthTypeChange(record.permission, selectedType)
            }
            options={[
              { label: "Single", value: "single" },
              { label: "Union", value: "union" },
              { label: "Intersect", value: "intersect" },
              { label: "Except", value: "except" },
            ]}
          />
        );
      },
    },
    {
      title: "Settings",
      render: (_, record) => {
        return renderSettings(record);
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          type="text"
          danger
          onClick={() => {
            handleDeletePermission(record.permission);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table<AuthPermissionTableDataType>
        pagination={false}
        dataSource={dataSource}
        columns={columns}
      />
      <Button onClick={handleAddPermission}>Add Permission</Button>
    </>
  );
};
