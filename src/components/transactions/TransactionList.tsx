import React from 'react';
import { Transaction, TransactionStatus } from '../../types/transaction';
import { FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.Approved:
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case TransactionStatus.Rejected:
      return <XCircle className="w-5 h-5 text-red-500" />;
    case TransactionStatus.Pending:
      return <Clock className="w-5 h-5 text-yellow-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="truncate max-w-xs">{transaction.description}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.account}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(transaction.status)}
                  <span className="ml-2 text-sm text-gray-900">{transaction.status}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-3">
                  {onEdit && transaction.status === TransactionStatus.Draft && (
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && transaction.status === TransactionStatus.Draft && (
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}