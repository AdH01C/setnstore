import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";

// Code mirror
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view"; // For key bindings
import { defaultKeymap } from "@codemirror/commands"; // Default key bindings
import { barf } from "thememirror"; // Import the specific theme

// JSON Schema Form
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import schema from "@/app/schema.json";
import uischema from "@/app/uischema.json";
import metaDataControlTester from "@/app/components/renderer/MetaDataControlTester";
import MetaDataControl from "@/app/components/renderer/MetaDataControl";
import authorizationControlTester from "@/app/components/renderer/AuthorizationControlTester";
import authorizationControl from "@/app/components/renderer/AuthorizationControl";

// Ant Design Icons
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

// Backend Hooks
import RulesetDataService from "@/app/services/RulesetDataService";

// Antd Sidebar
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "1",
    icon: <MailOutlined />,
    label: "http.127.0.0.1.nip.io:8443",
    children: [{ key: "11", label: "/" }],
  },
];

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

// JSON Forms
const initialData = {
  metadata: {
    trailingSlashMode: "strict",
    redirectSlashes: "",
    caseSensitive: true,
    entityValueCase: "none",
    optionsPassthrough: true,
  },
  authorization: {
    user: {
      relations: {
        friend: [{ facet: "user" }],
        mutualFriend: [{ facet: "user" }],
      },
      permissions: {
        sendMessage: {
          type: "union",
          operations: [{ relation: "friend" }, { relation: "mutualFriend" }],
        },
      },
    },
    serviceaccount: {},
    code: {
      relations: {
        reader: [{ facet: "user" }, { facet: "serviceaccount" }],
        writer: [{ facet: "user" }, { facet: "serviceaccount" }],
        admin: [{ facet: "user" }, { facet: "serviceaccount" }],
      },
      permissions: {
        read: {
          type: "union",
          operations: [{ relation: "reader" }, { relation: "admin" }],
        },
        write: {
          type: "union",
          operations: [{ relation: "writer" }, { relation: "admin" }],
        },
      },
    },
  },
  host: {
    "http.127.0.0.1.nip.io:8443": {
      "": {
        permission: {
          GET: null,
        },
      },
      flasgger_static: {
        children: {
          "#": {
            entity: "static",
            relations: [],
            permission: {
              GET: null,
            },
            children: {
              "#": {
                entity: "lib",
                relations: [],
                permission: {
                  GET: null,
                },
              },
            },
          },
        },
      },
      "spec.json": {
        permission: {
          GET: null,
        },
      },
      get: {
        permission: {
          GET: null,
        },
      },
      post: {
        permission: {
          POST: null,
        },
      },
      patch: {
        permission: {
          PATCH: null,
        },
      },
      put: {
        permission: {
          PUT: null,
        },
      },
      delete: {
        permission: {
          DELETE: null,
        },
      },
      status: {
        children: {
          "#": {
            entity: "code",
            permission: {
              GET: {
                entity: "code",
                type: "read",
              },
              POST: {
                entity: "code",
                type: "write",
              },
              PATCH: {
                entity: "code",
                type: "write",
              },
              PUT: {
                entity: "code",
                type: "write",
              },
              DELETE: {
                entity: "code",
                type: "admin",
              },
            },
          },
        },
      },
      headers: {
        permission: {
          GET: {},
        },
      },
      options: {
        permission: {
          OPTIONS: null,
        },
      },
      ip: {
        permission: {
          GET: {},
        },
      },
      "user-agent": {
        permission: {
          GET: {},
        },
      },
      anything: {
        permission: {
          GET: {},
          POST: {},
          PATCH: {},
          PUT: {},
          DELETE: {},
        },
        children: {
          "#": {
            entity: "anything",
            permission: {
              GET: {},
              POST: {},
              PATCH: {},
              PUT: {},
              DELETE: {},
            },
          },
        },
      },
    },
  },
};

const renderers = [
  ...vanillaRenderers,
  //register custom renderers
  { tester: authorizationControlTester, renderer: authorizationControl },
  { tester: metaDataControlTester, renderer: MetaDataControl },
];

export default function Ruleset() {
  const [isLoading, setIsLoading] = useState(true);
  // const [formData, setFormData] = useState<any>(hostJSON);
  const [formData, setFormData] = useState<any>(initialData);
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  useEffect(() => {
    // Allow time for render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update the CodeMirror value when formData changes
    setTextAreaValue(JSON.stringify(formData, null, 2));
  }, [formData]);

  const [stateOpenKeys, setStateOpenKeys] = useState(["1"]);

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const handleCodeMirrorChange = (value: string) => {
    setTextAreaValue(value);

    try {
      // Try to parse the JSON from CodeMirror editor
      const parsedData = JSON.parse(value);
      setFormData(parsedData);
    } catch (error) {
      // If parsing fails, keep the current formData
      console.error("Invalid JSON:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const companyName = "company1"; // Replace with actual company name
      const appId = "qNdPP5Qy1kP"; // Replace with actual app ID
      const rulesetId = "IPYCw0KjNqA"; // Replace with actual ruleset ID
      const payload = {
        ruleset_json: formData, // Wrap formData inside the "ruleset_json" key
      };

      // Check if the ruleset exists
      const existingRuleset = await RulesetDataService.getRulesetByRulesetId(
        companyName,
        appId,
        rulesetId // Replace with actual ruleset ID
      );

      if (existingRuleset) {
        // Update the existing ruleset
        await RulesetDataService.updateRuleset(
          payload,
          companyName,
          appId,
          rulesetId
        );
        console.log("Ruleset updated successfully");
      } else {
        // Create a new ruleset
        await RulesetDataService.createRuleset(payload, companyName, appId);
        console.log("Ruleset created successfully");
      }
    } catch (error) {
      console.error("Error creating ruleset:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-4xl font-bold">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-between gap-4">
          {/* <Form
            className="flex flex-col bg-[#FFFFFFFF] p-4 rounded-lg w-1/2"
            schema={schema}
            validator={validator}
            onChange={(e) => {
              setFormData({ ...formData, ...e.formData });
            }}
            onSubmit={handleSubmit}
            onError={log("errors")}
            formData={formData}
          /> */}
          <div>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={formData}
              renderers={renderers}
              cells={vanillaCells}
              onChange={(formData: { data: any }) => setFormData(formData.data)}
            />

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </div>

          <CodeMirror
            value={textAreaValue}
            extensions={[
              javascript(), // JavaScript mode for syntax highlighting
              keymap.of(defaultKeymap), // Add key bindings for basic text editing
            ]}
            onChange={handleCodeMirrorChange}
            theme={barf}
            className="w-1/2 h-full rounded-lg text-sm"
          />
        </div>
      )}
    </div>
  );
}
