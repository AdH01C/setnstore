import { Button, Collapse, Form, Input, Typography } from "antd";
import React from "react";
import { HostPermissionTable } from "./HostPermissionTable";
import { EntitySettingsForm } from "./EntitySettingForm";

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
    updatePathRoute();
  }

  return (
    <Collapse className="text-sm w-fit">
      <Collapse.Panel
        header={
          <>
            {absolutePath}
            {absolutePath !== "/" && (
              <>
                <Button onClick={handleAddChildPath}>Add Child Path</Button>{" "}
                <Button onClick={handleDeletePath}>Delete Path</Button>
              </>
            )}
          </>
        }
        key={absolutePath}
        className="w-full"
      >
        <div className="flex flex-col">
          <Typography>{absolutePath}</Typography>
          <Form.Item label="Route: ">
            <Input
              addonBefore="/"
              defaultValue={path}
              onBlur={(e) => {
                updatePathRoute(e.target.value);
              }}
              disabled={path === "#"}
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
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};
