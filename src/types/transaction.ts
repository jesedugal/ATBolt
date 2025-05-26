export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense'
}

export enum TransactionStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum TransactionCurrency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP'
}

export enum TransactionMethod {
  Cash = 'Cash',
  Bank = 'Bank',
  Card = 'Card',
  Transfer = 'Transfer'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  time?: string;
  description: string;
  amount: number;
  currency: TransactionCurrency;
  method: TransactionMethod;
  account: string;
  branch: string;
  status: TransactionStatus;
  externalSource?: string;
  extraInfo?: string;
  attachments?: string[];
  notes?: string;
  approver?: string;
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

export interface ValidationError {
  row: number;
  field: string;
  value: string;
}

export interface DuplicateRecord {
  row: number;
  description: string;
  date: string;
}