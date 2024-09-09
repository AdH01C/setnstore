import { RJSFSchema } from '@rjsf/utils';

export const schema: RJSFSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Authlink Ruleset",
    "description": "Authlink Ruleset is a policy that describes and defines the access for each route in the application that is secured by Authlink.",
    "definitions": {
      "requirement": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "entity": {
            "type": "string",
            "description": "The name of an entity associated with the resource, e.g., 'App', 'Organization', etc."
          },
          "type": {
            "type": "string",
            "description": "The permission required to access the entity, e.g., 'read', 'write', etc."
          }
        }
      },
      "permission": {
        "type": "object",
        "additionalProperties": false,
        "patternProperties": {
          "^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$": {
            "oneOf": [
              {
                "type": "null",
                "description": "No authentication or authorization is required for the given operation."
              },
              {
                "$ref": "#/definitions/requirement",
                "description": "The permission required for the operation. E.g., if the 'entity'='Organization' and the 'permission'='read', Authlink will check if the User has read access to the Organization with identifier {app_identifier}, where {app_identifier} is the value registered to the entity."
              }
            ]
          }
        }
      },
      "children": {
        "type": "object",
        "additionalProperties": false,
        "description": "The rules associated with the path segment. The path segments must be lowercase and are case insensitive during permission computation.",
        "patternProperties": {
          "^(?:[^%/?#A-Z]|%(?:[0-9A-Fa-f]{2}))*$": {
            "type": "object",
            "additionalProperties": false,
            "description": "A key-value pair corresponding to a path segment and the permissions respectively, the path segment is appended to the preceding path segment(s) to form the complete path where the permissions are applied to.",
            "properties": {
              "permission": {
                "$ref": "#/definitions/permission",
                "description": "The permission required for each operation in the given path."
              },
              "children": {
                "$ref": "#/definitions/children",
                "description": "The next path segment(s) in the Ruleset hierarchy."
              }
            }
          },
          "^#$": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "entity": {
                "type": "string",
                "description": "The name of an entity to assign the resource identifier. For example, if the value is set to \"Organization\" and the value extracted for this path segment from the URL accessed is \"1000\", Authlink will register \"Organization\"=\"1000\"."
              },
              "permission": {
                "$ref": "#/definitions/permission",
                "description": "The permission required for each operation in the given path."
              },
              "children": {
                "$ref": "#/definitions/children",
                "description": "The next path segment(s) in the Ruleset hierarchy."
              },
              "relations": {
                "$ref": "#/definitions/relations",
                "description": "Specifies any parent-child relationship associated with this entity."
              }
            },
            "required": ["entity"]
          }
        }
      },
      "mixedCaseChildren": {
        "type": "object",
        "additionalProperties": false,
        "description": "The rules associated with the path segment. The path segments can be in any capitalization and are case sensitive during permission computation.",
        "patternProperties": {
          "^(?:[^%/?#]|%(?:[0-9A-Fa-f]{2}))*$": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "permission": {
                "$ref": "#/definitions/permission",
                "description": "The permission required for each operation in the given path."
              },
              "children": {
                "$ref": "#/definitions/mixedCaseChildren",
                "description": "The next path segment(s) in the Ruleset hierarchy."
              }
            }
          },
          "^#$": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "entity": {
                "type": "string",
                "description": "The name of an entity to assign the resource identifier. For example, if the value is set to \"Organization\" and the value extracted for this path segment from the URL accessed is \"1000\", Authlink will register \"Organization\"=\"1000\"."
              },
              "permission": {
                "$ref": "#/definitions/permission",
                "description": "The permission required for each operation in the given path."
              },
              "children": {
                "$ref": "#/definitions/mixedCaseChildren",
                "description": "The next path segment(s) in the Ruleset hierarchy."
              },
              "relations": {
                "$ref": "#/definitions/relations",
                "description": "Specifies any parent-child relationship associated with this entity."
              }
            },
            "required": ["entity"]
          }
        }
      },
      "metadata": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "trailingSlashMode": {
            "type": "string",
            "enum": ["strict", "fallback"],
            "description": "Specifies how trailing slashes in the URL are handled. `Strict` policy treats \"/a/\" as different routes \"/a\", whereas `fallback` policy treats \"/a/\" as \"/a\" if a permission is not set on route \"/a\"."
          },
          "redirectSlashes": {
            "type": "string",
            "enum": ["ignore", "strip", "append", ""],
            "description": "Specifies if trailing slashes are added or striped from the users browsers.."
          },
          "caseSensitive": {
            "type": "boolean",
            "description": "Specifies whether the Ruleset should be case sensitive."
          },
          "entityValueCase": {
            "type": "string",
            "enum": ["none", "lowercase", "uppercase"],
            "description": "Specifies whether the entity value should be converted to lowercase, uppercase, or remain unchanged.",
            "default": "none"
          },
          "optionsPassthrough": {
            "type": "boolean",
            "description": "If True all options call are allowed without checks."
          }
        },
        "description": "The metadata for the Ruleset."
      },
      "host": {
        "type": "object",
        "additionalProperties": false,
        "patternProperties": {
          ".+": {
            "$ref": "#/definitions/children",
            "description": "A map with the key and value corresponding to the authority segment of the URL and the rules respectively."
          }
        },
        "description": "Specifies the host the Ruleset should be applied."
      },
      "mixedCaseHost": {
        "type": "object",
        "additionalProperties": false,
        "patternProperties": {
          ".+": {
            "$ref": "#/definitions/mixedCaseChildren",
            "description": "Specifies the children of the current node in the Ruleset hierarchy."
          }
        },
        "description": "Specifies the host the Ruleset should be applied."
      },
      "relations": {
        "type": "array",
        "additionalProperties": false,
        "items": {
          "type": "string"
        }
      },
      "allowedOrigins": {
        "type": "array",
        "additionalProperties": false,
        "items": {
          "type": "string"
        }
      },
      "authorizationDefinition": {
        "type": "object",
        "additionalProperties": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "relations": {
              "$ref": "#/definitions/authorizationRelations"
            },
            "permissions": {
              "$ref": "#/definitions/authorizationPermissions"
            }
          }
        }
      },
      "authorizationRelations": {
        "description": "Define a relation in current definition",
        "additionalProperties": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/authorizationRelation"
          }
        }
      },
      "authorizationRelation": {
        "description": "Define a definition, which is a part of current relation.",
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "facet": {
            "type": "string",
            "description": "Related definition."
          },
          "relation": {
            "type": "string",
            "description": "The relation of definition."
          }
        }
      },
      "authorizationPermissions": {
        "type": "object",
        "additionalProperties": {
          "$ref": "#/definitions/authorizationOperation"
        }
      },
      "authorizationOperation": {
        "anyOf": [
          {
            "type": "object",
            "properties": {
              "type": {
                "enum": ["union", "intersect", "except"],
                "description": "The operation to calculate permissions"
              },
              "operations": {
                "type": "array",
                "minItems": 2,
                "items": {
                  "type": "object",
                  "anyOf": [
                    {
                      "type": "object",
                      "properties": {
                        "relation": {
                          "type": "string",
                          "description": "The defined relation"
                        }
                      }
                    },
                    {
                      "$ref": "#/definitions/authorizationOperation"
                    }
                  ]
                }
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "properties": {
              "type": {
                "enum": ["noop"],
                "description": "The operation to calculate permissions"
              },
              "operations": {
                "type": "array",
                "items": {
                  "type": "object",
                  "anyOf": [
                    {
                      "type": "object",
                      "properties": {
                        "relation": {
                          "type": "string",
                          "description": "The defined relation"
                        }
                      }
                    },
                    {
                      "$ref": "#/definitions/authorizationOperation"
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    },
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "authorization": {
        "$ref": "#/definitions/authorizationDefinition"
      },
      "metadata": {
        "$ref": "#/definitions/metadata"
      },
      "allowedOrigins": {
        "$ref": "#/definitions/allowedOrigins"
      }
    },
    "if": {
      "properties": {
        "metadata": {
          "properties": {
            "caseSensitive": {
              "const": false
            }
          }
        }
      }
    },
    "then": {
      "properties": {
        "host": {
          "$ref": "#/definitions/host"
        }
      }
    },
    "else": {
      "properties": {
        "host": {
          "$ref": "#/definitions/mixedCaseHost"
        }
      }
    }
  }
  
export const hostJSON = {
    "host": {
    "http.127.0.0.1.nip.io:8443": {
      "": {
        "permission": {
          "GET": null
        }
      },
      "flasgger_static": {
        "children": {
          "#": {
            "entity": "static",
            "relations": [],
            "permission": {
              "GET": null
            },
            "children": {
              "#": {
                "entity": "lib",
                "relations": [],
                "permission": {
                  "GET": null
                }
              }
            }
          }
        }
      },
      "spec.json": {
        "permission": {
          "GET": null
        }
      },
      "get": {
        "permission": {
          "GET": null
        }
      },
      "post": {
        "permission": {
          "POST": null
        }
      },
      "patch": {
        "permission": {
          "PATCH": null
        }
      },
      "put": {
        "permission": {
          "PUT": null
        }
      },
      "delete": {
        "permission": {
          "DELETE": null
        }
      },
      "status": {
        "children": {
          "#": {
            "entity": "code",
            "permission": {
              "GET": {
                "entity": "code",
                "type": "read"
              },
              "POST": {
                "entity": "code",
                "type": "write"
              },
              "PATCH": {
                "entity": "code",
                "type": "write"
              },
              "PUT": {
                "entity": "code",
                "type": "write"
              },
              "DELETE": {
                "entity": "code",
                "type": "admin"
              }
            }
          }
        }
      },
      "headers": {
        "permission": {
          "GET": {}
        }
      },
      "options": {
        "permission": {
          "OPTIONS": null
        }
      },
      "ip": {
        "permission": {
          "GET": {}
        }
      },
      "user-agent": {
        "permission": {
          "GET": {}
        }
      },
      "anything": {
        "permission": {
          "GET": {},
          "POST": {},
          "PATCH": {},
          "PUT": {},
          "DELETE": {}
        },
        "children": {
          "#": {
            "entity": "anything",
            "permission": {
              "GET": {},
              "POST": {},
              "PATCH": {},
              "PUT": {},
              "DELETE": {}
            }
          }
        }
      }
    }
  }
}