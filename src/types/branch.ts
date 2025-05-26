export interface Branch {
  company: string;
  worldRegion: string;
  regionSector: string;
  country: string;
  zone: string;
  province: string;
  city: string;
  name: string;
  approver: string;
  dateTimeCreated?: string;
  userCreated?: string;
  dateTimeModified?: string;
  userModified?: string;
  isDeleted: boolean;
}

export interface BranchFormData extends Omit<Branch, 'dateTimeCreated' | 'dateTimeModified' | 'userCreated' | 'userModified'> {}