import {
  Button,
  Collapse,
  CollapseProps,
  Flex,
  Form,
  Input,
  Modal,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import { HostPermissionTable } from "./HostPermissionTable";
import { EntitySettingsForm } from "./EntitySettingForm";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface PathProps {
  pathData: PathValue;
  absolutePath: string;
  updateValue: (newValue: PathValue) => void;
  updatePathRoute: (newValue?: string) => void;
  authData: AuthorizationValue;
  ancestorEntities: string[];
  readonly: boolean;
}

export const Path: React.FC<PathProps> = ({
  pathData,
  absolutePath,
  updateValue,
  updatePathRoute,
  authData,
  ancestorEntities,
  readonly,
}) => {
  const [path] = Object.keys(pathData);
  const isEntityPath = path === "#";

  function handleAddChildPath() {
    const newChildrenPath = `untitled-${Date.now()}`;
    const newChildren = {
      [newChildrenPath]: {
        permission: {},
      },
    };

    const updatedChildren = pathData[path].children
      ? { ...pathData[path].children, ...newChildren }
      : newChildren;

    const updatedPath = { ...pathData[path], children: updatedChildren };

    updateValue({
      ...pathData,
      [path]: updatedPath,
    });
  }

  function handleDeletePath() {
    Modal.confirm({
      title: "Delete Path",
      content:
        "Are you sure you want to delete this path? All paths and its child routes will be deleted.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        updatePathRoute();
      },
    });
  }

  const items: CollapseProps["items"] = [
    {
      key: absolutePath,
      label: (
        <>
          {absolutePath}
          {absolutePath !== "/" && !readonly && (
            <>
              <Button onClick={handleAddChildPath}>Add Child Path</Button>{" "}
              <Button onClick={handleDeletePath}>Delete Path</Button>
            </>
          )}
        </>
      ),
      children: (
        <Form style={{ minWidth: 750 }} layout="vertical">
          <Form.Item
            label={
              <Flex gap="small">
                <Typography.Text>Route</Typography.Text>
                <Tooltip
                  overlayStyle={{ whiteSpace: "pre-line" }}
                  title={`Name of URL route

                    Use '#' to define a wildcard

                    A wildcard captures and assigns all values in the route  to a selected entity value`}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
              </Flex>
            }
          >
            <Input
              addonBefore="/"
              defaultValue={path}
              onBlur={(e) => {
                updatePathRoute(e.target.value);
              }}
              style={{ width: 250 }}
              disabled={readonly}
              // disabled={path === "#"}
            />
          </Form.Item>
          {isEntityPath && (
            <EntitySettingsForm
              pathData={pathData}
              updateValue={updateValue}
              relations={Object.keys(authData || {})}
              ancestorEntities={ancestorEntities}
              readonly={readonly}
            />
          )}
          <HostPermissionTable
            pathData={pathData}
            updateValue={updateValue}
            authData={authData}
            ancestorEntities={ancestorEntities}
            readonly={readonly}
          />
        </Form>
      ),
    },
  ];

  return (
    <Collapse
      style={{ minWidth: 500 }}
      accordion
      className="text-sm w-fit"
      items={items}
    />
  );
};
