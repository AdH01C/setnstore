import React from "react";
import { JsonSchema, Layout } from "@jsonforms/core";
import { JsonFormsDispatch, useJsonForms } from "@jsonforms/react";
export interface RenderChildrenProps {
  layout: Layout;
  schema: JsonSchema;
  className: string;
  path: string;
}

export const renderChildren = (
  layout: Layout,
  schema: JsonSchema,
  path: string,
  enabled: boolean
) => {
  if (layout.elements.length === 0) {
    return [];
  }

  return layout.elements.map((child, index) => {
    const { renderers, cells } = useJsonForms();

    return (
      <div key={`${path}-${index}`}>
        <JsonFormsDispatch
          renderers={renderers}
          cells={cells}
          uischema={child}
          schema={schema}
          path={path}
          enabled={enabled}
        />
      </div>
    );
  });
};
