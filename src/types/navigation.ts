export interface NavItem {
  name: string;
  path: string;
  minLevel: number;
  icon?: string;
}

export interface SubNavItem extends NavItem {
  items?: NavItem[];
}

export const navigationItems: SubNavItem[] = [
  {
    name: 'General Setup',
    path: '/setup',
    minLevel: 5,
    items: [
      { name: 'User Setup', path: '/setup/users', minLevel: 5 },
      { name: 'Branch Setup', path: '/setup/branches', minLevel: 5 },
      { name: 'Language Setup', path: '/setup/languages', minLevel: 5 },
      { name: 'Account Setup', path: '/setup/accounts', minLevel: 5 },
    ],
  },
  { name: 'Journal Overview', path: '/journal', minLevel: 1 },
  { name: 'New Transaction', path: '/transaction/new', minLevel: 2 },
  { name: 'Analysis Corner', path: '/analysis', minLevel: 3 },
  { name: 'General Reports', path: '/reports', minLevel: 4 },
];