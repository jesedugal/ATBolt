import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import UserSetup from './components/setup/UserSetup';
import BranchSetup from './components/setup/BranchSetup';
import AccountSetup from './components/setup/AccountSetup';
import LanguageSetup from './components/setup/LanguageSetup';
import TransactionForm from './components/transactions/TransactionForm';
import TransactionList from './components/transactions/TransactionList';
import AnalysisDashboard from './components/analysis/AnalysisDashboard';
import { Transaction, TransactionStatus, TransactionType } from './types/transaction';
import { Account, AccountFlow, AccountType, AccountSubType } from './types/account';

function Dashboard() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = React.useState<string>('');
  const [transactions, setTransactions] = React.useState<Transaction[]>([
    {
      id: '1',
      type: TransactionType.Income,
      date: '2024-03-01',
      description: 'Monthly Donation',
      amount: 1000,
      account: 'Regular Donations',
      branch: 'Lux Central',
      status: TransactionStatus.Approved,
      createdBy: 'FirstDev',
      createdAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '2',
      type: TransactionType.Expense,
      date: '2024-03-02',
      description: 'Office Supplies',
      amount: 250,
      account: 'Office Equipment',
      branch: 'Lux Central',
      status: TransactionStatus.Pending,
      createdBy: 'FirstDev',
      createdAt: '2024-03-02T14:30:00Z'
    }
  ]);

  const accounts: Account[] = [
    {
      id: '1',
      flow: AccountFlow.Income,
      type: AccountType.Revenues,
      subType: AccountSubType.Donation,
      category: 'Regular Donations',
      costCenter: 'Local',
      isDeleted: false
    },
    {
      id: '2',
      flow: AccountFlow.Outgoing,
      type: AccountType.Assets,
      subType: AccountSubType.OfficeEquipments,
      category: 'Computer Equipment',
      costCenter: 'National',
      isDeleted: false
    }
  ];
  
  const renderPage = () => {
    switch (currentPage) {
      case '/setup/users':
        return <UserSetup />;
      case '/setup/branches':
        return <BranchSetup />;
      case '/setup/accounts':
        return <AccountSetup />;
      case '/setup/languages':
        return <LanguageSetup />;
      case '/journal':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Journal Overview</h2>
            <TransactionList transactions={transactions} />
          </div>
        );
      case '/transaction/new':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">New Transaction</h2>
            <TransactionForm
              accounts={accounts}
              onSubmit={(data) => {
                const newTransaction: Transaction = {
                  ...data as Transaction,
                  id: (transactions.length + 1).toString(),
                  status: TransactionStatus.Draft,
                  createdBy: user?.username || '',
                  createdAt: new Date().toISOString()
                };
                setTransactions([...transactions, newTransaction]);
                setCurrentPage('/journal');
              }}
              onCancel={() => setCurrentPage('/journal')}
            />
          </div>
        );
      case '/analysis':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Corner</h2>
            <AnalysisDashboard transactions={transactions} />
          </div>
        );
      case '/reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">General Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
                {/* Add report content here */}
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Annual Overview</h3>
                {/* Add report content here */}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">Select a menu item to get started...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navigation onNavigate={setCurrentPage} />
      <div className="flex-1">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-lg font-semibold">Dashboard</span>
              </div>
              <div className="flex items-center">
                <span className="mr-4">Welcome, {user?.nickname}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const auth = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {!auth?.isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoginForm />
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;