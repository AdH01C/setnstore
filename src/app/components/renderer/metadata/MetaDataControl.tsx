import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  Collapse,
  CollapseProps,
  Divider,
  Input,
  Select,
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo } from "react";

interface MetaDataControlProps {
  data: MetaDataValue;
  handleChange(path: string, value: MetaDataValue): void;
  path: string;
}

interface MetaDataValue {
  trailingSlashMode: TrailingSlashMode;
  redirectSlashes: RedirectSlashes;
  caseSensitive: boolean;
  entityValueCase: EntityCase;
  optionsPassthrough: boolean;
}

interface MetaDataProps {
  id?: string;
  value: MetaDataValue;
  updateValue: (newValue: MetaDataValue) => void;
}

type EntityCase = "none" | "lowercase" | "uppercase";
// type RedirectSlashes = "ignore" | "strip" | "append" | "";
type RedirectSlashes = "strip" | "append" | "";
type TrailingSlashMode = "strict" | "fallback";

const MetaDataControl = ({
  data,
  handleChange,
  path,
}: MetaDataControlProps) => {
  return (
    <MetaData
      value={data}
      updateValue={(newValue: MetaDataValue) => handleChange(path, newValue)}
    />
  );
};

export default withJsonFormsControlProps(MetaDataControl);

function MetaData({ id, value, updateValue }: MetaDataProps) {
  const trailingSlashModeOptions = [
    { label: "Strict", value: "strict" },
    { label: "Fallback", value: "fallback" },
  ];
  const redirectSlashesOptions = [
    // { label: "Ignore", value: "ignore" },
    { label: "Strip", value: "strip" },
    { label: "Append", value: "append" },
  ];
  const entityValueCaseOptions = [
    { label: "None", value: "none" },
    { label: "Lowercase", value: "lowercase" },
    { label: "Uppercase", value: "uppercase" },
  ];

  const defaultValue: MetaDataValue = useMemo(
    () => ({
      trailingSlashMode: "strict",
      redirectSlashes: "strip",
      caseSensitive: false,
      entityValueCase: "none",
      optionsPassthrough: false,
    }),
    []
  );

  useEffect(() => {
    if (!value) {
      updateValue(defaultValue);
    }
  }, [value, defaultValue, updateValue]);

  const currentValue = value || defaultValue;

  const items: CollapseProps["items"] = [
    {
      key: "Metadata",
      label: "Metadata",
      children: (
        <div className="flex flex-col p-4">
          {/* Trailing Slash */}
          <div className="flex items-center justify-between">
            <Typography.Text>Trailing Slash Mode</Typography.Text>
            <Select
              value={currentValue.trailingSlashMode}
              onChange={(val) =>
                updateValue({
                  ...currentValue,
                  trailingSlashMode: val as TrailingSlashMode,
                })
              }
              className="w-1/6"
              options={trailingSlashModeOptions}
            />
          </div>
          <Divider />
          {/* Redirect Slashes */}
          <div className="flex items-center justify-between">
            <Typography.Text>Redirect Slashes</Typography.Text>
            <Select
              value={currentValue.redirectSlashes}
              onChange={(val) =>
                updateValue({
                  ...currentValue,
                  redirectSlashes: val as RedirectSlashes,
                })
              }
              className="w-1/6"
              options={redirectSlashesOptions}
            />
          </div>
          <Divider />
          {/* Case Sensitive */}
          <div className="flex items-center justify-between">
            <Typography.Text>Case Sensitive</Typography.Text>
            <div className="w-16">
              <Input
                type="checkbox"
                checked={currentValue.caseSensitive}
                onChange={(e) =>
                  updateValue({
                    ...currentValue,
                    caseSensitive: e.target.checked,
                  })
                }
              />
            </div>
          </div>
          <Divider />
          {/* Entity Value Case */}
          <div className="flex items-center justify-between">
            <Typography.Text>Entity Value Case</Typography.Text>
            <Select
              value={currentValue.entityValueCase}
              onChange={(val) =>
                updateValue({
                  ...currentValue,
                  entityValueCase: val as EntityCase,
                })
              }
              className="w-1/6"
              options={entityValueCaseOptions}
            />
          </div>
          <Divider />
          {/* Options Passthrough */}
          <div className="flex items-center justify-between">
            <Typography.Text>Options Passthrough</Typography.Text>
            <div className="w-16">
              <Input
                type="checkbox"
                checked={currentValue.optionsPassthrough}
                onChange={(e) =>
                  updateValue({
                    ...currentValue,
                    optionsPassthrough: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return <Collapse className="text-sm" items={items} />;
}
