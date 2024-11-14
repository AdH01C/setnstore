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
import tabsCategorizationLayout from "@/app/components/renderer/tabs/TabsCategorizationLayout";
import tabsCategorizationLayoutTester from "@/app/components/renderer/tabs/TabsCategorizationLayoutTester";
import { useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { barf } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import React from "react";
import { Button, Flex, Splitter, Upload, message } from "antd";
import { EditorView } from "@codemirror/view";
import { UploadOutlined } from "@ant-design/icons";

export default function RulesetForm({
  formData,
  onFormChange,
}: {
  formData: any;
  onFormChange: (data: any) => void;
}) {
  const renderers = [
    ...vanillaRenderers,
    {
      tester: tabsCategorizationLayoutTester,
      renderer: tabsCategorizationLayout,
    },
    { tester: authorizationControlTester, renderer: authorizationControl },
    { tester: hostControlTester, renderer: hostControl },
    { tester: allowedOriginsTester, renderer: allowedOriginsControl },
    { tester: metaDataControlTester, renderer: MetaDataControl },
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
  const handleFileChange = (info: { file: any }) => {
    const file = info.file;

    if (file.status === "done") {
      const reader = new FileReader();
      reader.readAsText(file.originFileObj);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === "string") {
          onFormChange(JSON.parse(e.target.result));
        }
      };
      message.success("File upload failed.");
    } else if (file.status === "error") {
      message.error("File upload failed.");
    }
  };

  return (
    <>
      <Flex gap="middle" vertical style={{ height: "100vh" }}>
        <Splitter>
          {/* Left panel containing the JsonForms with independent scrolling */}
          <Splitter.Panel
            style={{
              paddingRight: "20px",
              height: "100%",
              overflowY: "auto",
              padding: "0 20px 0 0",
              position: "relative",
              display: "inline-block",
            }}
          >
            <Flex
              style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
              gap="middle"
            >
              <Button>View Guide</Button>
              <Upload
                name="file"
                accept=".json"
                showUploadList={false}
                onChange={handleFileChange}
              >
                <Button icon={<UploadOutlined />}>Click to Upload JSON</Button>
              </Upload>
            </Flex>
            <div style={{ position: "relative" }}>
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
            </div>
          </Splitter.Panel>

          {/* Right panel containing CodeMirror with independent scrolling */}
          <Splitter.Panel
            defaultSize="30%"
            max="35%"
            style={{
              height: "100%",
              overflowY: "auto", // Independent scrolling for the CodeMirror editor
            }}
          >
            <CodeMirror
              value={textAreaValue}
              extensions={[
                javascript(),
                keymap.of(defaultKeymap),
                EditorView.lineWrapping,
              ]}
              onChange={handleCodeMirrorChange}
              theme={barf}
              height="100%" // Ensure CodeMirror takes up the full height
            />
          </Splitter.Panel>
        </Splitter>
      </Flex>
    </>
  );
}
