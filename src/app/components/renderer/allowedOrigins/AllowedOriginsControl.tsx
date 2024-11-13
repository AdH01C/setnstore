import { Button, Input, Table } from "antd";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useEffect } from "react";

interface AllowedOriginsControlProps {
  data: string[];
  handleChange(path: string, value: string[]): void;
  path: string;
}

interface AllowedOriginsProps {
  id?: string;
  value: string[];
  updateValue: (newValue: string[]) => void;
}

const AllowedOriginsControl = ({
  data,
  handleChange,
  path,
}: AllowedOriginsControlProps) => (
  <AllowedOrigins
    value={data}
    updateValue={(newValue: string[]) => handleChange(path, newValue)}
  />
);

export default withJsonFormsControlProps(AllowedOriginsControl);

function AllowedOrigins({ id, value, updateValue }: AllowedOriginsProps) {
  useEffect(() => {
    if (!value) {
      updateValue([]);
    }
  }, [value, updateValue]);

  const currentValue = value || [];
  const dataSource =
    currentValue === undefined
      ? []
      : currentValue.map((origin, index) => ({ key: index, origin }));

  return (
    <div className="flex flex-col p-4">
      <Table dataSource={dataSource} pagination={false} rowKey="key">
        <Table.Column
          title="Allowed Origin"
          dataIndex="origin"
          key="origin"
          render={(text, record, index) => (
            <Input
              value={text}
              onChange={(e) => {
                const newValue = [...value];
                newValue[index] = e.target.value;
                updateValue(newValue);
              }}
            />
          )}
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(text, record, index) => (
            <Button
              type="text"
              danger
              onClick={() => {
                const newValue = [...value];
                newValue.splice(index, 1);
                updateValue(newValue);
              }}
            >
              Delete
            </Button>
          )}
        />
      </Table>
      <Button type="dashed" onClick={() => updateValue([...value, ""])}>
        Add Allowed Origin
      </Button>
    </div>
  );
}
