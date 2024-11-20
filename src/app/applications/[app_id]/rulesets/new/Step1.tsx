import { Button, Input } from "antd";
import { useState } from "react";

interface Step1Props {
  ruleset: any;
  updateRuleset: (newRuleset: any) => void;
  next: () => void;
}

export function Step1({ ruleset, updateRuleset, next }: Step1Props) {
  const initialHost = Object.keys(ruleset.host)[0] || "";
  const [host, setHost] = useState(initialHost);

  const handleHostChange = (e: { target: { value: React.SetStateAction<string> } }) => {
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
    const newFormData = { ...ruleset };

    if (oldHost in newFormData.host) {
      oldValue = newFormData.host[oldHost];

      delete newFormData.host[oldHost];
    }
    newFormData.host = { [host]: oldValue };
    updateRuleset(newFormData);
    next();
  };

  return (
    <>
      <Input placeholder="petstore.inquisico.com" onChange={handleHostChange} value={host} />
      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleOnNext}>
          Next
        </Button>
      </div>
    </>
  );
}
