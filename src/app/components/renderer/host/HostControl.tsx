"use client";

import { useJsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import { HostPanel } from "./HostPanel";
import { useEffect, useMemo } from "react";
import { Button } from "antd";

const HostControl = ({
  data,
  handleChange,
  path,
  enabled,
}: HostControlProps) => (
  <Host
    value={data}
    updateValue={(newValue: HostValue) => handleChange(path, newValue)}
    readonly={!enabled}
  />
);

export default withJsonFormsControlProps(HostControl);

function Host({ id, value, updateValue, readonly }: HostProps) {
  const ctx = useJsonForms();

  // const relations: string[] = Object.keys(ctx.core?.data?.authorization || {});
  const authData = ctx.core?.data?.authorization;

  const defaultValue = useMemo(
    () => ({
      "": {
        "": {
          permission: {
            GET: null,
          },
        },
      },
    }),
    []
  );

  useEffect(() => {
    if (!value) {
      updateValue(defaultValue);
    }
  }, [value, defaultValue, updateValue]);

  const currentValue = value || defaultValue;

  return Object.keys(currentValue).length === 0 ? (
    readonly ? (
      <Button
        onClick={() => {
          updateValue(defaultValue);
        }}
      >
        Add Host
      </Button>
    ) : null
  ) : (
    Object.entries(currentValue).map(([host, hostProperties]) => (
      <HostPanel
        key={host}
        value={{ [host]: hostProperties }}
        updateValue={(newPath) => {
          const newValue = { ...currentValue };
          newValue[host] = newPath;
          updateValue(newValue);
        }}
        authData={authData}
        readonly={readonly}
      />
    ))
  );
}
