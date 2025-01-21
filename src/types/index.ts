export interface FolderType {
  _id: string;
  name: string;
  path: string;
  isFile: boolean;
  deleted: boolean;
  owner: string;
  parentPath: string | null;
  children?: Record<string, FolderType>;
  content?: string;
  icon?: string;
  summary?: string;
  note?: string;
}
export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  sidebar: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    theme: Theme;
  };
}
