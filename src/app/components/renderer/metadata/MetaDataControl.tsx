import { withJsonFormsControlProps } from "@jsonforms/react";
import { Collapse, Divider, Input, Select, Typography } from "antd";

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
type RedirectSlashes = "ignore" | "strip" | "append" | "";
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
  return (
    <Collapse defaultActiveKey={["1"]} className="text-sm">
      <Collapse.Panel header="Metadata" key="1">
        <div className="flex flex-col p-4">
          {/* Trailing Slash */}
          <div className="flex items-center justify-between">
            <Typography.Text>Trailing Slash Mode</Typography.Text>
            <Select
              value={value.trailingSlashMode}
              onChange={(val) =>
                updateValue({
                  ...value,
                  trailingSlashMode: val as TrailingSlashMode,
                })
              }
              className="w-1/6"
            >
              <Select.Option value="strict">Strict</Select.Option>
              <Select.Option value="fallback">Fallback</Select.Option>
            </Select>
          </div>
          <Divider />
          {/* Redirect Slashes */}
          <div className="flex items-center justify-between">
            <Typography.Text>Redirect Slashes</Typography.Text>
            <Select
              value={value.redirectSlashes}
              onChange={(val) =>
                updateValue({
                  ...value,
                  redirectSlashes: val as RedirectSlashes,
                })
              }
              className="w-1/6"
            >
              <Select.Option value="ignore">Ignore</Select.Option>
              <Select.Option value="strip">Strip</Select.Option>
              <Select.Option value="append">Append</Select.Option>
            </Select>
          </div>
          <Divider />
          {/* Case Sensitive */}
          <div className="flex items-center justify-between">
            <Typography.Text>Case Sensitive</Typography.Text>
            <div className="w-16">
              <Input
                type="checkbox"
                checked={value.caseSensitive}
                onChange={(e) =>
                  updateValue({ ...value, caseSensitive: e.target.checked })
                }
              />
            </div>
          </div>
          <Divider />
          {/* Entity Value Case */}
          <div className="flex items-center justify-between">
            <Typography.Text>Entity Value Case</Typography.Text>
            <Select
              value={value.entityValueCase}
              onChange={(val) =>
                updateValue({ ...value, entityValueCase: val as EntityCase })
              }
              className="w-1/6"
            >
              <Select.Option value="none">None</Select.Option>
              <Select.Option value="lowercase">Lowercase</Select.Option>
              <Select.Option value="uppercase">Uppercase</Select.Option>
            </Select>
          </div>
          <Divider />
          {/* Options Passthrough */}
          <div className="flex items-center justify-between">
            <Typography.Text>Options Passthrough</Typography.Text>
            <div className="w-16">
              <Input
                type="checkbox"
                checked={value.optionsPassthrough}
                onChange={(e) =>
                  updateValue({
                    ...value,
                    optionsPassthrough: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        </div>
      </Collapse.Panel>
    </Collapse>
  );
}
