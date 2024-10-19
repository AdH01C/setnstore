import { Form, Select } from "antd";
import { useState } from "react";
import { LabelManager } from "../util";

export const EntitySettingsForm = ({
  pathData,
  updateValue,
  relations,
  ancestorEntities,
}: {
  pathData: PathValue;
  updateValue: (newValue: PathValue) => void;
  relations: string[];
  ancestorEntities: string[];
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
          <Form.Item label="Entity: ">
            <Select
              defaultValue={pathProperties.entity}
              onChange={handleEntityChange}
              placeholder="Entity"
              options={relations.map((relation) => ({
                label: relation,
                value: relation,
              }))}
            />
          </Form.Item>
          <Form.Item label="Relations: ">
            <Select
              defaultValue={relationType}
              onChange={handleRelationTypeChange}
              placeholder="Relation Type"
              options={relationTypeOptions}
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
