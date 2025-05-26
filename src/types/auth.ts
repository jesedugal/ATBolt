export interface User {
  username: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  dateOfBirth: string;
  userLevel: UserLevel;
  enabled: boolean;
  assignedBranches: Branch[];
  position: string;
}

export enum UserLevel {
  Viewer = 1,
  Assistant = 2,
  Accountant = 3,
  Analyst = 4,
  Administrator = 5,
  Developer = 6
}

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
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}