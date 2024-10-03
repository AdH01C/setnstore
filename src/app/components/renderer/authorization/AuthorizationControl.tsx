import { Button, Collapse, Form, Input, Select, Table, Typography } from "antd";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { AuthPermissionTable } from "./AuthorizationPermissionTable";
import { AuthRelationTable } from "./AuthorizationRelationTable";
import { AuthPanel } from "./AuthorizationPanel";
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
  return (
    <Collapse className="text-sm">
      <Panel header="Authorization" key="1">
        <Collapse className="w-full border-none" expandIconPosition="right">
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
