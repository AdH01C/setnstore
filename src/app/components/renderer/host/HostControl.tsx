"use client";

import { useJsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import { Collapse, CollapseProps } from "antd";
import { HostPanel } from "./HostPanel";

const HostControl = ({ data, handleChange, path }: HostControlProps) => (
  <Host
    value={data}
    updateValue={(newValue: HostValue) => handleChange(path, newValue)}
  />
);

export default withJsonFormsControlProps(HostControl);

function Host({ id, value, updateValue }: HostProps) {
  const ctx = useJsonForms();

  // const relations: string[] = Object.keys(ctx.core?.data?.authorization || {});
  const authData = ctx.core?.data?.authorization

  const items: CollapseProps['items'] = Object.entries(value).map(([host, hostProperties]) => ({
    key: host,
    label: host,
    children: (
      <HostPanel
        key={host}
        value={{ [host]: hostProperties }}
        updateValue={(newPath) => {
          const newValue = { ...value };
          newValue[host] = newPath;
          updateValue(newValue);
        }}
        authData={authData}
      />
    ),
  }));

  return <Collapse className="text-sm" items={items} />;
}
