import React, { useState } from 'react';
import { Account, AccountFlow, AccountType, AccountSubType, TransactionCategory } from '../../types/account';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import AccountForm from '../forms/AccountForm';

interface ValidationError {
  row: number;
  field: string;
  value: string;
}

interface DuplicateRecord {
  row: number;
  category: string;
}

export default function AccountSetup() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      flow: AccountFlow.Income,
      type: AccountType.Revenues,
      subType: AccountSubType.Donation,
      category: TransactionCategory.OfrendaServicioRegular,
      costCenter: 'Any',
      internalMovement: false,
      active: true,
      isDeleted: false
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [duplicateRecords, setDuplicateRecords] = useState<DuplicateRecord[]>([]);
  const [showImportResults, setShowImportResults] = useState(false);

  const handleSubmit = (accountData: Partial<Account>) => {
    if (editingAccount) {
      setAccounts(accounts.map(account => 
        account.id === editingAccount.id ? { ...account, ...accountData } : account
      ));
    } else {
      const newAccount = {
        ...accountData,
        id: (accounts.length + 1).toString(),
        isDeleted: false
      } as Account;
      setAccounts([...accounts, newAccount]);
    }
    setShowForm(false);
    setEditingAccount(null);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const validateCsvData = (data: string[][]): { isValid: boolean; errors: ValidationError[] } => {
    const errors: ValidationError[] = [];
    const headerRow = data[0];
    const expectedHeaders = ['Active', 'AccountFlow', 'AccountType', 'AccountSubtype', 'TransactionCategory', 'CostCenter', 'InternalMovement'];
    
    // Validate headers
    if (!headerRow || headerRow.join(';') !== expectedHeaders.join(';')) {
      errors.push({
        row: 0,
        field: 'Headers',
        value: 'Invalid headers format'
      });
      return { isValid: false, errors };
    }

    // Validate data rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Validate AccountFlow
      if (!Object.values(AccountFlow).includes(row[1] as AccountFlow)) {
        errors.push({
          row: i,
          field: 'AccountFlow',
          value: row[1]
        });
      }

      // Validate AccountType
      if (!Object.values(AccountType).includes(row[2] as AccountType)) {
        errors.push({
          row: i,
          field: 'AccountType',
          value: row[2]
        });
      }

      // Validate AccountSubType
      if (!Object.values(AccountSubType).includes(row[3] as AccountSubType)) {
        errors.push({
          row: i,
          field: 'AccountSubType',
          value: row[3]
        });
      }

      // Validate TransactionCategory
      if (!Object.values(TransactionCategory).includes(row[4] as TransactionCategory)) {
        errors.push({
          row: i,
          field: 'TransactionCategory',
          value: row[4]
        });
      }

      // Validate CostCenter
      if (!['Any', 'Local', 'National'].includes(row[5])) {
        errors.push({
          row: i,
          field: 'CostCenter',
          value: row[5]
        });
      }

      // Validate boolean fields
      if (!['TRUE', 'FALSE'].includes(row[0])) {
        errors.push({
          row: i,
          field: 'Active',
          value: row[0]
        });
      }
      if (!['TRUE', 'FALSE'].includes(row[6])) {
        errors.push({
          row: i,
          field: 'InternalMovement',
          value: row[6]
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      const data = rows.map(row => row.split(';'));
      
      const { isValid, errors } = validateCsvData(data);
      
      if (!isValid) {
        setValidationErrors(errors);
        setShowImportResults(true);
        return;
      }

      const duplicates: DuplicateRecord[] = [];
      const newAccounts: Account[] = [];

      // Process valid rows
      for (let i = 1; i < data.length; i++) {
        const [active, flow, type, subType, category, costCenter, internalMovement] = data[i];
        
        // Check for duplicates
        const isDuplicate = accounts.some(acc => acc.category === category);
        if (isDuplicate) {
          duplicates.push({
            row: i,
            category: category
          });
          continue;
        }

        const newAccount: Account = {
          id: (accounts.length + newAccounts.length + 1).toString(),
          flow: flow as AccountFlow,
          type: type as AccountType,
          subType: subType as AccountSubType,
          category: category as TransactionCategory,
          costCenter: costCenter as 'Any' | 'Local' | 'National',
          active: active === 'TRUE',
          internalMovement: internalMovement === 'TRUE',
          isDeleted: false
        };

        newAccounts.push(newAccount);
      }

      // Update the accounts state with new accounts
      setAccounts(prevAccounts => [...prevAccounts, ...newAccounts]);
      setDuplicateRecords(duplicates);
      setShowImportResults(true);
      
      // Clear the file input
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  // Filter out deleted accounts
  const activeAccounts = accounts.filter(account => !account.isDeleted);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Account Setup</h2>
        <div className="flex space-x-4">
          <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={() => {
              setEditingAccount(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </button>
        </div>
      </div>

      {showImportResults && (validationErrors.length > 0 || duplicateRecords.length > 0) && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Import Results</h3>
          
          {validationErrors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-red-600 font-medium mb-2">Validation Errors:</h4>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    Row {error.row}: Invalid {error.field} - "{error.value}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {duplicateRecords.length > 0 && (
            <div>
              <h4 className="text-yellow-600 font-medium mb-2">Duplicate Records (Skipped):</h4>
              <ul className="list-disc list-inside">
                {duplicateRecords.map((duplicate, index) => (
                  <li key={index} className="text-yellow-600">
                    Row {duplicate.row}: {duplicate.category}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setShowImportResults(false)}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      )}

      {showForm && (
        <AccountForm
          account={editingAccount || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Center</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeAccounts.map((account) => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{account.category}</div>
                      <div className="text-sm text-gray-500">{account.subType}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{account.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.flow === AccountFlow.Income ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {account.flow}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.costCenter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {account.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.internalMovement ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.internalMovement ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingAccount(account);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}