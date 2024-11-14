import { Button, Flex, Input, Modal, Table, Tooltip, Typography } from "antd";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useEffect } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";

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

  function handleDeleteOrigin(index: number) {
    Modal.confirm({
      title: "Delete Origin",
      content: "Are you sure you want to delete this origin?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const newValue = [...value];
        newValue.splice(index, 1);
        updateValue(newValue);
      },
    });
  }

  return (
    <div>
      <Table dataSource={dataSource} pagination={false} rowKey="key">
        <Table.Column
          title={
            <Flex gap="small">
              <Typography.Text>Allowed Origins</Typography.Text>
              <Tooltip
                overlayStyle={{ whiteSpace: "pre-line" }}
                title={`Enter the URLs of domains allowed to access your application. 

                Each URL should be a fully qualified domain (e.g., https://example.com). 

                Use "*" to allow all domains`}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Flex>
          }
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
                handleDeleteOrigin(index);
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
