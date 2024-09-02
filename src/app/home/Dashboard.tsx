"use client"

import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';
import { useEffect, useState } from 'react';
import Loading from '@/app/components/Loading';

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
  

export default function Dashboard() {
    const log = (type: string) => console.log.bind(console, type);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Allow time for render
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 150);

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full text-4xl gap-16 font-bold">
            <h1 className="flex justify-center py-2 bg-secondary w-full rounded-lg">Dashboard</h1>
            {/* <div className='flex  justify-between items-center'> */}
            {isLoading ? (
                <Loading />
            ) : (
                <Form
                    className="w-3/4 bg-[#f0f2f5] p-4 rounded-lg"
                    schema={schema}
                    validator={validator}
                    onChange={log('changed')}
                    onSubmit={log('submitted')}
                    onError={log('errors')}
                />
            )}
            {/* </div> */}
            
        </div>
    );
}