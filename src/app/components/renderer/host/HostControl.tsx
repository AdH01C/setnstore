"use client";

import { useJsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import { Collapse, CollapseProps } from "antd";
import { HostPanel } from "./HostPanel";
import { useEffect, useMemo } from "react";

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
  const authData = ctx.core?.data?.authorization;

  const defaultValue = useMemo(() => ({
    "": {
      "": {
        permission: {
          GET: null,
        },
      },
    },
  }), []);

  useEffect(() => {
    if (!value) {
      updateValue(defaultValue);
    }
  }, [value, defaultValue, updateValue]);

  const currentValue = value || defaultValue;

  const items: CollapseProps["items"] = Object.entries(currentValue).map(
    ([host, hostProperties]) => ({
      key: host,
      label: host,
      children: (
        <HostPanel
          key={host}
          value={{ [host]: hostProperties }}
          updateValue={(newPath) => {
            const newValue = { ...currentValue };
            newValue[host] = newPath;
            updateValue(newValue);
          }}
          authData={authData}
        />
      ),
    })
  );

  return Object.keys(currentValue).length === 0 ? (
    <button
      className="border border-dotted border-gray-300 rounded-md p-2 hover:bg-gray-100"
      onClick={() => {
        updateValue(defaultValue);
      }}
    >
      Add Host
    </button>
  ) : (
    <Collapse className="text-sm" items={items} />
  );
}
