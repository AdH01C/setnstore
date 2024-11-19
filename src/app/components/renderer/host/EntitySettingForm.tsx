import { Flex, Form, Select, Tooltip, Typography } from "antd";
import { useState } from "react";
import { LabelManager } from "../util";
import { QuestionCircleOutlined } from "@ant-design/icons";

export const EntitySettingsForm = ({
  pathData,
  updateValue,
  relations,
  ancestorEntities,
  readonly
}: {
  pathData: PathValue;
  updateValue: (newValue: PathValue) => void;
  relations: string[];
  ancestorEntities: string[];
  readonly: boolean;
}) => {
  const [[path, untypedProperties]] = Object.entries(pathData);
  const pathProperties = untypedProperties as EntityPathSettings;

  const relationType = getRelationTypeValue(pathProperties);
  const relationValue = getRelationValue(pathProperties);

  const [toggleCustomRelation, setToggleCustomRelation] = useState<boolean>(
    relationType === "Custom" ? true : false
  );

  function handleEntityChange(entity: string) {
    const newValue = { ...pathProperties } as EntityPathSettings;

    newValue.entity = entity;
    updateValue({ [path]: newValue });
  }

  function getRelationTypeValue(
    entityPathSettings: EntityPathSettings
  ): string {
    const { relations } = entityPathSettings;

    if (relations === undefined) {
      return "Default"; // Relation key does not exist
    }

    if (relations.length === 0) {
      return "No relation"; // Empty array
    }

    // Relation array contains elements
    return "Custom";
  }

  function getRelationValue(entityPathSettings: EntityPathSettings): string[] {
    return entityPathSettings.relations ?? [];
  }

  function handleRelationTypeChange(relationType: string) {
    const newValue = { ...pathProperties } as EntityPathSettings;
    switch (relationType) {
      case "Default":
        setToggleCustomRelation(false);
        delete newValue.relations;
        break;
      case "No Relation":
        setToggleCustomRelation(false);
        newValue.relations = [];
        break;
      case "Custom":
        setToggleCustomRelation(true);
        return;
    }

    updateValue({ [path]: newValue });
  }

  function handleRelationChange(selectedRelations: string[]) {
    const newValue = { ...pathProperties } as EntityPathSettings;
    newValue.relations = selectedRelations;
    updateValue({ [path]: newValue });
  }

  const relationTypeOptions = [
    { label: "Default", value: "Default" },
    { label: "No Relation", value: "No Relation" },
    { label: "Custom", value: "Custom" },
  ];
  const labelManager = new LabelManager();
  return (
    <>
      {pathProperties && (
        <>
          <Form.Item
            label={
              <Flex gap="small">
                <Typography.Text>Entity</Typography.Text>
                <Tooltip title="Select an entity to assign captured wildcard value">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Flex>
            }
          >
            <Select
              defaultValue={pathProperties.entity}
              onChange={handleEntityChange}
              placeholder="Entity"
              options={relations.map((relation) => ({
                label: relation,
                value: relation,
              }))}
              style={{ width: 250 }}
              disabled={readonly}
            />
          </Form.Item>
          <Form.Item
            label={
              <Flex gap="small">
                <Typography.Text>Relations</Typography.Text>
                <Tooltip
                  overlayStyle={{ whiteSpace: "pre-line" }}
                  title={`Default - Recursively checks if the entity is related in the chain of previous routes. 

                        No Relation - No relationship checks are performed in the chain of previous routes. 

                        Custom - Allows you to specify a specific entity for the relationship check in the chain. 
                        
                        Example (default): "/users/{#userid}/posts/{#postid}" checks if wildcard posts belongs to a user entity.`}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
              </Flex>
            }
          >
            <Select
              defaultValue={relationType}
              onChange={handleRelationTypeChange}
              placeholder="Relation Type"
              options={relationTypeOptions}
              style={{ width: 250 }}
              disabled={readonly}
            />
            {toggleCustomRelation && (
              <Select
                mode="multiple"
                defaultValue={relationValue}
                onChange={handleRelationChange}
                placeholder="Select relations"
                options={ancestorEntities.map((entity) => {
                  const uniqueLabel = labelManager.getUniqueLabel(entity);
                  return {
                    key: uniqueLabel,
                    label: uniqueLabel,
                    value: entity,
                  };
                })}
              />
            )}
          </Form.Item>
        </>
      )}
    </>
  );
};
