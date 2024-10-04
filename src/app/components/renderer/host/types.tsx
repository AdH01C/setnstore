interface HostProps {
  id?: string;
  value: HostValue;
  updateValue: (newValue: HostValue) => void;
}
interface HostValue {
  [host: string]: PathValue;
}
interface PathValue {
  [path: string]: EntityPathSettings | PathSettings;
}

interface PathSettings {
  permission?: Permission;
  children?: PathValue;
}

interface EntityPathSettings extends PathSettings {
  entity: string;
  relations?: string[];
}

interface Permission {
  [method: string]: Requirement; // Allows only specified methods as keys
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "OPTIONS";

type Requirement = null | {} | { entity: string; type: string };

interface HostControlProps {
  data: HostValue;
  handleChange(path: string, value: HostValue): void;
  path: string;
}
