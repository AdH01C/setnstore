import React, { ComponentType, useMemo } from "react";
import {
  Categorization,
  Category,
  deriveLabelForUISchemaElement,
  getAjv,
  isCategory,
  isVisible,
  StatePropsOfLayout,
} from "@jsonforms/core";
import Ajv from "ajv";
import {
  TranslateProps,
  useJsonForms,
  withJsonFormsLayoutProps,
  withTranslateProps,
} from "@jsonforms/react";
import { Button, Flex, Tabs, TabsProps } from "antd";
import { renderChildren } from "./util";

interface MaterialCategorizationLayoutRendererProps
  extends StatePropsOfLayout,
    AjvProps,
    TranslateProps {
  selected?: number;
  ownState?: boolean;
  data?: any;
  onChange?(selected: number, prevSelected: number): void;
}

interface AjvProps {
  ajv: Ajv;
}

const withAjvProps = <P extends {}>(Component: ComponentType<AjvProps & P>) =>
  function WithAjvProps(props: P) {
    const ctx = useJsonForms();
    const ajv = getAjv({ jsonforms: { ...ctx } });

    return <Component {...props} ajv={ajv} />;
  };

export const TabsCategorizationLayout = (
  props: MaterialCategorizationLayoutRendererProps
) => {
  const { data, path, schema, uischema, visible, enabled, ajv, t } = props;

  const categorization = uischema as Categorization;

  const categories = useMemo(
    () =>
      categorization.elements
        .filter((category): category is Category => isCategory(category)) // Type guard
        .filter((category) => isVisible(category, data, "", ajv)),
    [categorization, data, ajv]
  );

  const tabLabels = useMemo(() => {
    return categories.map((e: Category) => deriveLabelForUISchemaElement(e, t));
  }, [categories, t]);

  const items: TabsProps["items"] = categories.map((category, idx: number) => {
    const tabLabel = tabLabels[idx] || "";

    const renderContent = () => {
      switch (category.label) {
        case "Authorization":
        case "Host":
        case "Allowed Origins":
        case "Metadata":
          return renderChildren(category, schema, path, enabled);
        default:
          return null;
      }
    };

    return {
      key: tabLabel,
      label: tabLabel,
      children: renderContent(),
    };
  });
  const operations = (
    <Flex gap="middle">
      <Button>View Guide</Button>
      <Button>Import JSON</Button>
    </Flex>
  );

  return visible ? <Tabs tabBarExtraContent={operations} items={items} /> : null;
};

export default withAjvProps(
  withTranslateProps(withJsonFormsLayoutProps(TabsCategorizationLayout))
);