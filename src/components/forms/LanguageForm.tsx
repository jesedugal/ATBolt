import React from 'react';
import { Language } from '../../types/language';

interface LanguageFormProps {
  language?: Language;
  onSubmit: (data: Partial<Language>) => void;
  onCancel: () => void;
}

export default function LanguageForm({ language, onSubmit, onCancel }: LanguageFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const languageData: Partial<Language> = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      isDefault: formData.get('isDefault') === 'on',
      enabled: formData.get('enabled') === 'on',
      isDeleted: false
    };

    onSubmit(languageData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {language ? 'Edit Language' : 'Add New Language'}
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language Code</label>
            <input
              name="code"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="en"
              defaultValue={language?.code}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language Name</label>
            <input
              name="name"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="English"
              defaultValue={language?.name}
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                name="enabled"
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={language?.enabled}
              />
              <label className="ml-2 block text-sm text-gray-900">Enabled</label>
            </div>
            <div className="flex items-center">
              <input
                name="isDefault"
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={language?.isDefault}
              />
              <label className="ml-2 block text-sm text-gray-900">Default Language</label>
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
              {language ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}