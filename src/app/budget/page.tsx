"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, PieChart, Calendar, AlertCircle, Plus, X, Loader2 } from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartSkeleton, StatCardSkeleton } from "@/components/LoadingSkeleton";

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  month: string;
  year: number;
  created_at: Date;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    allocated: "",
    spent: "",
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const url = selectedMonth
        ? `/api/budgets?month=${selectedMonth}&year=${selectedYear}`
        : `/api/budgets?year=${selectedYear}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBudgets(data.map((b: any) => ({ ...b, created_at: new Date(b.created_at) })));
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const pieData = budgets.map((budget) => ({
    name: budget.category,
    value: budget.spent,
    allocated: budget.allocated,
  }));

  const COLORS = ["#FF6B35", "#4ECB71", "#00D4FF", "#FFD93D", "#9B59B6", "#E74C3C", "#3498DB"];

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.allocated) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          allocated: parseFloat(formData.allocated),
          spent: parseFloat(formData.spent) || 0,
          month: formData.month,
          year: formData.year,
        }),
      });

      if (response.ok) {
        setShowAddBudgetModal(false);
        setFormData({
          category: "",
          allocated: "",
          spent: "",
          month: new Date().toLocaleString("default", { month: "long" }),
          year: new Date().getFullYear(),
        });
        fetchBudgets();
      } else {
        alert("Failed to add budget. Please try again.");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Failed to add budget. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE5D4' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Budget Tracking
              </h1>
              <p className="text-slate-700">Monitor marketing budget allocation and spending</p>
            </div>
            <button
              onClick={() => setShowAddBudgetModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              Add Budget
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-lg border border-orange-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg border border-orange-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Allocated</span>
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ${(totalAllocated / 1000).toFixed(1)}K
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Spent</span>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ${(totalSpent / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  ${((totalAllocated - totalSpent) / 1000).toFixed(1)}K remaining
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Utilization Rate</span>
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {utilizationRate.toFixed(1)}%
                </div>
                <div className={`text-xs mt-1 ${utilizationRate > 80 ? "text-red-600" : utilizationRate > 60 ? "text-yellow-600" : "text-green-600"}`}>
                  {utilizationRate > 80 ? "⚠️ High usage" : utilizationRate > 60 ? "⚡ Moderate" : "✓ Healthy"}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-orange-600" />
                Spending by Category
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Suspense>

          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Budget Overview</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-orange-200 rounded animate-pulse" />
                ))}
              </div>
            ) : budgets.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No budget data found for the selected period.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const spentPercent = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{budget.category}</span>
                        <span className="text-sm text-slate-600">
                          ${(budget.spent / 1000).toFixed(1)}K / ${(budget.allocated / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div className="w-full bg-orange-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            spentPercent > 80 ? "bg-red-500" : spentPercent > 60 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(spentPercent, 100)}%` }}
                        />
                      </div>
                      {spentPercent > 80 && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>Budget threshold exceeded</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Budget Table */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Budget Details</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No budget records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Month</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Allocated</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Spent</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Remaining</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget) => {
                    const remaining = budget.allocated - budget.spent;
                    const utilization = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
                    return (
                      <tr key={budget.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200">
                        <td className="py-3 px-4 font-semibold text-slate-900">{budget.category}</td>
                        <td className="py-3 px-4 text-slate-700">{budget.month} {budget.year}</td>
                        <td className="py-3 px-4 text-right font-medium text-slate-900">${(budget.allocated / 1000).toFixed(1)}K</td>
                        <td className="py-3 px-4 text-right text-slate-700">${(budget.spent / 1000).toFixed(1)}K</td>
                        <td className={`py-3 px-4 text-right font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${(remaining / 1000).toFixed(1)}K
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={utilization > 80 ? "text-red-600" : utilization > 60 ? "text-yellow-600" : "text-green-600"}>
                            {utilization.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Budget Modal */}
        {showAddBudgetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Add Budget</h3>
                <button
                  onClick={() => setShowAddBudgetModal(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Creator Partnerships, Content Creation, Ads"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Allocated Budget ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.allocated}
                      onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Spent ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.spent}
                      onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Month <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      {[2023, 2024, 2025, 2026].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBudgetModal(false)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Budget
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

