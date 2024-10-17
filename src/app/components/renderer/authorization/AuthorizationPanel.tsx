import { Form, Input, Typography } from "antd";
import { AuthPermissionTable } from "./AuthorizationPermissionTable";
import { AuthRelationTable } from "./AuthorizationRelationTable";
import { PermissionRow, RelationRow } from "../util";

export const AuthPanel = ({
  value,
  entity,
  entityList,
  relationList,
  permissionList,
  updateValue,
  updateEntityName,
  deleteEntity,
}: {
  value: AuthorizationDefinition;
  entity: string;
  entityList: string[];
  relationList: RelationRow[];
  permissionList: PermissionRow[];
  updateValue: (newValue: AuthorizationDefinition) => void;
  updateEntityName: (newEntity: string) => void;
  deleteEntity: () => void;
}) => {
  function handlePermissionChange(newPermission: AuthorizationPermissions) {
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
          entity={entity}
          authData={value}
          entityList={entityList}
          relationList={relationList}
          updateValue={(newValue) => {
            handleRelationChange(entity, newValue);
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Typography.Text>Permissions</Typography.Text>
        <AuthPermissionTable
          entity={entity}
          authData={value}
          relationList={relationList}
          permissionList={permissionList}
          updateValue={(newValue) => {
            handlePermissionChange(newValue);
          }}
        />
      </div>
    </div>
  );
};
