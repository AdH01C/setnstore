import { Button } from "antd";
import React from "react";

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
        <div className="flex items-start space-x-4">
          <pre className="flex-grow">{JSON.stringify(ruleset, null, 2)}</pre>
          {isEditable && (
            <Button type="primary" onClick={onEdit}>
              Edit ruleset
            </Button>
          )}
          {isDeletable && (
            <Button type="primary" danger onClick={onDelete}>
              Delete ruleset
            </Button>
          )}
        </div>
      )}
    </>
  );
}
