import { Collapse, Form, Input, Typography } from "antd";
import React from "react";
import { HostPermissionTable } from "./HostPermissionTable";
import { EntitySettingsForm } from "./EntitySettingForm";

interface PathProps {
  pathData: PathValue;
  absolutePath: string;
  updateValue: (newValue: PathValue) => void;
  updatePathRoute: (newValue: string) => void;
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

  return (
    <Collapse className="text-sm">
      <Collapse.Panel header={absolutePath} key={absolutePath}>
        <div className="flex flex-col w-full">
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
