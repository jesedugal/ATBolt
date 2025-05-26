export interface Language {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  enabled: boolean;
  dateTimeCreated?: string;
  userCreated?: string;
  dateTimeModified?: string;
  userModified?: string;
  isDeleted: boolean;
}

export interface Translation {
  id: string;
  languageId: string;
  key: string;
  value: string;
  context: string;
  dateTimeCreated?: string;
  userCreated?: string;
  dateTimeModified?: string;
  userModified?: string;
  isDeleted: boolean;
}