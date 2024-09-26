// JSON Forms
export const initialFormData = {
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
  allowedOrigins: ["http://an-allowed-origin"],
};
