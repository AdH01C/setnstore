import { Collapse, CollapseProps } from "antd";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { AuthPanel } from "./AuthorizationPanel";
import { PermissionRow, RelationRow } from "../util";

interface AuthorizationControlProps {
  data: AuthorizationValue;
  handleChange(path: string, value: AuthorizationValue): void;
  path: string;
}

const AuthorizationControl = ({
  data,
  handleChange,
  path,
}: AuthorizationControlProps) => (
  <Authorization
    value={data}
    updateValue={(newValue: AuthorizationValue) => handleChange(path, newValue)}
  />
);

export default withJsonFormsControlProps(AuthorizationControl);

interface AuthorizationProps {
  id?: string;
  value: AuthorizationValue;
  updateValue: (newValue: AuthorizationValue) => void;
}

function Authorization({ id, value, updateValue }: AuthorizationProps) {
  const entityList = Object.keys(value);

  const relationList: RelationRow[] = [];
  for (const key in value) {
    if (value[key].relations) {
      for (const relationKey in value[key].relations) {
        relationList.push({
          parentEntity: key,
          relationName: relationKey,
          relatedEntity: value[key].relations[relationKey],
        });
      }
    }
  }

  const permissionList: PermissionRow[] = [];
  for (const key in value) {
    if (value[key].permissions) {
      for (const permissionKey in value[key].permissions) {
        permissionList.push({
          parentEntity: key,
          permissionName: permissionKey,
        });
      }
    }
  }

  const authItem: CollapseProps["items"] = Object.entries(value).map(
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
            const newValue: AuthorizationValue = { ...value };
            newValue[entity] = newAuth;
            updateValue(newValue);
          }}
          updateEntityName={(newEntity: string) => {
            if (newEntity === entity) return;

            const newValue = Object.keys(value).reduce((acc, key) => {
              if (key === entity) {
                acc[newEntity] = value[key];
              } else {
                acc[key] = value[key];
              }
              return acc;
            }, {} as AuthorizationValue);

            updateValue(newValue);
          }}
          deleteEntity={() => {
            const newValue = { ...value };
            delete newValue[entity];
            updateValue(newValue);
          }}
        />
      ),
    })
  );

  const items: CollapseProps['items'] = [
    {
      key: "Authorization",
      label: "Authorization",
      children: (
        <>
          <Collapse accordion className="text-sm" items={authItem} />
          <button
            className="border border-dotted border-gray-300 rounded-md p-2 hover:bg-gray-100"
            onClick={() => {
              const newEntity = `new-entity-${Object.keys(value).length + 1}`;
              updateValue({
                ...value,
                [newEntity]: {
                  relations: {},
                  permissions: {},
                },
              });
            }}
          >
            Add Entity
          </button>
        </>
      ),
    },
  ];

  return <Collapse accordion className="text-sm" items={items} />;
}
