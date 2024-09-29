"use client";
import { useState } from "react";
import React from "react";
import { Breadcrumb, Button, Input, Layout, Select, Steps } from "antd";

import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import ApplicationSiderMenu from "@/app/components/ApplicationSiderMenu";
import { Content } from "antd/es/layout/layout";
import NewRulesetForm from "./NewRulesetForm";
import { initialFormData } from "@/app/data/initialFormData";
import RulesetDataService from "@/app/services/RulesetDataService";

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
const { Option } = Select;
export default function NewRulesetCreator() {
  const router = useRouter();
  const companyName = getCookie("username") as string;
  const params = useParams<{ app_id: string; ruleset_id: string }>();
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
        companyName,
        params.app_id
      );

      router.push(
        `/applications/${params.app_id}/rulesets/${newRuleset.data.id}`
      );
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
      <ApplicationSiderMenu
        company={companyName}
        appID={params.app_id}
        rulesetID="0"
      />
      <Layout style={{ padding: "0 0 0 20px" }}>
        <Breadcrumb
          items={[
            {
              title: "Dashboard",
              onClick: () => {
                router.push(`/dashboard`);
              },
            },
            {
              title: "Application",
              onClick: () => {
                router.push(`/applications/${params.app_id}`);
              },
            },
            {
              title: "Ruleset",
              onClick: () => {
                router.push(
                  `/applications/${params.app_id}/rulesets/${params.ruleset_id}`
                );
              },
            },
            { title: "Edit" },
          ]}
          style={{ margin: "16px 0" }}
        />
        <Content
          style={{
            // padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {/* <RulesetEdit /> */}
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
                <NewRulesetForm
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
                <div className="flex items-start space-x-4">
                  <pre className="flex-grow">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
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
        </Content>
      </Layout>
    </>
  );
}
