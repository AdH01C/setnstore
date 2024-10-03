import { Collapse, Form, Input, Typography } from "antd";
import { AuthPermissionTable } from "./AuthorizationPermissionTable";
import { AuthRelationTable } from "./AuthorizationRelationTable";
const { Panel } = Collapse;

export const AuthPanel = ({
  value,
  entity,
  entityList,
  updateValue,
  updateEntityName,
  deleteEntity,
}: {
  value: AuthorizationDefinition;
  entity: string;
  entityList: string[];
  updateValue: (newValue: AuthorizationDefinition) => void;
  updateEntityName: (newEntity: string) => void;
  deleteEntity: () => void;
}) => {
  function handlePermissionChange(
    entity: string,
    newPermission: AuthorizationPermissions
  ) {
    const newValue = { ...value };
    newValue.permissions = newPermission;
    updateValue(newValue);
  }

  function handleRelationChange(
    entity: string,
    newRelation: AuthorizationRelations
  ) {
    const newValue = { ...value };
    newValue.relations = newRelation;
    updateValue(newValue);
  }
  return (
    <div className="flex flex-col gap-4">
      <Form.Item label="Entity: ">
        <Input
          defaultValue={entity}
          onBlur={(e) => {
            updateEntityName(e.target.value);
          }}
        />
        <button
          className="text-red-500 rounded-md p-2"
          onClick={() => deleteEntity()}
        >
          Delete
        </button>
      </Form.Item>
      <div className="flex flex-col gap-4">
        <Typography.Text>Relations</Typography.Text>
        <AuthRelationTable
          authData={value}
          entityList={entityList}
          updateValue={(newValue) => {
            handleRelationChange(entity, newValue);
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Typography.Text>Permissions</Typography.Text>
        <AuthPermissionTable
          authData={value}
          updateValue={(newValue) => {
            handlePermissionChange(entity, newValue);
          }}
        />
      </div>
    </div>
  );
};
