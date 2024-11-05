import capitalize from "lodash/capitalize";
import lowerCase from "lodash/lowerCase";

export const addTrailingSlash = (url: string) => url.replace(/\/?$/, "/");

export const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export const pathToBreadcrumbItems = (path: string, customMap?: { path: string; title: string; href?: string }[]) => {
  const result: { title: string; path?: string }[] = [];
  let pathClone = path;

  do {
    const curIndex = pathClone.lastIndexOf("/");
    const rawTitle = pathClone.slice(curIndex + 1);

    if (customMap?.some(i => i.path === pathClone)) {
      const item = customMap.find(e => e.path === pathClone);
      result.unshift({ title: item!.title, path: item?.href ?? pathClone });
    } else if (rawTitle.startsWith("[") && rawTitle.endsWith("]")) {
      //path variable path
      result.unshift({ title: rawTitle, path: pathClone });
    } else {
      //normal path

      result.unshift({ title: capitalize(lowerCase(rawTitle)), path: pathClone });
    }

    pathClone = pathClone.slice(0, curIndex);
  } while (pathClone.lastIndexOf("/") !== -1);
  result.unshift({ title: "Home", path: "/" });
  return result;
};
export const truncateDescription = (description?: string) => {
  if (!description) return "No description available";
  return description.length > 100 ? `${description.substring(0, 100)}...` : description;
};