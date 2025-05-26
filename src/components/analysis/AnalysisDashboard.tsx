import React from 'react';
import { Transaction } from '../../types/transaction';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

interface AnalysisDashboardProps {
  transactions: Transaction[];
}

interface ChartData {
  name: string;
  income: number;
  expenses: number;
}

export default function AnalysisDashboard({ transactions }: AnalysisDashboardProps) {
  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  // Prepare chart data
  const monthlyData: ChartData[] = transactions.reduce((acc: ChartData[], transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    const existingMonth = acc.find(d => d.name === monthYear);
    if (existingMonth) {
      if (transaction.type === 'Income') {
        existingMonth.income += transaction.amount;
      } else {
        existingMonth.expenses += transaction.amount;
      }
    } else {
      acc.push({
        name: monthYear,
        income: transaction.type === 'Income' ? transaction.amount : 0,
        expenses: transaction.type === 'Expense' ? transaction.amount : 0
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-semibold text-green-600">
                ${totalIncome.toLocaleString()}
              </p>
            </div>
            <ArrowUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
            <ArrowDown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Income</p>
              <p className={`text-2xl font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netIncome.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}