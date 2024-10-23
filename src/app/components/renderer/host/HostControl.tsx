"use client";

import { useJsonForms, withJsonFormsControlProps } from "@jsonforms/react";
import { Collapse } from "antd";
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

  return (
    <Collapse className="text-sm w-full">
      {Object.entries(value).map(([host, hostProperties]) => {
        const handleHostValueChange = (newPath: PathValue) => {
          const newValue: HostValue = { ...value };
          newValue[host] = newPath;
          updateValue(newValue);
        };
        return (
          <Collapse.Panel className="text-sm w-full" header={host} key={host}>
            <HostPanel
              key={host}
              value={{ [host]: hostProperties }}
              updateValue={handleHostValueChange}
              authData={authData}
            />
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
}
