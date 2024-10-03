import { Tree, TreeDataNode } from "antd";
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

  const pathData = useMemo(
    () => generatePathData(value[host], updateValue, authData),
    [value, authData, host, updateValue]
  );
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
        "No tree"
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

    const hasChildren = !!pathProperties.children;

    const createNewPathValue = (newPath?: string) => {
      const newPathValue = { ...value };
      if (newPath) {
        delete newPathValue[path];
        newPathValue[newPath] = { ...pathProperties };
      }
      return newPathValue;
    };

    const handleChildPathPropertyChange = (newPathProperties: PathValue) => {
      if (hasChildren) {
        const newValue = createNewPathValue();
        newValue[path].children = newPathProperties;
        updateValue(newValue);
      }
    };

    const handlePathRouteChange = (newPath: string) => {
      updateValue(createNewPathValue(newPath));
    };

    const handlePathPropertyChange = (newPathProperties: PathValue) => {
      const newValue = createNewPathValue();
      newValue[path] = newPathProperties[path];
      updateValue(newValue);
    };

    return {
      title: () => (
        <Path
          pathData={{ [path]: pathProperties }}
          absolutePath={`${absolutePath}/${path}`}
          updateValue={handlePathPropertyChange}
          updatePathRoute={handlePathRouteChange}
          authData={authData}
          ancestorEntities={ancestorEntities}
        />
      ),
      key: `$${absolutePath}/${path}`,
      selectable: false,
      disableCheckbox: true,

      isLeaf: !hasChildren,
      children: hasChildren
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
        : undefined,
    };
  });
};
