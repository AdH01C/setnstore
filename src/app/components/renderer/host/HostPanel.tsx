import { Button, Tree, TreeDataNode } from "antd";
import { useMemo } from "react";
import { Path } from "./Path";

export const HostPanel = ({
  value,
  updateValue,
  authData,
}: {
  value: HostValue;
  updateValue: (newValue: PathValue) => void;
  authData: AuthorizationValue;
}) => {
  const [host] = Object.keys(value);

  const pathData = useMemo(() => {
    const generatedData = generatePathData(value[host], updateValue, authData);
    if (generatedData.length > 0) {
      return [...generatedData, addPathButton(value[host], updateValue, host)];
    }
    return generatedData;
  }, [value, authData, host, updateValue]);
  //   const pathData = generatePathData(value[host], updateValue, relations, host);

  return (
    <>
      {pathData.length ? (
        <Tree
          defaultExpandAll
          checkStrictly
          virtual={false}
          motion={false}
          showLine
          treeData={pathData}
        />
      ) : (
        <Button
          onClick={() => {
            updateValue({
              "": {
                permission: {
                  GET: null,
                },
              },
            });
          }}
        >
          Add Root Path
        </Button>
      )}
    </>
  );
};

const generatePathData = (
  value: PathValue,
  updateValue: (newValue: PathValue) => void,
  authData: AuthorizationValue,
  absolutePath: string = "",
  ancestorEntities: string[] = []
): TreeDataNode[] => {
  return Object.entries(value).map(([path, untypedProperties]) => {
    const isEntityPath = path === "#";
    const pathProperties = isEntityPath
      ? (untypedProperties as EntityPathSettings)
      : (untypedProperties as PathSettings);

    const hasChildren = Boolean(pathProperties?.children);

    const updateValueForPath = (newPathProperties: PathValue) => {
      const newValue = { ...value, [path]: newPathProperties[path] };
      updateValue(newValue);
    };

    const handleChildPathPropertyChange = (newPathProperties: PathValue) => {
      if (hasChildren) {
        updateValue({
          ...value,
          [path]: { ...pathProperties, children: newPathProperties },
        });
      }
    };

    const handlePathRouteChange = (newPath?: string) => {
      const newValue = { ...value };
      delete newValue[path];
      if (newPath !== undefined) {
        newValue[newPath] = { ...pathProperties };
      }

      updateValue(newValue);
    };
    const handleAddSiblingPath = (newPathProperties: PathValue) => {
      updateValue({
        ...value,
        [path]: { ...pathProperties, children: newPathProperties },
      });
    };

    const childrenNodes = hasChildren
      ? generatePathData(
          pathProperties.children!,
          handleChildPathPropertyChange,
          authData,
          `${absolutePath}/${path}`,
          isEntityPath
            ? [
                ...ancestorEntities,
                (pathProperties as EntityPathSettings).entity,
              ]
            : ancestorEntities
        )
      : [];

    return {
      title: () => (
        <Path
          pathData={{ [path]: pathProperties }}
          absolutePath={`${absolutePath}/${path}`}
          updateValue={updateValueForPath}
          updatePathRoute={handlePathRouteChange}
          authData={authData}
          ancestorEntities={ancestorEntities}
        />
      ),
      key: `$${absolutePath}/${path}`,
      selectable: false,
      disableCheckbox: true,
      isLeaf: !hasChildren,
      children: [
        ...childrenNodes,
        ...(childrenNodes.length > 0
          ? [
              addPathButton(
                { ...value[path].children },
                handleAddSiblingPath,
                absolutePath,
                path
              ),
            ]
          : []),
      ],
    };
  });
};

const addPathButton = (
  value: PathValue,
  updateValue: (newValue: PathValue) => void,
  absolutePath: string,
  path?: string
): TreeDataNode => {
  const handleAddSiblingPath = () => {
    const newPathName = `untitled-${Date.now()}`;
    const newValue = { ...value };

    newValue[newPathName] = {
      permission: {},
    };

    updateValue(newValue);
  };

  return {
    title: () => (
      <Button onClick={handleAddSiblingPath}>Add Sibling Path</Button>
    ),
    key: path ? `$${absolutePath}/${path}/end` : `${absolutePath}/end`,
    selectable: false,
    disableCheckbox: true,
    isLeaf: true,
  };
};
