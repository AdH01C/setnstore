import { Button, Card, Collapse, Input, Select, Table, Typography } from 'antd';
import { withJsonFormsControlProps } from '@jsonforms/react';
const { Panel } = Collapse;


interface AuthorizationControlProps {
  data: AuthorizationValue;
  handleChange(path: string, value: AuthorizationValue): void;
  path: string;
}

interface AuthorizationValue {
  [entity: string]: AuthorizationDefinition;
}

interface AuthorizationDefinition {
  relations: AuthorizationRelations;
  permissions: AuthorizationPermissions;
}

interface AuthorizationRelations {
  [relation: string]: AuthorizationRelation[];
}

interface AuthorizationRelation {
  facet: string;
  relation?: string;
}

interface AuthorizationPermissions {
  [permission: string]: AuthorizationOperations;
}

type AuthorizationType = 'noop' | 'union' | 'intersect' | 'except';

interface AuthorizationOperations {
  type: AuthorizationType;
  operations: AuthorizationOperation[];
}

interface AuthorizationOperation {
  relation: string;
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
    <Collapse defaultActiveKey={['1']} className="bg-white w-[750px] text-sm">
      <Panel header="Authorization" key="1">
        
        <Collapse defaultActiveKey={Object.keys(value)[0]} className='w-full bg-white border-none' expandIconPosition='right'>
          { Object.keys(value).map((entity) => {
            return (
              <>
                <Typography.Text className='border-none'>Entity: </Typography.Text>
                <button 
                  className='text-red-500 border border-dotted border-gray-300 rounded-md p-2'
                  onClick={() => {
                  const newValue = { ...value };
                  delete newValue[entity];
                  updateValue(newValue);
                  }}>
                  Delete
                </button>
                <Panel header={<Input
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
                  } } />}
                  key={entity}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      <Typography.Text>Relations</Typography.Text>
                      
                      <Table
                      pagination={false}
                      dataSource={Object.entries(value[entity]?.relations || {}).flatMap(
                        ([relation, relations]) =>
                          relations.map((rel, index) => ({
                            ...rel,
                            relation,
                            index, // Include index here
                            key: `${relation}-${index}`,
                          }))
                      )}
                      columns={[
                        {
                        title: 'Relation',
                        dataIndex: 'relation',
                        key: 'relation',
                        render: (text, record) => (
                          <Input
                          defaultValue={text}
                          onBlur={(e) => {
                            const newRelations = { ...value[entity].relations };
                            const oldRelation = record.relation;
                            const newRelation = e.target.value;
                            newRelations[newRelation] = newRelations[oldRelation];
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
                          title: 'Facet',
                          dataIndex: 'facet',
                          key: 'facet',
                          render: (text, record) => (
                            <Input
                            defaultValue={text}
                            onBlur={(e) => {
                              const newRelations = { ...value[entity].relations };
                              newRelations[record.relation] = newRelations[record.relation].map((rel, idx) =>
                              idx === record.index ? { ...rel, facet: e.target.value } : rel
                              );
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
                          title: 'Delete',
                          key: 'delete',
                          render: (_, record) => (
                          <Typography.Link
                            onClick={() => {
                              const newRelations = { ...value[entity].relations };
                              newRelations[record.relation] = newRelations[record.relation].filter(
                                (rel, idx) => idx !== record.index // Use index for comparison
                              );
                      
                              // If the relation array is empty after deletion, optionally remove the relation key
                              if (newRelations[record.relation].length === 0) {
                                delete newRelations[record.relation];
                              }
                      
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
                          </Typography.Link>
                        ),
                        },
                      ]}
                      />
                      <Button
                      onClick={() => {
                        const newRelations = { ...value[entity].relations };
                        newRelations['new-relation'] = [{ facet: '' }];
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
                        dataSource={Object.keys(value[entity]?.permissions || {}).map((permission) => {
                          return {
                            key: permission,
                            permission,
                            type: value[entity].permissions[permission].type,
                            operations: value[entity].permissions[permission].operations.map((operation) => operation.relation).join(', '),
                          };
                        })}
                        columns={[
                          // Permission
                          {
                            title: 'Permission',
                            dataIndex: 'permission',
                            key: 'permission',
                            render: (text, record) => (
                              <Input
                                defaultValue={text}
                                onBlur={(e) => {
                                  const newPermissions = { ...value[entity].permissions };
                                  const oldPermission = record.permission;
                                  const newPermission = e.target.value;
                                  newPermissions[newPermission] = newPermissions[oldPermission];
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
                            title: 'Type',
                            dataIndex: 'type',
                            key: 'type',
                            render: (text, record) => (
                              <select
                                defaultValue={text}
                                onChange={(e) => {
                                  const newPermissions = { ...value[entity].permissions };
                                  newPermissions[record.permission].type = e.target.value as AuthorizationType;
                                  updateValue({
                                    ...value,
                                    [entity]: {
                                      ...value[entity],
                                      permissions: newPermissions,
                                    },
                                  });
                                }}
                              >
                                <option value="noop">noop</option>
                                <option value="union">union</option>
                                <option value="intersect">intersect</option>
                                <option value="except">except</option>
                              </select>
                              ),
                          },
                            // Relations
                            {
                            title: 'Relations',
                            dataIndex: 'operations',
                            key: 'operations',
                            render: (operations, record) => (
                              <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Select or type relations"
                                defaultValue={operations ? operations.split(', ') : []}
                                onChange={(selectedRelations) => {
                                  const newPermissions = { ...value[entity].permissions };
                                  newPermissions[record.permission].operations = selectedRelations.map((relation: any) => ({ relation }));
                                  updateValue({
                                    ...value,
                                    [entity]: {
                                      ...value[entity],
                                      permissions: newPermissions,
                                    },
                                  });
                                }}
                              >
                                {Object.keys(value[entity].relations).map((relation) => (
                                  <Select.Option key={relation} value={relation}>
                                    {relation}
                                  </Select.Option>
                                ))}
                              </Select>
                            ),
                            },
                          // Delete
                          {
                            title: 'Delete',
                            key: 'delete',
                            render: (_, record) => (
                                <Typography.Link
                                onClick={() => {
                                  const newPermissions = { ...value[entity].permissions };
                                  delete newPermissions[record.permission];
                                  updateValue({
                                  ...value,
                                  [entity]: {
                                    ...value[entity],
                                    permissions: newPermissions,
                                  },
                                  });
                                }}
                                style={{ whiteSpace: 'nowrap' }}
                                >
                                Delete
                                </Typography.Link>
                            ),
                          },
                        ]}
                      />
                      <Button
                        onClick={() => {
                          const newPermissions = { ...value[entity].permissions };
                          newPermissions['new-permission'] = { type: 'noop', operations: [] };
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
                
              </>
            );
          })
          }
          <button 
          className='border border-dotted border-gray-300 rounded-md p-2 mt-4 hover:bg-gray-100'
          onClick={() => {
          const newEntity = `new-entity-${Object.keys(value).length}`;
          updateValue({
            ...value,
            [newEntity]: {
            relations: {},
            permissions: {},
            },
          });
          }}>
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
