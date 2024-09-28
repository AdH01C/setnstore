import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";

// Code Mirror
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view"; // For key bindings
import { defaultKeymap } from "@codemirror/commands"; // Default key bindings
import { barf } from "thememirror"; // Import the specific theme

// JSON Schema Form
import { initialFormData } from "@/app/data/initialFormData";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
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

// Ant Design Icons and Menu
import type { MenuProps } from "antd";
import { Menu } from "antd";

// Backend Hooks
import RulesetDataService from "@/app/services/RulesetDataService";
import applicationDataService from "../services/ApplicationDataService";

// Define interface for the fetched project data
interface Project {
  name: string;
  appId: string;
  rulesets: string[];
}

// Antd Sidebar MenuItem type
type MenuItem = Required<MenuProps>["items"][number];

const generateMenuItems = (projects: Project[]): MenuItem[] => {
  return projects.map((project, index) => ({
    key: project.appId,
    label: project.name,
    children: [
      {
        key: `${project.appId}-new`,
        label: "New Ruleset",
        meta: { appId: "" },
      },
      ...project.rulesets.map((ruleset, childIndex) => ({
        key: `${project.appId}-${ruleset}`,
        label: ruleset,
        meta: { appId: project.appId },
      })),
    ],
  }));
};

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

// Function to get level keys for open/close behavior
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

const renderers = [
  ...vanillaRenderers,
  //register custom renderers
  { tester: metaDataControlTester, renderer: MetaDataControl },
  { tester: authorizationControlTester, renderer: authorizationControl },
  { tester: hostControlTester, renderer: hostControl },
  { tester: allowedOriginsTester, renderer: allowedOriginsControl },
];

export default function Ruleset({
  companyName,
  appId: initialAppId,
}: {
  companyName: string;
  appId: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(["1"]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [levelKeys, setLevelKeys] = useState<Record<string, number>>({});
  const [selectedAppKey, setSelectedAppKey] = useState<string | null>(
    initialAppId
  );
  const [selectedRulesetKey, setSelectedRulesetKey] = useState<string>("");

  useEffect(() => {
    // Fetch rulesets and populate the sidebar
    const fetchProjects = async () => {
      try {
        const response =
          await applicationDataService.getAllApplicationsByCompanyName(
            companyName
          );
        const projects: Project[] = await Promise.all(
          response.data.map(async (application: any) => {
            const rulesetResponse = await RulesetDataService.getRulesetsByAppId(
              companyName,
              application.id
            );
            return {
              name: application.app_name,
              rulesets: rulesetResponse.data,
              appId: application.id,
            };
          })
        );
        const generatedItems = generateMenuItems(projects);
        setItems(generatedItems);

        // Get level keys based on the generated menu items
        const levelKeyMap = getLevelKeys(
          generatedItems as unknown as LevelKeysProps[]
        );
        setLevelKeys(levelKeyMap);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();

    // Allow time for render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchRuleset = async () => {
      if (!selectedAppKey) return;

      try {
        const rulesets = await RulesetDataService.getRulesetsByAppId(
          companyName,
          selectedAppKey
        );
        if (rulesets.data.length > 0) {
          const initialRuleset = rulesets.data[0]; // Load the first ruleset on initial load
          const ruleset = await RulesetDataService.getRulesetByRulesetId(
            companyName,
            selectedAppKey,
            initialRuleset
          );
          setFormData(ruleset.ruleset_json);
          setSelectedRulesetKey(`${selectedAppKey}-${initialRuleset}`);
        } else {
          setFormData(initialFormData); // No ruleset exists, use initialFormData
          setSelectedRulesetKey(`${selectedAppKey}-new`);
        }

        setStateOpenKeys((prevKeys) => {
          const newKeys = [...prevKeys, selectedAppKey];
          return Array.from(new Set(newKeys));
        });
      } catch (error) {
        console.error("Error fetching ruleset:", error);
      }
    };

    fetchRuleset();
  }, [companyName, selectedAppKey]);

  useEffect(() => {
    // Update the CodeMirror value when formData changes
    setTextAreaValue(JSON.stringify(formData, null, 2));
  }, [formData]);

  const onOpenChange = (openKeys: string[]) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const handleRulesetClick = async (appId: string, rulesetKey: string) => {
    setSelectedAppKey(appId); // Update the selectedAppKey

    try {
      if (rulesetKey === "new") {
        setFormData(initialFormData);
        setSelectedRulesetKey(`${appId}-new`); // Set the selectedRulesetKey for new ruleset
      } else {
        const rulesets = await RulesetDataService.getRulesetsByAppId(
          companyName,
          appId
        );
        const selectedRuleset = rulesets.data.find(
          (rulesetId: string) => rulesetId === rulesetKey
        );
        if (selectedRuleset) {
          const rulesetData = await RulesetDataService.getRulesetByRulesetId(
            companyName,
            appId,
            selectedRuleset
          );
          setFormData(rulesetData.ruleset_json);
          setSelectedRulesetKey(`${appId}-${selectedRuleset}`); // Update selectedRulesetKey
        } else {
          setFormData(initialFormData);
        }
      }
    } catch (error) {
      console.error("Error loading ruleset:", error);
    }
  };

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
    try {
      if (!selectedAppKey) return;
      const payload = { ruleset_json: formData };

      if (selectedRulesetKey === `${selectedAppKey}-new`) {
        // Create a new ruleset
        const response = await RulesetDataService.createRuleset(
          payload,
          companyName,
          selectedAppKey
        );
        const newRulesetId = response.data.id;

        // Update the items state to include the new ruleset
        setItems((prevItems: any) => {
          const updatedItems = prevItems.map((item: any) => {
            if (item.key === selectedAppKey) {
              return {
                ...item,
                children: [
                  ...item.children,
                  {
                    key: `${selectedAppKey}-${newRulesetId}`,
                    label: newRulesetId,
                    meta: { appId: selectedAppKey },
                  },
                ],
              };
            }
            return item;
          });
          return updatedItems;
        });
        setSelectedRulesetKey(`${selectedAppKey}-${newRulesetId}`);
      } else {
        // Update the existing ruleset
        const rulesetId = selectedRulesetKey.split("-")[1];
        await RulesetDataService.updateRuleset(
          payload,
          companyName,
          selectedAppKey,
          rulesetId
        );
      }
    } catch (error) {
      console.error("Error submitting ruleset:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-4xl font-bold">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-between gap-4">
          {/* Sidebar */}
          <Menu
            mode="inline"
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            style={{ width: 256 }}
            items={items}
            className="rounded-lg bg-[#E9E9E9]"
            selectedKeys={[selectedRulesetKey ?? ""]}
            onClick={({ key }) => {
              const appId = key.split("-")[0];
              const rulesetKey = key.includes("new")
                ? "new"
                : key.split("-")[1];
              handleRulesetClick(appId, rulesetKey);
            }}
          />

          {/* JSON Form */}
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
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </div>

          {/* CodeMirror */}
          <CodeMirror
            value={textAreaValue}
            extensions={[javascript(), keymap.of(defaultKeymap)]}
            onChange={handleCodeMirrorChange}
            theme={barf}
            className="w-[512px] h-full rounded-lg text-sm"
          />
        </div>
      )}
    </div>
  );
}
