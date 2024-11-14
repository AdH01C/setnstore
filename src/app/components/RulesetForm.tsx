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
import { useEffect, useRef, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { barf } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import React from "react";
import {
  Button,
  Flex,
  Splitter,
  Tour,
  TourProps,
  Typography,
  Upload,
  message,
} from "antd";
import { EditorView } from "@codemirror/view";
import { UploadOutlined } from "@ant-design/icons";
import { RefsContext } from "./FormContext";
const { Text, Paragraph } = Typography;

export default function RulesetForm({
  formData,
  onFormChange,
  operations,
}: {
  formData: any;
  onFormChange: (data: any) => void;
  operations?: React.JSX.Element[];
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

  const [open, setOpen] = useState<boolean>(false);

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
      message.success("File upload successfully.");
    } else if (file.status === "error") {
      message.error("File upload failed.");
    }
  };

  const formRef = useRef(null);
  const editorRef = useRef(null);
  const uploadRef = useRef(null);

  const steps: TourProps["steps"] = [
    {
      title: "Ruleset Editor",
      description: (
        <>
          <Paragraph>
            The <strong>Ruleset Editor</strong> allows you to define and manage
            authorization rules for your application in a JSON format called
            <em> Rulesets</em>. This structure lets you specify how different
            entities interact with various paths of your application.
          </Paragraph>
          <Paragraph>
            The <strong>Authorization</strong> form lets you define the entities
            (like users, roles, or permissions) that control access to your app.
            These entities are tied to the paths configured in the
            <strong> Hosts</strong> form, determining who can access which
            resources based on their relationships.
          </Paragraph>
          <Paragraph>
            In the <strong>Hosts</strong> form, you configure access rules for
            specific URL paths, such as
            <Text code>example.com/product/book</Text> or
            <Text code>example.com/checkout</Text>. Each path can have its own
            authorization rules, allowing fine-grained control over who can
            access different resources.
          </Paragraph>
          <Paragraph>
            The <strong>Allowed Origins</strong> form is used to manage CORS
            (Cross-Origin Resource Sharing) settings, controlling which external
            domains can interact with your application securely.
          </Paragraph>
          <Paragraph>
            The <strong>Metadata</strong> form provides a way to configure
            additional attributes related to your authorization rules.
          </Paragraph>
        </>
      ),
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
    },
    {
      title: "Form Editor",
      description: (
        <>
          <Paragraph>
            The <strong>Form Editor</strong> lets you dynamically edit Rulesets
            through four forms: <strong>Authorization</strong>,{" "}
            <strong>Host</strong>, <strong>Allowed Origins</strong>, and{" "}
            <strong>Metadata</strong>.
          </Paragraph>
          <Paragraph>
            Each form automatically updates the Ruleset JSON, allowing you to
            easily configure the rules for your application without needing to
            write code manually.
          </Paragraph>
        </>
      ),
      placement: "right",
      target: () => formRef.current,
    },
    {
      title: "Code Editor",
      description: (
        <>
          <Paragraph>
            The <strong>Code Editor</strong> offers a live preview of your
            Ruleset and supports direct editing.
          </Paragraph>
          <Paragraph>
            Changes made in both the form and the editor are synchronized,
            allowing you to instantly see how updates affect your rules and
            configuration.
          </Paragraph>
        </>
      ),
      placement: "left",
      target: () => editorRef.current,
    },
    {
      title: "Upload JSON",
      description: (
        <Paragraph>
          The <strong>Upload JSON</strong> feature allows you to import
          pre-configured Rulesets.
        </Paragraph>
      ),
      target: () => uploadRef.current,
    },
  ];

  const extendedOperations = (
    <Flex
      style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
      gap="middle"
    >
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        View Guide
      </Button>
      <Upload
        name="file"
        accept=".json"
        showUploadList={false}
        onChange={handleFileChange}
      >
        <Button ref={uploadRef} icon={<UploadOutlined />}>
          Upload JSON
        </Button>
      </Upload>
      {operations}
    </Flex>
  );

  return (
    <>
      <Flex gap="middle" vertical style={{ height: "85vh" }}>
        <Splitter>
          {/* Left panel containing the JsonForms with independent scrolling */}
          <Splitter.Panel
            style={{
              paddingRight: "20px",
              height: "100%",
              overflowY: "scroll",
              padding: "0 20px 0 0",
            }}
          >
            <RefsContext.Provider
              value={{ formRef, operations: extendedOperations }}
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
            </RefsContext.Provider>
          </Splitter.Panel>

          {/* Right panel containing CodeMirror with independent scrolling */}
          <Splitter.Panel defaultSize="30%" max="35%">
            <div ref={editorRef}>
              <CodeMirror
                value={textAreaValue}
                extensions={[
                  javascript(),
                  keymap.of(defaultKeymap),
                  EditorView.lineWrapping,
                ]}
                onChange={handleCodeMirrorChange}
                theme={barf}
                height="85vh"
              />
            </div>
          </Splitter.Panel>
        </Splitter>
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </Flex>
    </>
  );
}
