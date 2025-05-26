import React from 'react';
import { Branch } from '../../types/branch';

interface BranchFormProps {
  branch?: Branch;
  onSubmit: (data: Partial<Branch>) => void;
  onCancel: () => void;
}

export default function BranchForm({ branch, onSubmit, onCancel }: BranchFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const branchData: Partial<Branch> = {
      company: formData.get('company') as string,
      worldRegion: formData.get('worldRegion') as string,
      regionSector: formData.get('regionSector') as string,
      country: formData.get('country') as string,
      zone: formData.get('zone') as string,
      province: formData.get('province') as string,
      city: formData.get('city') as string,
      name: formData.get('name') as string,
      approver: formData.get('approver') as string,
      isDeleted: false
    };

    onSubmit(branchData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">
          {branch ? 'Edit Branch' : 'Add New Branch'}
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                name="company"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.company}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">World Region</label>
              <input
                name="worldRegion"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.worldRegion}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region Sector</label>
              <input
                name="regionSector"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.regionSector}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                name="country"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.country}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zone</label>
              <input
                name="zone"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.zone}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <input
                name="province"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.province}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                name="city"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.city}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch Name</label>
              <input
                name="name"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.name}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Approver</label>
              <input
                name="approver"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={branch?.approver}
                required
              />
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
              {branch ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}