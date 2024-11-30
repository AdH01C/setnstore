import { defaultKeymap } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import { EditorView, keymap } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { Button, Flex } from "antd";
import { barf } from "thememirror";

import allowedOriginsControl from "@/app/components/renderer/allowedOrigins/AllowedOriginsControl";
import allowedOriginsTester from "@/app/components/renderer/allowedOrigins/AllowedOriginsTester";
import authorizationControl from "@/app/components/renderer/authorization/AuthorizationControl";
import authorizationControlTester from "@/app/components/renderer/authorization/AuthorizationControlTester";
import hostControl from "@/app/components/renderer/host/HostControl";
import hostControlTester from "@/app/components/renderer/host/HostControlTester";
import MetaDataControl from "@/app/components/renderer/metadata/MetaDataControl";
import metaDataControlTester from "@/app/components/renderer/metadata/MetaDataControlTester";
import tabsCategorizationLayout from "@/app/components/renderer/tabs/TabsCategorizationLayout";
import tabsCategorizationLayoutTester from "@/app/components/renderer/tabs/TabsCategorizationLayoutTester";
import schema from "@/app/constants/schema.json";
import uischema from "@/app/constants/uischema.json";

import { RefsContext } from "./FormContext";

interface RulesetDetailProps {
  ruleset: any;
  isEditable?: boolean;
  isDeletable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function RulesetDetail({ ruleset, isEditable = false, isDeletable = false, onEdit, onDelete }: RulesetDetailProps) {
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
          json(),
          keymap.of(defaultKeymap),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ tabindex: "0" }),
        ]}
        theme={barf}
        height="85vh"
        editable={false}
      />
    ),
  };

  const operations = (
    <Flex style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }} gap="middle">
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
      )}
    </>
  );
}

export { RulesetDetail };
