import React, { useState } from 'react';
import { Language } from '../../types/language';
import { Plus, Pencil, Trash2, Globe } from 'lucide-react';
import LanguageForm from '../forms/LanguageForm';

export default function LanguageSetup() {
  const [languages, setLanguages] = useState<Language[]>([
    {
      id: '1',
      code: 'en',
      name: 'English',
      isDefault: true,
      enabled: true,
      isDeleted: false
    },
    {
      id: '2',
      code: 'es',
      name: 'Spanish',
      isDefault: false,
      enabled: true,
      isDeleted: false
    },
    {
      id: '3',
      code: 'fr',
      name: 'French',
      isDefault: false,
      enabled: true,
      isDeleted: false
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  const handleSubmit = (languageData: Partial<Language>) => {
    if (editingLanguage) {
      setLanguages(languages.map(language => 
        language.id === editingLanguage.id ? { ...language, ...languageData } : language
      ));
    } else {
      const newLanguage = {
        ...languageData,
        id: (languages.length + 1).toString(),
        isDeleted: false
      } as Language;

      // If this is set as default, remove default from other languages
      if (newLanguage.isDefault) {
        setLanguages(languages.map(lang => ({
          ...lang,
          isDefault: false
        })));
      }

      setLanguages([...languages, newLanguage]);
    }
    setShowForm(false);
    setEditingLanguage(null);
  };

  const handleDelete = (id: string) => {
    setLanguages(languages.filter(language => language.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setLanguages(languages.map(language => ({
      ...language,
      isDefault: language.id === id
    })));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Language Management</h2>
        <button
          onClick={() => {
            setEditingLanguage(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </button>
      </div>

      {showForm && (
        <LanguageForm
          language={editingLanguage || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingLanguage(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {languages.map((language) => (
              <tr key={language.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{language.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{language.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    language.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {language.enabled ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleSetDefault(language.id)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      language.isDefault ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {language.isDefault ? 'Default' : 'Set as Default'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingLanguage(language);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(language.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={language.isDefault}
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