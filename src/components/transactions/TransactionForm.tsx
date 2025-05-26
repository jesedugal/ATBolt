import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Transaction, 
  TransactionType, 
  TransactionStatus, 
  TransactionCurrency,
  TransactionMethod,
  ValidationError,
  DuplicateRecord 
} from '../../types/transaction';
import { Account } from '../../types/account';
import { Branch } from '../../types/branch';
import { Plus, X, Upload } from 'lucide-react';

interface TransactionFormProps {
  accounts: Account[];
  onSubmit: (data: Partial<Transaction> | Partial<Transaction>[]) => void;
  onCancel: () => void;
}

export default function TransactionForm({ accounts, onSubmit, onCancel }: TransactionFormProps) {
  const { user } = useAuth();
  const [attachments, setAttachments] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [duplicateRecords, setDuplicateRecords] = useState<DuplicateRecord[]>([]);
  const [showImportResults, setShowImportResults] = useState(false);

  const validateCsvData = (data: string[][]): { isValid: boolean; errors: ValidationError[] } => {
    const errors: ValidationError[] = [];
    const headerRow = data[0];
    const expectedHeaders = [
      'TransactionDate', 'TransactionTime', 'TransactionType', 'BranchName',
      'AccountCategory', 'TransactionDescription', 'ExternalSource', 'ExtraInfo',
      'Amount', 'Currency', 'TransactionMethod'
    ];
    
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
      
      // Validate TransactionType
      if (!Object.values(TransactionType).includes(row[2] as TransactionType)) {
        errors.push({
          row: i,
          field: 'TransactionType',
          value: row[2]
        });
      }

      // Validate AccountCategory
      if (!accounts.some(acc => acc.category === row[4])) {
        errors.push({
          row: i,
          field: 'AccountCategory',
          value: row[4]
        });
      }

      // Validate Amount
      const amount = parseFloat(row[8].replace(',', '.'));
      if (isNaN(amount)) {
        errors.push({
          row: i,
          field: 'Amount',
          value: row[8]
        });
      }

      // Validate Currency
      if (!Object.values(TransactionCurrency).includes(row[9] as TransactionCurrency)) {
        errors.push({
          row: i,
          field: 'Currency',
          value: row[9]
        });
      }

      // Validate TransactionMethod
      if (!Object.values(TransactionMethod).includes(row[10] as TransactionMethod)) {
        errors.push({
          row: i,
          field: 'TransactionMethod',
          value: row[10]
        });
      }

      // Validate Date format (DD/MM/YYYY)
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(row[0])) {
        errors.push({
          row: i,
          field: 'TransactionDate',
          value: row[0]
        });
      }

      // Validate Time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (row[1] && !timeRegex.test(row[1])) {
        errors.push({
          row: i,
          field: 'TransactionTime',
          value: row[1]
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
      const newTransactions: Partial<Transaction>[] = [];

      // Process valid rows
      for (let i = 1; i < data.length; i++) {
        const [
          date, time, type, branch, accountCategory, description,
          externalSource, extraInfo, amount, currency, method
        ] = data[i];

        // Format date from DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = date.split('/');
        const formattedDate = `${year}-${month}-${day}`;
        
        const transactionData: Partial<Transaction> = {
          type: type as TransactionType,
          date: formattedDate,
          time: time || undefined,
          description,
          amount: parseFloat(amount.replace(',', '.')),
          currency: currency as TransactionCurrency,
          method: method as TransactionMethod,
          account: accountCategory,
          branch,
          status: TransactionStatus.Draft,
          externalSource: externalSource || undefined,
          extraInfo: extraInfo || undefined,
          createdBy: user?.username || '',
          createdAt: new Date().toISOString()
        };

        newTransactions.push(transactionData);
      }

      onSubmit(newTransactions);
      setDuplicateRecords(duplicates);
      setShowImportResults(true);
      
      // Clear the file input
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const transactionData: Partial<Transaction> = {
      type: formData.get('type') as TransactionType,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      currency: formData.get('currency') as TransactionCurrency,
      method: formData.get('method') as TransactionMethod,
      account: formData.get('account') as string,
      branch: formData.get('branch') as string,
      notes: formData.get('notes') as string,
      status: TransactionStatus.Draft,
      attachments,
      createdBy: user?.username || '',
      createdAt: new Date().toISOString()
    };

    onSubmit(transactionData);
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a storage service
      const fakeUrl = URL.createObjectURL(file);
      setAttachments([...attachments, fakeUrl]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">New Transaction</h3>
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
      </div>

      {showImportResults && (validationErrors.length > 0 || duplicateRecords.length > 0) && (
        <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
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
                    Row {duplicate.row}: {duplicate.description} ({duplicate.date})
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {Object.values(TransactionType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              name="currency"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {Object.values(TransactionCurrency).map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Method</label>
            <select
              name="method"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {Object.values(TransactionMethod).map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account</label>
            <select
              name="account"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {accounts.map(account => (
                <option key={account.id} value={account.category}>
                  {account.category} ({account.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <select
              name="branch"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {user?.assignedBranches.map(branch => (
                <option key={branch.name} value={branch.name}>
                  {branch.name} ({branch.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt="attachment" className="w-20 h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Attachment
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAttachment}
            />
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Create Transaction
          </button>
        </div>
      </form>
    </div>
  );
}