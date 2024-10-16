"use client";

import { useState } from "react";
import React from "react";
import { Button, Input, Select, Steps } from "antd";
import { useRouter } from "next/navigation";
import RulesetForm from "../../../../components/RulesetForm";
import { initialFormData } from "@/app/data/initialFormData";
import RulesetDataService from "@/app/services/RulesetDataService";
import { useAppContext } from "@/app/components/AppContext";
import RulesetDetail from "@/app/components/RulesetDetail";
const { Option } = Select;

const steps = [
  {
    title: "Host",
    content: "Choose a Host URL",
  },
  {
    title: "Ruleset Settings",
    content: "Ruleset JSON Form",
  },
  {
    title: "Final Check",
    content: "Double Confirm Ruleset",
  },
];

export default function RulesetCreator() {
  const router = useRouter();
  const { appID, companyId } = useAppContext();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [host, setHost] = useState("");

  const handleHostChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setHost(e.target.value);
  };
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    const payload = { ruleset_json: formData };
    try {
      // Update the existing ruleset
      const newRuleset = await RulesetDataService.createRuleset(
        payload,
        companyId,
        appID
      );

      router.push(`/applications/${appID}/rulesets/${newRuleset.data.id}`);
    } catch (error) {
      console.error("Error submitting ruleset:", error);
    }
  };

  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Steps current={current} items={items} />
      <div>
        {current == 0 ? (
          <>
            <Input
              addonBefore={selectBefore}
              placeholder="petstore.inquisico.com"
              onChange={handleHostChange}
              value={host}
            />
            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                onClick={() => {
                  const oldHost = Object.keys(formData.host)[0];
                  let oldValue = {
                    "": {
                      permission: {
                        GET: null,
                      },
                    },
                  };
                  // Clone formData to avoid mutating state directly
                  const newFormData = { ...formData };

                  // Check if the old key exists in the host object
                  if (newFormData.host.hasOwnProperty(oldHost)) {
                    // Get the value associated with the old dynamic key
                    oldValue = newFormData.host[oldHost];

                    // Delete the old key
                    delete newFormData.host[oldHost];
                  }
                  newFormData.host = { [host]: oldValue };
                  // Update the formData state with the new modified data
                  setFormData(newFormData);
                  next();
                }}
              >
                Next
              </Button>
            </div>
          </>
        ) : current == 1 ? (
          <>
            <RulesetForm
              formData={formData}
              onFormChange={handleFormChange}
              host={host}
            />
            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                onClick={() => {
                  prev();
                }}
              >
                Previous
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  next();
                }}
              >
                Save Changes
              </Button>
            </div>
          </>
        ) : current == 2 ? (
          <>
            <RulesetDetail ruleset={formData} />
            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                onClick={() => {
                  prev();
                }}
              >
                Previous
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
