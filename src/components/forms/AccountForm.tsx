import React from 'react';
import { Account, AccountFlow, AccountType, AccountSubType, TransactionCategory } from '../../types/account';

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: Partial<Account>) => void;
  onCancel: () => void;
}

export default function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const accountData: Partial<Account> = {
      flow: formData.get('flow') as AccountFlow,
      type: formData.get('type') as AccountType,
      subType: formData.get('subType') as AccountSubType,
      category: formData.get('category') as TransactionCategory,
      costCenter: formData.get('costCenter') as 'Any' | 'Local' | 'National',
      internalMovement: formData.get('internalMovement') === 'on',
      active: formData.get('active') === 'on',
      isDeleted: false
    };

    onSubmit(accountData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {account ? 'Edit Account' : 'Add New Account'}
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Flow</label>
            <select
              name="flow"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={account?.flow}
              required
            >
              {Object.values(AccountFlow).map((flow) => (
                <option key={flow} value={flow}>
                  {flow}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={account?.type}
              required
            >
              {Object.values(AccountType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sub Type</label>
            <select
              name="subType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={account?.subType}
              required
            >
              {Object.values(AccountSubType).map((subType) => (
                <option key={subType} value={subType}>
                  {subType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={account?.category}
              required
            >
              {Object.values(TransactionCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Center</label>
            <select
              name="costCenter"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={account?.costCenter}
              required
            >
              <option value="Any">Any</option>
              <option value="Local">Local</option>
              <option value="National">National</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                defaultChecked={account?.active ?? true}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-900">Active</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="internalMovement"
                defaultChecked={account?.internalMovement ?? false}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-900">Internal Movement</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
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
              {account ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}