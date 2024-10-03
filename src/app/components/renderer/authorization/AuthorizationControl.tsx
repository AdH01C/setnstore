import { Button, Collapse, Input, Select, Table, Typography } from "antd";
import { withJsonFormsControlProps } from "@jsonforms/react";
const { Panel } = Collapse;

interface AuthorizationControlProps {
  data: AuthorizationValue;
  handleChange(path: string, value: AuthorizationValue): void;
  path: string;
}

interface AuthorizationProps {
  id?: string;
  value: AuthorizationValue;
  updateValue: (newValue: AuthorizationValue) => void;
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

function Authorization({ id, value, updateValue }: AuthorizationProps) {
  return (
    <Collapse defaultActiveKey={["1"]} className="text-sm">
      <Panel header="Authorization" key="1">
        <Collapse
          className="w-full bg-white border-none"
          expandIconPosition="right"
        >
          {Object.keys(value).map((entity) => {
            return (
              <Panel
                header={
                  <Input
                    defaultValue={entity}
                    onBlur={(e) => {
                      const newValue = Object.keys(value).reduce((acc, key) => {
                        if (key === entity) {
                          acc[e.target.value] = value[key];
                        } else {
                          acc[key] = value[key];
                        }
                        return acc;
                      }, {} as AuthorizationValue);
                      updateValue(newValue);
                    }}
                  />
                }
                key={entity}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <Typography.Text className="border-none">
                      Entity:{" "}
                    </Typography.Text>
                    <button
                      className="text-red-500 rounded-md p-2"
                      onClick={() => {
                        const newValue = { ...value };
                        delete newValue[entity];
                        updateValue(newValue);
                      }}
                    >
                      Delete
                    </button>
                    <Typography.Text>Relations</Typography.Text>

                    <Table
                      pagination={false}
                      dataSource={Object.entries(
                        value[entity]?.relations || {}
                      ).map(([relation, facets], index) => ({
                        relation, // The key (relation)
                        facets, // The value associated with the relation
                        index, // Include the index here
                        key: `${relation}-${index}`, // Use a unique key combining relationKey and index
                      }))}
                      columns={[
                        {
                          title: "relation",
                          dataIndex: "relation",
                          key: "relation",
                          render: (text, record) => (
                            <Input
                              defaultValue={text}
                              onBlur={(e) => {
                                const newRelations = {
                                  ...value[entity].relations,
                                };
                                const oldRelation = record.relation;
                                const newRelation = e.target.value;
                                newRelations[newRelation] =
                                  newRelations[oldRelation];
                                delete newRelations[oldRelation];
                                updateValue({
                                  ...value,
                                  [entity]: {
                                    ...value[entity],
                                    relations: newRelations,
                                  },
                                });
                              }}
                            />
                          ),
                        },
                        {
                          title: "Facets",
                          dataIndex: "facets",
                          key: "facets",
                          render: (facets, record) => {
                            return (
                              <Select
                                mode="tags"
                                defaultValue={
                                  facets
                                    ? facets.map(
                                        (item: AuthorizationRelation) =>
                                          item.facet
                                      )
                                    : []
                                }
                                onChange={(selectedRelations) => {
                                  const newRelations = {
                                    ...value[entity]?.relations, // Ensure `value[entity]` exists before accessing `.permissions`
                                  };

                                  newRelations[record.relation] =
                                    selectedRelations.map((relation: any) => ({
                                      facet: relation,
                                    }));

                                  updateValue({
                                    ...value,
                                    [entity]: {
                                      ...value[entity],
                                      relations: newRelations,
                                    },
                                  });
                                }}
                                style={{ width: "100%" }}
                              >
                                {Object.keys(value).map((entityKey) => (
                                  <Select.Option
                                    key={entityKey}
                                    value={entityKey}
                                  >
                                    {entityKey}
                                  </Select.Option>
                                ))}
                              </Select>
                            );
                          },
                        },
                        {
                          title: "Delete",
                          key: "delete",
                          render: (_, record) => (
                            <Button
                              danger
                              type="text"
                              onClick={() => {
                                const newRelations = {
                                  ...value[entity].relations,
                                };
                                delete newRelations[record.relation];
                                updateValue({
                                  ...value,
                                  [entity]: {
                                    ...value[entity],
                                    relations: newRelations,
                                  },
                                });
                              }}
                            >
                              Delete
                            </Button>
                          ),
                        },
                      ]}
                    />
                    <Button
                      onClick={() => {
                        const newRelations = { ...value[entity].relations };
                        newRelations["new-relation"] = [];
                        updateValue({
                          ...value,
                          [entity]: {
                            ...value[entity],
                            relations: newRelations,
                          },
                        });
                      }}
                    >
                      Add Relation
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Typography.Text>Permissions</Typography.Text>
                    <Table
                      pagination={false}
                      dataSource={Object.keys(
                        value[entity]?.permissions || {}
                      ).map((permission) => {
                        return {
                          key: permission,
                          permission,
                          type: (
                            value[entity].permissions[
                              permission
                            ] as AuthorizationOperations
                          ).type,
                          operations: (
                            value[entity].permissions[
                              permission
                            ] as AuthorizationOperations
                          ).operations.map((operation) => operation.relation),
                        };
                      })}
                      columns={[
                        // Permission
                        {
                          title: "Permission",
                          dataIndex: "permission",
                          key: "permission",
                          render: (text, record) => (
                            <Input
                              defaultValue={text}
                              onBlur={(e) => {
                                const newPermissions = {
                                  ...value[entity].permissions,
                                };
                                const oldPermission = record.permission;
                                const newPermission = e.target.value;
                                newPermissions[newPermission] =
                                  newPermissions[oldPermission];
                                delete newPermissions[oldPermission];
                                updateValue({
                                  ...value,
                                  [entity]: {
                                    ...value[entity],
                                    permissions: newPermissions,
                                  },
                                });
                              }}
                            />
                          ),
                        },
                        // Type
                        {
                          title: "Type",
                          dataIndex: "type",
                          key: "type",
                          render: (text, record) => (
                            <Select
                              defaultValue={text}
                              onChange={(selectedType) => {
                                const newPermissions = {
                                  ...value[entity].permissions,
                                };

                                if (selectedType === "single") {
                                  newPermissions[record.permission] = {
                                    relation: record.operations[0],
                                  };
                                } else {
                                  newPermissions[record.permission] = {
                                    type: selectedType,
                                    operations: record.operations.map((op) => {
                                      return {
                                        relation: op,
                                      };
                                    }),
                                  };
                                }
                                updateValue({
                                  ...value,
                                  [entity]: {
                                    ...value[entity],
                                    permissions: newPermissions,
                                  },
                                });
                              }}
                            >
                              <Select.Option value="single">
                                single
                              </Select.Option>
                              <Select.Option value="noop">noop</Select.Option>
                              <Select.Option value="union">union</Select.Option>
                              <Select.Option value="intersect">
                                intersect
                              </Select.Option>
                              <Select.Option value="except">
                                except
                              </Select.Option>
                            </Select>
                          ),
                        },
                        // Relations
                        {
                          title: "Relations",
                          dataIndex: "operations",
                          key: "operations",
                          render: (operations, record) => (
                            <Select
                              mode={operations.length > 0 ? "tags" : undefined}
                              style={{ width: "100%" }}
                              placeholder="Select or type relations"
                              value={operations ? operations : []}
                              onChange={(selectedRelations) => {
                                const newPermissions = {
                                  ...value[entity].permissions,
                                };
                                (newPermissions[record.permission] as AuthorizationOperations).operations =
                                  selectedRelations.map((relation: any) => ({
                                    relation,
                                  }));
                                updateValue({
                                  ...value,
                                  [entity]: {
                                    ...value[entity],
                                    permissions: newPermissions,
                                  },
                                });
                              }}
                            >
                              {Object.keys(value[entity].relations).map(
                                (relation) => (
                                  <Select.Option
                                    key={relation}
                                    value={relation}
                                  >
                                    {relation}
                                  </Select.Option>
                                )
                              )}
                            </Select>
                          ),
                        },
                        // Delete
                        {
                          title: "Delete",
                          key: "delete",
                          render: (_, record) => (
                            <Button
                              danger
                              type="text"
                              onClick={() => {
                                const newPermissions = {
                                  ...value[entity].permissions,
                                };
                                delete newPermissions[record.permission];
                                updateValue({
                                  ...value,
                                  [entity]: {
                                    ...value[entity],
                                    permissions: newPermissions,
                                  },
                                });
                              }}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Delete
                            </Button>
                          ),
                        },
                      ]}
                    />
                    <Button
                      onClick={() => {
                        const newPermissions = {
                          ...value[entity].permissions,
                        };
                        newPermissions["new-permission"] = {
                          type: "noop",
                          operations: [],
                        };
                        updateValue({
                          ...value,
                          [entity]: {
                            ...value[entity],
                            permissions: newPermissions,
                          },
                        });
                      }}
                    >
                      Add Permission
                    </Button>
                  </div>
                </div>
              </Panel>
            );
          })}
          <button
            className="border border-dotted border-gray-300 rounded-md p-2 mt-4 hover:bg-gray-100"
            onClick={() => {
              const newEntity = `new-entity-${Object.keys(value).length}`;
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
          {/* <Button
          onClick={() => {
            const newValue = { ...value };
            newValue['new-entity'] = { relations: {}, permissions: {} };
            updateValue(newValue);
          }}
          >
          Add Entity
          </Button> */}
        </Collapse>
      </Panel>
    </Collapse>
  );
}
