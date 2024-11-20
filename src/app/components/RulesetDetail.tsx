import { Button, Card, Flex, Space, Typography } from "antd";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import React from "react";
import { barf } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import { JsonForms } from "@jsonforms/react";
import schema from "@/app/json/schema.json";
import uischema from "@/app/json/uischema.json";
import { vanillaRenderers, vanillaCells } from "@jsonforms/vanilla-renderers";
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
import { RefsContext } from "./FormContext";

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
  const tabs = {
    key: "JSON",
    label: "JSON",
    children: (
      <CodeMirror
        value={JSON.stringify(ruleset, null, 2)}
        extensions={[
          javascript(),
          keymap.of(defaultKeymap),
          EditorView.lineWrapping,
        ]}
        theme={barf}
        height="85vh"
        editable={false}
      />
    ),
  };

  const operations = (
    <Flex
      style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
      gap="middle"
    >
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
    </Flex>
  );

  return (
    <>
      {ruleset && (
        <RefsContext.Provider value={{ tabs, operations }}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={ruleset}
            renderers={renderers}
            cells={vanillaCells}
            readonly={true}
          />
        </RefsContext.Provider>
        // <Card
        //   title={<Title level={4}>Final Ruleset Details</Title>}
        //   bordered={true}
        //   style={{ width: "100%", marginTop: "20px" }}
        // >
        //   <CodeMirror
        //     value={JSON.stringify(ruleset, null, 2)}
        //     extensions={[
        //       javascript(),
        //       keymap.of(defaultKeymap),
        //       EditorView.lineWrapping,
        //     ]}
        //     theme={barf}
        //     height="100%" // Ensure CodeMirror takes up the full height
        //     editable={false}
        //   />

        //   <Space style={{ marginTop: "20px" }}>
        //     {isEditable && (
        //       <Button type="primary" onClick={onEdit}>
        //         Edit Ruleset
        //       </Button>
        //     )}
        //     {isDeletable && (
        //       <Button type="primary" danger onClick={onDelete}>
        //         Delete Ruleset
        //       </Button>
        //     )}
        //   </Space>
        // </Card>
      )}
    </>
  );
}
