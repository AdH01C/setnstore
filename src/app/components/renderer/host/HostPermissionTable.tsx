import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Modal, Select, Table, TableColumnsType, Tooltip, Typography } from "antd";

import {
  LabelManager,
  entityTypeOptions,
  getAvailableMethod,
  getPermissionValue,
  methodOptions,
} from "../../../utils/renderer";

interface PermissionTableDataType {
  key: React.Key;
  method: string;
  permission: Requirement;
}

interface HostPermissionTableProps {
  pathData: PathValue;
  updateValue: (newValue: PathValue) => void;
  authData: AuthorizationValue;
  ancestorEntities: string[];
  readonly: boolean;
}

export const HostPermissionTable = ({
  pathData,
  updateValue,
  authData,
  ancestorEntities,
  readonly,
}: HostPermissionTableProps) => {
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
          const updatedPermission = { ...newValue.permission };
          delete updatedPermission[method];
          newValue.permission = updatedPermission;
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

    newValue.permission = newValue.permission ? { ...newValue.permission } : {};

    if (selectedPermission === "authentication_only") {
      newValue.permission[method] = {};
    }

    if (selectedPermission === "public_access") {
      newValue.permission[method] = null;
    }

    if (selectedPermission === "authentication_and_authorization") {
      newValue.permission[method] = { entity: "", type: "" };
    }
    updateValue({ [path]: newValue });
  }

  function handleEntitySettingsChange(method: string, entity: string) {
    const newValue = { ...pathProperties };
    if (newValue.permission && typeof newValue.permission[method] === "object") {
      const requirement = newValue.permission[method] as Requirement;

      if (requirement !== null && "entity" in requirement) {
        const updatedRequirement = { ...requirement, entity, type: "" };

        const updatedPermission = {
          ...newValue.permission,
          [method]: updatedRequirement,
        };

        newValue.permission = updatedPermission;

        updateValue({ [path]: newValue });
      }
    }
  }

  function handleTypeSettingsChange(method: string, type: string) {
    const newValue = { ...pathProperties };
    if (newValue.permission && typeof newValue.permission[method] === "object") {
      const requirement = newValue.permission[method] as Requirement;

      if (requirement !== null && "type" in requirement) {
        const updatedRequirement = { ...requirement, type };

        const updatedPermission = {
          ...newValue.permission,
          [method]: updatedRequirement,
        };

        newValue.permission = updatedPermission;

        updateValue({ [path]: newValue });
      }
    }
  }

  function handleAddPermission() {
    const newValue = { ...pathProperties };
    newValue.permission = newValue.permission ? { ...newValue.permission } : {};
    const method = getAvailableMethod(Object.keys(newValue.permission));
    if (method) {
      newValue.permission[method] = null;
      updateValue({ [path]: newValue });
    }
  }

  const dataSource: PermissionTableDataType[] =
    pathProperties && pathProperties.permission
      ? Object.entries(pathProperties.permission).map(([method, requirement]) => ({
          key: method,
          method,
          permission: requirement,
        }))
      : [];

  const columns: TableColumnsType<PermissionTableDataType> = [
    {
      title: (
        <Flex gap="small">
          <Typography.Text>Method</Typography.Text>
          <Tooltip title="Choose HTTP method">
            <QuestionCircleOutlined />
          </Tooltip>
        </Flex>
      ),
      dataIndex: "method",
      render: (method: string, record) => {
        const usedPermission = Object.keys(pathProperties.permission || {});
        return (
          <Select
            value={method}
            onChange={newMethod => {
              handleMethodChange(record.method, newMethod);
            }}
            options={methodOptions(usedPermission)}
            style={{ minWidth: 100 }}
            disabled={readonly}
          />
        );
      },
    },
    {
      title: (
        <Flex gap="small">
          <Typography.Text>Permission</Typography.Text>
          <Tooltip
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`Public - Accessible to anyone without restrictions.
            
            Authentication - Accessible only to authenticated (logged-in) users.
            
            Authorization - Accessible only to authenticated users with the required permissions to access the selected entity in the current path or any entity up the chain. (Requires valid entity ('#') up in the chain`}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </Flex>
      ),
      dataIndex: "permission",
      render: (permission: Requirement, record) => {
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
            onChange={selectedPermissionType => {
              handlePermissionChange(record.method, selectedPermissionType);
            }}
            options={options}
            style={{ minWidth: 250 }}
            disabled={readonly}
          />
        );
      },
    },
    {
      title: (
        <Flex gap="small">
          <Typography.Text>Authorization Settings</Typography.Text>
          <Tooltip
            overlayStyle={{ whiteSpace: "pre-line" }}
            title={`Select an entity up in the chain.

                     Select the required permissions for the authenticated user to access the selected entity.`}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </Flex>
      ),
      dataIndex: "permission",
      render: (permission: Requirement, record) => {
        if (permission && "entity" in permission && "type" in permission) {
          const labelManager = new LabelManager();
          return (
            <Flex style={{ minWidth: 150 }} vertical>
              <Select
                defaultValue={permission && "entity" in permission ? permission.entity : "Entity"}
                onChange={selectedEntity => handleEntitySettingsChange(record.method, selectedEntity)}
                placeholder="Entity"
                options={connectedEntities.map(entity => {
                  const uniqueLabel = labelManager.getUniqueLabel(entity);
                  return {
                    key: uniqueLabel,
                    label: uniqueLabel,
                    value: entity,
                  };
                })}
                disabled={readonly}
              />
              <Select
                value={permission && "type" in permission ? permission.type : "Permission"}
                onChange={selectedType => handleTypeSettingsChange(record.method, selectedType)}
                placeholder="Permission"
                options={entityTypeOptions(authData, permission.entity)}
                disabled={readonly}
              />
            </Flex>
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
      <Form.Item
        label={
          <Flex gap="small">
            <Typography.Text>Access Control Settings</Typography.Text>
            <Tooltip title="Define authentication and authorization rules of the HTTP methods for the route">
              <QuestionCircleOutlined />
            </Tooltip>
          </Flex>
        }
      >
        <Table<PermissionTableDataType>
          pagination={false}
          dataSource={dataSource}
          columns={!readonly ? [...columns] : columns.filter(column => column.title !== "Actions")}
        />
        {!readonly && (
          <Button style={{ width: "100%" }} onClick={handleAddPermission}>
            Add Permission
          </Button>
        )}
      </Form.Item>
    </>
  );
};
