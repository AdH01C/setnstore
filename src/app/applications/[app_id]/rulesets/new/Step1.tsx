import { Button, Input, Select } from "antd";
import { useState } from "react";

export default function Step1({
  ruleset,
  updateRuleset,
  next,
}: {
  ruleset: any;
  updateRuleset: (newRuleset: any) => void;
  next: () => void;
}) {
  const initialHost = Object.keys(ruleset.host)[0] || "";
  const [host, setHost] = useState(initialHost);

  const handleHostChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setHost(e.target.value);
  };

  const handleOnNext = () => {
    const oldHost = Object.keys(ruleset.host)[0];
    let oldValue = {
      "": {
        permission: {
          GET: null,
        },
      },
    };
    // Clone formData to avoid mutating state directly
    const newFormData = { ...ruleset };

    // Check if the old key exists in the host object
    if (newFormData.host.hasOwnProperty(oldHost)) {
      // Get the value associated with the old dynamic key
      oldValue = newFormData.host[oldHost];

      // Delete the old key
      delete newFormData.host[oldHost];
    }
    newFormData.host = { [host]: oldValue };
    // Update the formData state with the new modified data
    updateRuleset(newFormData);
    next();
  };

  return (
    <>
      <Input
        placeholder="petstore.inquisico.com"
        onChange={handleHostChange}
        value={host}
      />
      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleOnNext}>
          Next
        </Button>
      </div>
    </>
  );
}
