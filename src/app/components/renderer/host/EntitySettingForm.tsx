import { Form, Select } from "antd";
import { useState } from "react";
import { relationOptions } from "../util";
const { Option } = Select;

export const EntitySettingsForm = ({
  pathData,
  updateValue,
  relations,
}: {
  pathData: PathValue;
  updateValue: (newValue: PathValue) => void;
  relations: string[];
}) => {
  const [toggleCustomRelation, setToggleCustomRelation] =
    useState<boolean>(false);

  const [[path, untypedProperties]] = Object.entries(pathData);

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

  const pathProperties = untypedProperties as EntityPathSettings;

  return (
    <>
      {pathProperties && (
        <>
          <Form.Item label="Entity: ">
            <Select
              defaultValue={pathProperties.entity}
              onChange={handleEntityChange}
              placeholder="Entity"
            >
              {relationOptions(relations)}
            </Select>
          </Form.Item>
          <Form.Item label="Relations: ">
            <Select
              defaultValue={getRelationTypeValue(pathProperties)}
              onChange={handleRelationTypeChange}
              placeholder="Relation Type"
            >
              <Option value={"Default"}>Default</Option>
              <Option value={"No Relation"}>No Relation</Option>
              <Option value={"Custom"}>Custom</Option>
            </Select>
            {toggleCustomRelation && (
              <Select
                mode="multiple"
                defaultValue={getRelationValue(pathProperties)}
                onChange={handleRelationChange}
                placeholder="Select relations"
              >
                {relationOptions(relations)}
              </Select>
            )}
          </Form.Item>
        </>
      )}
    </>
  );
};
