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
}

export const Path: React.FC<PathProps> = ({
  pathData,
  absolutePath,
  updateValue,
  updatePathRoute,
  authData,
  ancestorEntities,
}) => {
  const [path] = Object.keys(pathData);
  const isEntityPath = path === "#";

  function handleAddChildPath() {
    const newValue = { ...pathData };

    const newChildrenPath = `untitled-${Date.now()}`;
    const newChildren = {
      [newChildrenPath]: {
        permission: {},
      },
    };

    if (newValue[path]?.children) {
      newValue[path].children = { ...newValue[path].children, ...newChildren };
    } else {
      newValue[path].children = newChildren;
    }

    updateValue(newValue);
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
          {absolutePath !== "/" && (
            <>
              <Button onClick={handleAddChildPath}>Add Child Path</Button>{" "}
              <Button onClick={handleDeletePath}>Delete Path</Button>
            </>
          )}
        </>
      ),
      children: (
        <Form style={{ minWidth: 750 }} layout="vertical">
          {/* <Typography>{absolutePath}</Typography> */}
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
              // disabled={path === "#"}
            />
          </Form.Item>
          {isEntityPath && (
            <EntitySettingsForm
              pathData={pathData}
              updateValue={updateValue}
              relations={Object.keys(authData || {})}
              ancestorEntities={ancestorEntities}
            />
          )}
          <HostPermissionTable
            pathData={pathData}
            updateValue={updateValue}
            authData={authData}
            ancestorEntities={ancestorEntities}
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
