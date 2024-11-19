import { Button, Collapse, CollapseProps, Modal } from "antd";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { AuthPanel } from "./AuthorizationPanel";
import { PermissionRow, RelationRow } from "../util";
import { useEffect } from "react";
import { evalManifestWithRetries } from "next/dist/server/load-components";

interface AuthorizationControlProps {
  data: AuthorizationValue;
  handleChange(path: string, value: AuthorizationValue): void;
  path: string;
  enabled: boolean;
}

const AuthorizationControl = ({
  data,
  handleChange,
  path,
  enabled,
}: AuthorizationControlProps) => (
  <Authorization
    value={data}
    updateValue={(newValue: AuthorizationValue) => handleChange(path, newValue)}
    readonly={!enabled}
  />
);

export default withJsonFormsControlProps(AuthorizationControl);

interface AuthorizationProps {
  id?: string;
  value: AuthorizationValue;
  updateValue: (newValue: AuthorizationValue) => void;
  readonly: boolean;
}

function Authorization({
  id,
  value,
  updateValue,
  readonly,
}: AuthorizationProps) {
  useEffect(() => {
    if (!value) {
      updateValue({});
    }
  }, [value, updateValue]);

  const currentValue = value || {};
  const entityList = Object.keys(currentValue);

  const relationList: RelationRow[] = [];
  for (const key in currentValue) {
    if (currentValue[key].relations) {
      for (const relationKey in currentValue[key].relations) {
        relationList.push({
          parentEntity: key,
          relationName: relationKey,
          relatedEntity: currentValue[key].relations[relationKey],
        });
      }
    }
  }

  const permissionList: PermissionRow[] = [];
  for (const key in currentValue) {
    if (currentValue[key].permissions) {
      for (const permissionKey in currentValue[key].permissions) {
        permissionList.push({
          parentEntity: key,
          permissionName: permissionKey,
        });
      }
    }
  }

  const authItem: CollapseProps["items"] = Object.entries(currentValue).map(
    ([entity, entityAuthData]) => ({
      key: entity,
      label: `Entity: ${entity}`,
      children: (
        <AuthPanel
          value={entityAuthData}
          entity={entity}
          entityList={entityList}
          relationList={relationList}
          permissionList={permissionList}
          updateValue={(newAuth: AuthorizationDefinition) => {
            const newValue: AuthorizationValue = { ...currentValue };
            newValue[entity] = newAuth;
            updateValue(newValue);
          }}
          readonly={readonly}
          updateEntityName={(newEntity: string) => {
            if (newEntity === entity) return;

            const newValue = Object.keys(currentValue).reduce((acc, key) => {
              if (key === entity) {
                acc[newEntity] = currentValue[key];
              } else {
                acc[key] = currentValue[key];
              }
              return acc;
            }, {} as AuthorizationValue);

            updateValue(newValue);
          }}
          deleteEntity={() => {
            Modal.confirm({
              title: "Delete Entity",
              content: "Are you sure you want to delete this entity?",
              okText: "Yes",
              okType: "danger",
              cancelText: "No",
              onOk() {
                const newValue = { ...currentValue };
                delete newValue[entity];
                updateValue(newValue);
              },
            });
          }}
        />
      ),
    })
  );

  return (
    <>
      <Collapse accordion className="text-sm" items={authItem} />
      {!readonly && (
        <Button
          type="primary"
          // className="border border-dotted border-gray-300 rounded-md p-2 hover:bg-gray-100"
          onClick={() => {
            const newEntity = `new-entity-${
              Object.keys(currentValue).length + 1
            }`;
            updateValue({
              ...currentValue,
              [newEntity]: {
                relations: {},
                permissions: {},
              },
            });
          }}
        >
          Add Entity
        </Button>
      )}
    </>
  );
}
