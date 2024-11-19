import { Button, Flex, Form, Input, Tooltip, Typography } from "antd";
import { AuthPermissionTable } from "./AuthorizationPermissionTable";
import { AuthRelationTable } from "./AuthorizationRelationTable";
import { PermissionRow, RelationRow } from "../util";
import { QuestionCircleOutlined } from "@ant-design/icons";

export const AuthPanel = ({
  value,
  entity,
  entityList,
  relationList,
  permissionList,
  updateValue,
  readonly,
  updateEntityName,
  deleteEntity,
}: {
  value: AuthorizationDefinition;
  entity: string;
  entityList: string[];
  relationList: RelationRow[];
  permissionList: PermissionRow[];
  updateValue: (newValue: AuthorizationDefinition) => void;
  readonly: boolean;
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
    <Form layout={"vertical"}>
      <Form.Item
        label={
          <Flex gap="small">
            <Typography.Text>Entity</Typography.Text>
            <Tooltip title="Name of entity">
              <QuestionCircleOutlined />
            </Tooltip>
          </Flex>
        }
      >
        <Input
          defaultValue={entity}
          onBlur={(e) => {
            updateEntityName(e.target.value);
          }}
          style={{ width: 250 }}
          disabled={readonly}
        />
      </Form.Item>
      <Form.Item label="Relations">
        <AuthRelationTable
          entity={entity}
          authData={value}
          entityList={entityList}
          relationList={relationList}
          updateValue={(newValue) => {
            handleRelationChange(entity, newValue);
          }}
          readonly={readonly}
        />
      </Form.Item>
      <Form.Item label="Permissions">
        <AuthPermissionTable
          entity={entity}
          authData={value}
          relationList={relationList}
          permissionList={permissionList}
          updateValue={(newValue) => {
            handlePermissionChange(newValue);
          }}
          readonly={readonly}
        />
      </Form.Item>

      {!readonly && (
        <Button color="danger" variant="solid" onClick={() => deleteEntity()}>
          Delete
        </Button>
      )}
    </Form>
  );
};
