import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import CodeMirror, { keymap } from "@uiw/react-codemirror";
import schema from "@/app/json/schema.json";
import uischema from "@/app/json/uischema.json";
import metaDataControlTester from "@/app/components/renderer/MetaDataControlTester";
import MetaDataControl from "@/app/components/renderer/MetaDataControl";
import authorizationControlTester from "@/app/components/renderer/AuthorizationControlTester";
import authorizationControl from "@/app/components/renderer/AuthorizationControl";
import hostControlTester from "@/app/components/renderer/HostControlTester";
import hostControl from "@/app/components/renderer/HostControl";
import allowedOriginsTester from "@/app/components/renderer/AllowedOriginsTester";
import allowedOriginsControl from "@/app/components/renderer/AllowedOriginsControl";
import { useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { barf } from "thememirror";
import { defaultKeymap } from "@codemirror/commands"; // Default key bindings
import React from "react";
import { Flex, Splitter, Typography } from "antd";
import { EditorView } from "@codemirror/view";
import RulesetDataService from "@/app/services/RulesetDataService";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
interface Ruleset {
  rulesetID: string;
  host: string;
  dateLastModified: Date;
  ruleset: any;
}

export default function RulesetForm({
  ruleset,
}: {
  ruleset: Ruleset;
  company: string;
  appID: string;
}) {
  const router = useRouter();
  const companyName = getCookie("username") as string;
  const params = useParams<{ app_id: string; ruleset_id: string }>();
  const renderers = [
    ...vanillaRenderers,
    //register custom renderers
    { tester: metaDataControlTester, renderer: MetaDataControl },
    { tester: authorizationControlTester, renderer: authorizationControl },
    { tester: hostControlTester, renderer: hostControl },
    { tester: allowedOriginsTester, renderer: allowedOriginsControl },
  ];
  const [formData, setFormData] = useState<any>(ruleset.ruleset);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  useEffect(() => {
    // Update the CodeMirror value when formData changes
    setTextAreaValue(JSON.stringify(formData, null, 2));
  }, [formData]);

  const handleCodeMirrorChange = (value: string) => {
    setTextAreaValue(value);
    try {
      const parsedData = JSON.parse(value);
      setFormData(parsedData);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  const handleSubmit = async () => {
    const payload = { ruleset_json: formData };
    try {
      // Update the existing ruleset
      await RulesetDataService.updateRuleset(
        payload,
        companyName,
        params.app_id,
        ruleset.rulesetID
      );
      router.push(`/applications/${params.app_id}/rulesets/${ruleset.rulesetID}`);
    } catch (error) {
      console.error("Error submitting ruleset:", error);
    }
  };

  return (
    <Flex gap="middle" vertical>
      <Splitter>
        <Splitter.Panel
          style={{ padding: "0 20px 0  0" }}
          defaultSize="70%"
          max="90%"
        >
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={formData}
            renderers={renderers}
            cells={vanillaCells}
            onChange={(formData: { data: any }) => setFormData(formData.data)}
          />
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save Changes
          </button>
        </Splitter.Panel>
        <Splitter.Panel collapsible>
          <CodeMirror
            value={textAreaValue}
            extensions={[
              javascript(),
              keymap.of(defaultKeymap),
              EditorView.lineWrapping,
            ]}
            onChange={handleCodeMirrorChange}
            theme={barf}
          />
        </Splitter.Panel>
      </Splitter>
    </Flex>
  );
}
