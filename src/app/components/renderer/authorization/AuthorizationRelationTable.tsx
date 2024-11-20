import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Modal, Select, Table, TableColumnsType, Tooltip, Typography } from "antd";

import { RelationRow, authRelationOptions, sortedStringify } from "../../../utils/renderer";

interface AuthRelationTableDataType {
  key: React.Key;
  relation: string;
  facets: AuthorizationRelation[];
}

interface AuthRelationTableProps {
  entity: string;
  authData: AuthorizationDefinition;
  entityList: string[];
  relationList: RelationRow[];
  updateValue: (newValue: AuthorizationRelations) => void;
  readonly: boolean;
}

export const AuthRelationTable = ({
  entity,
  authData,
  entityList,
  relationList,
  updateValue,
  readonly,
}: AuthRelationTableProps) => {
  const relationsData = authData.relations;

  function handleDeleteRelation(relation: string) {
    Modal.confirm({
      title: "Delete Permission",
      content: "Are you sure you want to delete this permission?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const newRelations = {
          ...relationsData,
        };
        delete newRelations[relation];
        updateValue(newRelations);
      },
    });
  }

  function handleAddRelation() {
    const newRelations = { ...relationsData };

    newRelations[`new-relation-${Object.keys(newRelations).length + 1}`] = [];
    updateValue(newRelations);
  }

  function handleRelationNameChange(e: React.FocusEvent<HTMLInputElement, Element>, relation: string) {
    const newRelationName = e.target.value;

    if (newRelationName === relation) {
      return;
    }

    const newRelations = Object.keys(relationsData).reduce(
      (acc, key) => {
        if (key === relation) {
          return { ...acc, [newRelationName]: relationsData[relation] };
        } else {
          return { ...acc, [key]: relationsData[key] };
        }
      },
      {} as typeof relationsData,
    );

    updateValue(newRelations);
  }

  function handleAuthFacetsChange(relation: string, selectedFacets: string[]) {
    const newRelations = {
      ...relationsData,
      [relation]: relationsData[relation],
    };

    newRelations[relation] = selectedFacets.map(authRelation => {
      const jsonSelectedFacets = JSON.parse(authRelation) as AuthorizationRelation;
      return {
        facet: jsonSelectedFacets.facet,
        relation: jsonSelectedFacets.relation,
      };
    });
    updateValue(newRelations);
  }

  const dataSource: AuthRelationTableDataType[] = relationsData
    ? Object.entries(relationsData).map(([relation, facetArray]) => ({
        key: relation,
        relation,
        facets: facetArray,
      }))
    : [];

  const columns: TableColumnsType<AuthRelationTableDataType> = [
    {
      title: (
        <Flex gap="small">
          <Typography.Text>Relation</Typography.Text>
          <Tooltip title="Name of relation">
            <QuestionCircleOutlined />
          </Tooltip>
        </Flex>
      ),
      dataIndex: "relation",
      render: (relation, record) => {
        return (
          <Input
            defaultValue={relation}
            onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => {
              handleRelationNameChange(e, record.relation);
            }}
            disabled={readonly}
          />
        );
      },
    },
    {
      title: (
        <Flex gap="small">
          <Typography.Text>Facet</Typography.Text>
          <Tooltip title="Select an entity or a relation associated with another entity">
            <QuestionCircleOutlined />
          </Tooltip>
        </Flex>
      ),
      dataIndex: "facets",
      render: (facets, record) => {
        const facetOptions = authRelationOptions([
          ...relationList.filter(authRelation => authRelation.parentEntity !== entity),
        ]);

        return (
          <Select
            mode="multiple"
            value={facets.map((authRelation: AuthorizationRelation) => sortedStringify(authRelation))}
            onChange={selectedRelations => {
              handleAuthFacetsChange(record.relation, selectedRelations);
            }}
            placeholder="Select entities"
            options={[
              ...entityList.map(entity => ({
                value: sortedStringify({ facet: entity }),
                label: <span>{entity}</span>,
              })),
              ...facetOptions,
            ]}
            disabled={readonly}
          />
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          type="text"
          danger
          onClick={() => {
            handleDeleteRelation(record.relation);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table<AuthRelationTableDataType>
        pagination={false}
        dataSource={dataSource}
        columns={!readonly ? [...columns] : columns.filter(column => column.title !== "Actions")}
      />
      {!readonly && (
        <Button style={{ width: "100%" }} onClick={handleAddRelation}>
          Add Relation
        </Button>
      )}
    </>
  );
};
