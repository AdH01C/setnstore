import { TableColumnsType, Select, Button, Table, Input } from "antd";
import {
  getAuthorizationTypeValue,
  getAuthorizationTypeObject,
  isAuthorizationOperations,
  getAuthorizationOperationValue,
  getAuthorizationOperationObject,
  relationOptions,
  isAuthorizationRule,
} from "../util";

interface AuthPermissionTableDataType {
  key: React.Key;
  permission: string;
  type: AuthorizationType;
}

export const AuthPermissionTable = ({
  authData,
  updateValue,
}: {
  authData: AuthorizationDefinition;
  updateValue: (newValue: AuthorizationPermissions) => void;
}) => {
  const permissionData = authData.permissions;
  const relationsData = authData.relations;

  function handleAddPermission() {
    const newPermissions = {
      ...permissionData,
    };
    newPermissions[`new-permission-${Object.keys(newPermissions).length + 1}`] =
      {
        type: "noop",
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

    (newPermissions[permission] as AuthorizationRule) =
      getAuthorizationTypeObject(
        "single",
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
      getAuthorizationOperationObject(selectedRelations);
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
          >
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="noop">Noop</Select.Option>
            <Select.Option value="union">Union</Select.Option>
            <Select.Option value="intersect">Intersect</Select.Option>
            <Select.Option value="except">Except</Select.Option>
          </Select>
        );
      },
    },
    {
      title: "Settings",
      render: (_, record) => {
        if (isAuthorizationOperations(record.type)) {
          return (
            <Select
              mode={"tags"}
              value={getAuthorizationOperationValue(record.type)}
              onChange={(selectedRelations) => {
                handleAuthOperationsChange(
                  record.permission,
                  selectedRelations
                );
              }}
              placeholder="Select relations"
            >
              {relationOptions(Object.keys(relationsData))}
            </Select>
          );
        }
        if (isAuthorizationRule(record.type)) {
          return (
            <Select
              value={record.type.relation}
              onChange={(selectedRelation) => {
                handleAuthRuleChange(record.permission, selectedRelation);
              }}
              placeholder="Select relation"
            >
              {relationOptions(Object.keys(relationsData))}
            </Select>
          );
        }
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
