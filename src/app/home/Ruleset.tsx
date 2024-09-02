"use client"

import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';
import { useEffect, useState } from 'react';
import Loading from '@/app/components/Loading';
import { Button, Drawer } from 'antd';
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

const schema: RJSFSchema = {
    "title": "Configuration Schema",
    "description": "Schema for configuration settings including metadata, authorization, and host information.",
    "type": "object",
    "properties": {
      "metadata": {
        "type": "object",
        "properties": {
          "trailingSlashMode": { "type": "string" },
          "redirectSlashes": { "type": "string" },
          "caseSensitive": { "type": "boolean" },
          "entityValueCase": { "type": "string" },
          "optionsPassthrough": { "type": "boolean" }
        },
        "required": ["trailingSlashMode", "caseSensitive", "entityValueCase", "optionsPassthrough"]
      },
      "authorization": {
        "type": "object",
        "properties": {
          "user": {
            "type": "object",
            "properties": {
              "relations": {
                "type": "object",
                "properties": {
                  "user": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "facet": { "type": "string" } } }
                  }
                }
              },
              "permissions": {
                "type": "object",
                "properties": {
                  "read": { "type": "object", "properties": { "relation": { "type": "string" } } }
                }
              }
            }
          },
          "serviceaccount": { "type": "object" },
          "code": {
            "type": "object",
            "properties": {
              "relations": {
                "type": "object",
                "properties": {
                  "reader": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "facet": { "type": "string" } } }
                  },
                  "writer": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "facet": { "type": "string" } } }
                  },
                  "admin": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "facet": { "type": "string" } } }
                  }
                }
              },
              "permissions": {
                "type": "object",
                "properties": {
                  "read": {
                    "type": "object",
                    "properties": {
                      "type": { "type": "string" },
                      "operations": {
                        "type": "array",
                        "items": { "type": "object", "properties": { "relation": { "type": "string" } } }
                      }
                    }
                  },
                  "write": {
                    "type": "object",
                    "properties": {
                      "type": { "type": "string" },
                      "operations": {
                        "type": "array",
                        "items": { "type": "object", "properties": { "relation": { "type": "string" } } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "host": {
        "type": "object",
        "patternProperties": {
          "^.+$": {
            "type": "object",
            "properties": {
              "permission": {
                "type": "object",
                "properties": {
                  "GET": { "type": ["object", "null"] },
                  "POST": { "type": ["object", "null"] },
                  "PATCH": { "type": ["object", "null"] },
                  "PUT": { "type": ["object", "null"] },
                  "DELETE": { "type": ["object", "null"] },
                  "OPTIONS": { "type": ["object", "null"] }
                }
              },
              "children": {
                "type": "object",
                "patternProperties": {
                  "^#?$": {
                    "type": "object",
                    "properties": {
                      "entity": { "type": "string" },
                      "relations": { "type": "array", "items": { "type": "string" } },
                      "permission": {
                        "type": "object",
                        "properties": {
                          "GET": { "type": ["object", "null"] },
                          "POST": { "type": ["object", "null"] },
                          "PATCH": { "type": ["object", "null"] },
                          "PUT": { "type": ["object", "null"] },
                          "DELETE": { "type": ["object", "null"] }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "required": ["metadata", "authorization", "host"]
  }


type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: 'Project 1',
    children: [
      { key: '11', label: 'Option 1' },
      { key: '12', label: 'Option 2' },
      { key: '13', label: 'Option 3' },
      { key: '14', label: 'Option 4' },
    ],
  },
  {
    key: '2',
    icon: <AppstoreOutlined />,
    label: 'Project 2',
    children: [
      { key: '21', label: 'Option 1' },
      { key: '22', label: 'Option 2' },
      {
        key: '23',
        label: 'Submenu',
        children: [
          { key: '231', label: 'Option 1' },
          { key: '232', label: 'Option 2' },
          { key: '233', label: 'Option 3' },
        ],
      },
      {
        key: '24',
        label: 'Submenu 2',
        children: [
          { key: '241', label: 'Option 1' },
          { key: '242', label: 'Option 2' },
          { key: '243', label: 'Option 3' },
        ],
      },
    ],
  },
  {
    key: '3',
    icon: <SettingOutlined />,
    label: 'Project 3',
    children: [
      { key: '31', label: 'Option 1' },
      { key: '32', label: 'Option 2' },
      { key: '33', label: 'Option 3' },
      { key: '34', label: 'Option 4' },
    ],
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


export default function Ruleset() {
    const log = (type: string) => console.log.bind(console, type);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        // Allow time for render
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 50);

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    const [stateOpenKeys, setStateOpenKeys] = useState(['1']);

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
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
            .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
        );
        } else {
        // close
        setStateOpenKeys(openKeys);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full text-4xl gap-8 font-bold">
            {isLoading ? (
                <Loading />
            ) : (
            <div className="flex">
                <Menu
                mode="inline"
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                style={{ width: 256 }}
                items={items}
                className='rounded-lg bg-[#E9E9E9]'
                />
                <div className="flex flex-col items-center w-full">
                    <QuestionCircleOutlined type="primary" onClick={showDrawer} className='w-full justify-end px-8 text-2xl' />
                    <Form
                        className="flex flex-col w-3/4 px-32 bg-[#FFFFFFFF] p-4 rounded-lg relative bottom-6 pt-12" 
                        schema={schema}
                        validator={validator}
                        onChange={(e) => {console.log(e.formData); setFormData(e.formData)}}
                        onSubmit={log('submitted')}
                        onError={log('errors')}
                        formData={formData}
                    />
                </div>
            </div>
            )}
            
            <Drawer title="Generated JSON" onClose={onClose} open={open}>
                <pre>
                    <code>{JSON.stringify(formData, null, 2)}</code> {/* Format JSON with indentation */}
                </pre>
            </Drawer>
        </div>
    );
}