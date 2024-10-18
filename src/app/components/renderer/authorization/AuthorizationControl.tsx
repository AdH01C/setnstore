import { Collapse } from "antd";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { AuthPanel } from "./AuthorizationPanel";
import { PermissionRow, RelationRow } from "../util";
const { Panel } = Collapse;

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

  return (
    <Collapse className="text-sm">
      <Panel header="Authorization" key="1">
        <Collapse
          className="w-full border-none flex flex-col"
          expandIconPosition="right"
        >
          {Object.entries(value).map(([entity, entityAuthData]) => {
            function handleAuthorizationValueChange(
              newAuth: AuthorizationDefinition
            ) {
              const newValue: AuthorizationValue = { ...value };
              newValue[entity] = newAuth;
              updateValue(newValue);
            }

            function handleEntityNameChange(newEntity: string) {
              if (newEntity === entity) {
                return;
              }

              const newValue = Object.keys(value).reduce((acc, key) => {
                if (key === entity) {
                  acc[newEntity] = value[key];
                } else {
                  acc[key] = value[key];
                }
                return acc;
              }, {} as AuthorizationValue);

              updateValue(newValue);
            }

            function handleDeleteEntity() {
              const newValue = { ...value };
              delete newValue[entity];
              updateValue(newValue);
            }

            return (
              <Collapse.Panel
                className="text-sm"
                header={"Entity: " + entity}
                key={entity}
              >
                <AuthPanel
                  value={entityAuthData}
                  entity={entity}
                  entityList={entityList}
                  relationList={relationList}
                  permissionList={permissionList}
                  updateValue={handleAuthorizationValueChange}
                  updateEntityName={handleEntityNameChange}
                  deleteEntity={handleDeleteEntity}
                />
              </Collapse.Panel>
            );
          })}
          <button
            className="border border-dotted border-gray-300 rounded-md p-2 mt-4 hover:bg-gray-100"
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
        </Collapse>
      </Panel>
    </Collapse>
  );
}
