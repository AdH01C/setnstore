import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import CodeMirror, { keymap } from "@uiw/react-codemirror";
import schema from "@/app/json/schema.json";
import uischema from "@/app/json/uischema.json";
import metaDataControlTester from "@/app/components/renderer/metadata/MetaDataControlTester";
import MetaDataControl from "@/app/components/renderer/metadata/MetaDataControl";
import authorizationControlTester from "@/app/components/renderer/authorization/AuthorizationControlTester";
import authorizationControl from "@/app/components/renderer/authorization/AuthorizationControl";
import hostControlTester from "@/app/components/renderer/host/HostControlTester";
import hostControl from "@/app/components/renderer/host/HostControl";
import allowedOriginsTester from "@/app/components/renderer/allowedOrigins/AllowedOriginsTester";
import allowedOriginsControl from "@/app/components/renderer/allowedOrigins/AllowedOriginsControl";
import { useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { barf } from "thememirror";
import { defaultKeymap } from "@codemirror/commands"; // Default key bindings
import React from "react";
import { Flex, Splitter } from "antd";
import { EditorView } from "@codemirror/view";

export default function RulesetForm({
  host,
  formData,
  onFormChange,
}: {
  host?: string;
  formData: any;
  onFormChange: (data: any) => void;
}) {
  const renderers = [
    ...vanillaRenderers,
    //register custom renderers
    { tester: metaDataControlTester, renderer: MetaDataControl },
    { tester: authorizationControlTester, renderer: authorizationControl },
    { tester: hostControlTester, renderer: hostControl },
    { tester: allowedOriginsTester, renderer: allowedOriginsControl },
  ];

  const [textAreaValue, setTextAreaValue] = useState<string>("");

  useEffect(() => {
    // Update the CodeMirror value when formData changes
    setTextAreaValue(JSON.stringify(formData, null, 2));
  }, [formData]);

  const handleCodeMirrorChange = (value: string) => {
    setTextAreaValue(value);
    try {
      const parsedData = JSON.parse(value);
      onFormChange(parsedData);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <>
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
              onChange={(formData: { data: any }) =>
                onFormChange(formData.data)
              }
            />
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
    </>
  );
}