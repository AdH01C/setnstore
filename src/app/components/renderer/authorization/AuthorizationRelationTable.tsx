import { Table, Select, Button, Input, TableColumnsType } from "antd";
import { relationOptions } from "../util";

interface AuthRelationTableDataType {
  key: React.Key;
  relation: string;
  facets: AuthorizationRelation[];
}

export const AuthRelationTable = ({
  authData,
  entityList,
  updateValue,
}: {
  authData: AuthorizationDefinition;
  entityList: string[];
  updateValue: (newValue: AuthorizationRelations) => void;
}) => {
  //   const permissionData = authData.permissions;
  const relationsData = authData.relations;

  function handleDeleteRelation(relation: string) {
    const newRelations = {
      ...relationsData,
    };
    delete newRelations[relation];
    updateValue(newRelations);
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

    newRelations[relation] = selectedFacets.map((facet) => {
      return {
        facet: facet,
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
      title: "Relation",
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
      title: "Facet",
      dataIndex: "facets",
      render: (facets, record) => {
        return (
          <Select
            mode="tags"
            defaultValue={
              facets
                ? facets.map((item: AuthorizationRelation) => item.facet)
                : []
            }
            onChange={(selectedRelations) => {
              handleAuthFacetsChange(record.relation, selectedRelations);
            }}
            placeholder="Select entities"
          >
            {relationOptions(entityList)}
          </Select>
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
      <Button onClick={handleAddRelation}>Add Relation</Button>
    </>
  );
};
