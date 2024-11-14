import React, { ComponentType, useMemo, useState } from "react";
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
import { UploadOutlined } from "@ant-design/icons";
import { Button, Flex, message, Tabs, TabsProps, Upload } from "antd";
import { renderChildren } from "./util";

interface TabsCategorizationLayoutRendererProps
  extends StatePropsOfLayout,
    TranslateProps {
  ajv: Ajv;
  data?: any;
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
  props: TabsCategorizationLayoutRendererProps
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

  return visible ? <Tabs items={items} /> : null;
};

export default withAjvProps(
  withTranslateProps(withJsonFormsLayoutProps(TabsCategorizationLayout))
);
