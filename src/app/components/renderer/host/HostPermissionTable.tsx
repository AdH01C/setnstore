import { Modal, TableColumnsType, Select, Button, Table } from "antd";
import {
  methodOptions,
  getPermissionValue,
  relationOptions,
  entityTypeOptions,
} from "../util";

interface PermissionTableDataType {
  key: React.Key;
  method: string;
  permission: Requirement;
}

export const HostPermissionTable = ({
  pathData,
  updateValue,
  authData,
  ancestorEntities,
}: {
  pathData: PathValue;
  updateValue: (newValue: PathValue) => void;
  authData: AuthorizationValue;
  ancestorEntities: string[];
}) => {
  const [[path, pathProperties]] = Object.entries(pathData);

  function handleDeletePermission(method: string) {
    Modal.confirm({
      title: "Delete Permission",
      content: "Are you sure you want to delete this permission?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const newValue = { ...pathProperties };
        if (newValue && newValue.permission) {
          delete newValue.permission[method];
          updateValue({ [path]: newValue });
        }
      },
    });
  }

  function handleMethodChange(oldMethod: string, newMethod: string) {
    const newValue = { ...pathProperties };
    if (newValue && newValue.permission) {
      newValue.permission[newMethod] = newValue.permission[oldMethod];
      delete newValue.permission[oldMethod];
      updateValue({ [path]: newValue });
    }
  }

  function handlePermissionChange(method: string, selectedPermission: string) {
    const newValue = { ...pathProperties };

    if (newValue.permission && selectedPermission === "authentication_only") {
      newValue.permission[method] = {};
    }

    if (newValue.permission && selectedPermission === "public_access") {
      newValue.permission[method] = null;
    }

    if (
      newValue.permission &&
      selectedPermission === "authentication_and_authorization"
    ) {
      newValue.permission[method] = { entity: "", type: "" };
    }
    updateValue({ [path]: newValue });
  }

  function handleEntitySettingsChange(method: string, entity: string) {
    const newValue = { ...pathProperties };
    if (
      newValue.permission &&
      typeof newValue.permission[method] === "object"
    ) {
      const requirement = newValue.permission[method] as Requirement;

      if (requirement !== null && "entity" in requirement) {
        requirement.entity = entity;
        requirement.type = "";
        updateValue({ [path]: newValue });
      }
    }
  }

  function handleTypeSettingsChange(method: string, type: string) {
    const newValue = { ...pathProperties };
    if (
      newValue.permission &&
      typeof newValue.permission[method] === "object"
    ) {
      const requirement = newValue.permission[method] as Requirement;

      if (requirement !== null && "type" in requirement) {
        requirement.type = type;
        updateValue({ [path]: newValue });
      }
    }
  }

  const dataSource: PermissionTableDataType[] =
    pathProperties && pathProperties.permission
      ? Object.entries(pathProperties.permission).map(
          ([method, requirement]) => ({
            key: method,
            method: method,
            permission: requirement,
          })
        )
      : [];

  const columns: TableColumnsType<PermissionTableDataType> = [
    {
      title: "Method",
      dataIndex: "method",
      render: (method, record) => {
        return (
          <Select
            value={method}
            onChange={(newMethod) => {
              handleMethodChange(record.method, newMethod);
            }}
          >
            {pathProperties.permission &&
              methodOptions(Object.keys(pathProperties.permission))}
          </Select>
        );
      },
    },
    {
      title: "Permission",
      dataIndex: "permission",
      render: (permission, record) => {
        return (
          <Select
            defaultValue={getPermissionValue(permission)}
            onChange={(selectedPermissionType) => {
              handlePermissionChange(record.method, selectedPermissionType);
            }}
          >
            <Select.Option value="authentication_only">
              Only Authentication
            </Select.Option>
            <Select.Option value="public_access">Public Access</Select.Option>
            <Select.Option value="authentication_and_authorization">
              Both Authentication and Authorization
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: "Settings",
      dataIndex: "permission",
      render: (permission, record) => {
        if (permission && "entity" in permission && "type" in permission) {
          return (
            <>
              <Select
                defaultValue={
                  permission && "entity" in permission ? permission.entity : ""
                }
                onChange={(selectedEntity) =>
                  handleEntitySettingsChange(record.method, selectedEntity)
                }
                placeholder="Entity"
              >
                {relationOptions(ancestorEntities)}
              </Select>
              <Select
                value={
                  permission && "type" in permission ? permission.type : ""
                }
                onChange={(selectedType) =>
                  handleTypeSettingsChange(record.method, selectedType)
                }
                placeholder="Permission"
              >
                {entityTypeOptions(authData, permission.entity)}
              </Select>
            </>
          );
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          type="text"
          danger
          onClick={() => {
            handleDeletePermission(record.method);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table<PermissionTableDataType>
      pagination={false}
      dataSource={dataSource}
      columns={columns}
    />
  );
};
