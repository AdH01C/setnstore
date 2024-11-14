import {
  Table,
  Select,
  Button,
  Input,
  TableColumnsType,
  Tooltip,
  Typography,
  Flex,
  Modal,
} from "antd";
import { RelationRow, authRelationOptions, sortedStringify } from "../util";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface AuthRelationTableDataType {
  key: React.Key;
  relation: string;
  facets: AuthorizationRelation[];
}

export const AuthRelationTable = ({
  entity,
  authData,
  entityList,
  relationList,
  updateValue,
}: {
  entity: string;
  authData: AuthorizationDefinition;
  entityList: string[];
  relationList: RelationRow[];
  updateValue: (newValue: AuthorizationRelations) => void;
}) => {
  //   const permissionData = authData.permissions;
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

  function handleRelationNameChange(
    e: React.FocusEvent<HTMLInputElement, Element>,
    relation: string
  ) {
    const newRelationName = e.target.value;

    if (newRelationName === relation) {
      return;
    }

    const newRelations = Object.keys(relationsData).reduce((acc, key) => {
      if (key === relation) {
        acc[newRelationName] = relationsData[relation];
      } else {
        acc[key] = relationsData[key];
      }
      return acc;
    }, {} as typeof relationsData);

    updateValue(newRelations);
  }

  function handleAuthFacetsChange(relation: string, selectedFacets: string[]) {
    const newRelations = {
      ...relationsData,
      [relation]: relationsData[relation],
    };

    newRelations[relation] = selectedFacets.map((authRelation) => {
      const jsonSelectedFacets = JSON.parse(authRelation);
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
        relation: relation,
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
            onBlur={(e) => {
              handleRelationNameChange(e, record.relation);
            }}
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
          ...relationList.filter(
            (authRelation) => authRelation.parentEntity !== entity
          ),
        ]);

        return (
          <Select
            mode="tags"
            value={facets.map((authRelation: AuthorizationRelation) =>
              sortedStringify(authRelation)
            )}
            onChange={(selectedRelations) => {
              handleAuthFacetsChange(record.relation, selectedRelations);
            }}
            placeholder="Select entities"
            options={[
              ...entityList.map((entity) => ({
                value: sortedStringify({ facet: entity }),
                label: <span>{entity}</span>,
              })),
              ...facetOptions,
            ]}
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
        columns={columns}
      />
      <Button style={{ width: "100%" }} onClick={handleAddRelation}>
        Add Relation
      </Button>
    </>
  );
};
