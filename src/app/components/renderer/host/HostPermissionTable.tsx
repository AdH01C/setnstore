import { Modal, TableColumnsType, Select, Button, Table } from "antd";
import {
  methodOptions,
  getPermissionValue,
  entityTypeOptions,
  getAvailableMethod,
  LabelManager,
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
  const connectedEntities = [
    ...ancestorEntities,
    ...(pathProperties && (pathProperties as EntityPathSettings).entity
      ? [(pathProperties as EntityPathSettings).entity]
      : []),
  ];

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
      const updatedPermissions: Permission = {};

      for (const key in newValue.permission) {
        if (key === oldMethod) {
          updatedPermissions[newMethod] = newValue.permission[oldMethod];
        } else {
          updatedPermissions[key] = newValue.permission[key];
        }
      }

      newValue.permission = updatedPermissions;

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

  function handleAddPermission() {
    const newValue = { ...pathProperties };
    if (!newValue.permission) {
      newValue.permission = {};
    }
    const method = getAvailableMethod(Object.keys(newValue.permission));
    if (method) {
      newValue.permission[method] = null;
      updateValue({ [path]: newValue });
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
        const usedPermission = Object.keys(pathProperties.permission || {});
        return (
          <Select
            value={method}
            onChange={(newMethod) => {
              handleMethodChange(record.method, newMethod);
            }}
            className="w-[104px]"
            options={methodOptions(usedPermission)}
          />
        );
      },
    },
    {
      title: "Permission",
      dataIndex: "permission",
      render: (permission, record) => {
        const options = [
          { label: "Only Authentication", value: "authentication_only" },
          { label: "Public Access", value: "public_access" },
          {
            label: "Both Authentication and Authorization",
            value: "authentication_and_authorization",
            disabled: connectedEntities.length === 0,
          },
        ];
        return (
          <Select
            defaultValue={getPermissionValue(permission)}
            onChange={(selectedPermissionType) => {
              handlePermissionChange(record.method, selectedPermissionType);
            }}
            className="w-[156px]"
            options={options}
          />
        );
      },
    },
    {
      title: "Settings",
      dataIndex: "permission",
      render: (permission, record) => {
        if (permission && "entity" in permission && "type" in permission) {
          const labelManager = new LabelManager();
          return (
            <div className="flex flex-col w-[256px] gap-2">
              <Select
                defaultValue={
                  permission && "entity" in permission
                    ? permission.entity
                    : "Entity"
                }
                onChange={(selectedEntity) =>
                  handleEntitySettingsChange(record.method, selectedEntity)
                }
                placeholder="Entity"
                options={connectedEntities.map((entity) => {
                  const uniqueLabel = labelManager.getUniqueLabel(entity);
                  return {
                    key: uniqueLabel,
                    label: uniqueLabel,
                    value: entity,
                  };
                })}
              />
              <Select
                value={
                  permission && "type" in permission
                    ? permission.type
                    : "Permission"
                }
                onChange={(selectedType) =>
                  handleTypeSettingsChange(record.method, selectedType)
                }
                placeholder="Permission"
                options={entityTypeOptions(authData, permission.entity)}
              />
            </div>
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
    <>
      <Table<PermissionTableDataType>
        pagination={false}
        dataSource={dataSource}
        columns={columns}
      />
      <Button onClick={handleAddPermission}>Add Permission</Button>
    </>
  );
};
