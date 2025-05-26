import React from 'react';
import { User, UserLevel, Branch } from '../../types/auth';

interface UserFormProps {
  user?: User;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  branches: Branch[];
}

export default function UserForm({ user, onSubmit, onCancel, branches }: UserFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData: Partial<User> = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      nickname: formData.get('nickname') as string,
      position: formData.get('position') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      userLevel: parseInt(formData.get('userLevel') as string) as UserLevel,
      enabled: formData.get('enabled') === 'on',
      assignedBranches: Array.from(formData.getAll('assignedBranches')).map(branchId => {
        const [company, name] = (branchId as string).split('-');
        return branches.find(b => b.company === company && b.name === name)!;
      })
    };

    onSubmit(userData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                name="username"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.username}
                minLength={8}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.email}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstName"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.firstName}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastName"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.lastName}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nickname</label>
              <input
                name="nickname"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.nickname}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                name="position"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.position}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.dateOfBirth}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User Level</label>
              <select
                name="userLevel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={user?.userLevel}
                required
              >
                {Object.entries(UserLevel)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <option key={value} value={value}>
                      {key}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Branches</label>
            <select
              name="assignedBranches"
              multiple
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={user?.assignedBranches.map(b => `${b.company}-${b.name}`)}
            >
              {branches.map((branch) => (
                <option key={`${branch.company}-${branch.name}`} value={`${branch.company}-${branch.name}`}>
                  {branch.company} - {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              name="enabled"
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              defaultChecked={user?.enabled}
            />
            <label className="ml-2 block text-sm text-gray-900">Enabled</label>
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
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}