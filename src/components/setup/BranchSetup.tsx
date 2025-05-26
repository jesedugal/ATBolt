import React, { useState } from 'react';
import { Branch } from '../../types/branch';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import BranchForm from '../forms/BranchForm';

export default function BranchSetup() {
  const [branches, setBranches] = useState<Branch[]>([{
    company: 'MMM',
    worldRegion: 'Europe Block C',
    regionSector: 'Presbitery 1',
    country: 'Luxembourg',
    zone: 'Luxembourg',
    province: 'Luxembourg',
    city: 'Luxembourg',
    name: 'Lux Central',
    approver: 'FirstDev',
    isDeleted: false
  }]);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleSubmit = (branchData: Partial<Branch>) => {
    if (editingBranch) {
      setBranches(branches.map(branch => 
        branch.name === editingBranch.name ? { ...branch, ...branchData } : branch
      ));
    } else {
      setBranches([...branches, branchData as Branch]);
    }
    setShowForm(false);
    setEditingBranch(null);
  };

  const handleDelete = (name: string) => {
    setBranches(branches.filter(branch => branch.name !== name));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Branch Management</h2>
        <button
          onClick={() => {
            setEditingBranch(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </button>
      </div>

      {showForm && (
        <BranchForm
          branch={editingBranch || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingBranch(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={`${branch.company}-${branch.name}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                      <div className="text-sm text-gray-500">{branch.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{branch.city}, {branch.country}</div>
                  <div className="text-sm text-gray-500">{branch.worldRegion}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {branch.approver}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingBranch(branch);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(branch.name)}
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