import { Button, Card, Space, Typography } from "antd";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import React from "react";
import { barf } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";

const { Title } = Typography;

export default function RulesetDetail({
  ruleset,
  isEditable = false,
  isDeletable = false,
  onEdit,
  onDelete,
}: {
  ruleset: any;
  isEditable?: boolean;
  isDeletable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <>
      {ruleset && (
        <Card
          title={<Title level={4}>Final Ruleset Details</Title>}
          bordered={true}
          style={{ width: "100%", marginTop: "20px" }}
        >
          <CodeMirror
            value={JSON.stringify(ruleset, null, 2)}
            extensions={[
              javascript(),
              keymap.of(defaultKeymap),
              EditorView.lineWrapping,
            ]}
            theme={barf}
            height="100%" // Ensure CodeMirror takes up the full height
            editable={false}
          />

          <Space style={{ marginTop: "20px" }}>
            {isEditable && (
              <Button type="primary" onClick={onEdit}>
                Edit Ruleset
              </Button>
            )}
            {isDeletable && (
              <Button type="primary" danger onClick={onDelete}>
                Delete Ruleset
              </Button>
            )}
          </Space>
        </Card>
      )}
    </>
  );
}
