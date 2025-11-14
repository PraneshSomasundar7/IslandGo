"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Calendar, Filter, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

interface ReportConfig {
  type: string;
  dateRange: "7" | "30" | "90" | "custom";
  startDate?: string;
  endDate?: string;
  includeCharts: boolean;
  format: "PDF" | "CSV" | "Excel";
}

export default function ReportsPage() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: "comprehensive",
    dateRange: "30",
    includeCharts: true,
    format: "PDF",
  });
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: "comprehensive", label: "Comprehensive Report", icon: FileText, description: "All metrics and analytics" },
    { value: "campaigns", label: "Campaign Performance", icon: BarChart3, description: "Campaign metrics and ROI" },
    { value: "budget", label: "Budget Analysis", icon: DollarSign, description: "Spending and allocation" },
    { value: "engagement", label: "Engagement Report", icon: TrendingUp, description: "Content performance metrics" },
    { value: "social", label: "Social Media Report", icon: Users, description: "Multi-platform analytics" },
  ];

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportConfig),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${new Date().toISOString()}.${reportConfig.format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
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
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Advanced Reporting & Export
            </h1>
            <p className="text-slate-700">Generate comprehensive reports and export data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Report Type
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setReportConfig({ ...reportConfig, type: type.value })}
                      className={`p-4 rounded-lg border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                        reportConfig.type === type.value
                          ? "bg-orange-50 border-orange-400 shadow-md"
                          : "bg-white border-orange-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-slate-900">{type.label}</span>
                      </div>
                      <p className="text-xs text-slate-600">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Date Range
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(["7", "30", "90", "custom"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setReportConfig({ ...reportConfig, dateRange: range })}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                        reportConfig.dateRange === range
                          ? "bg-orange-600 text-white shadow-md"
                          : "bg-white text-slate-700 hover:bg-orange-50 border border-orange-200"
                      }`}
                    >
                      {range === "custom" ? "Custom" : `${range} days`}
                    </button>
                  ))}
                </div>
                {reportConfig.dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={reportConfig.startDate || ""}
                        onChange={(e) => setReportConfig({ ...reportConfig, startDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={reportConfig.endDate || ""}
                        onChange={(e) => setReportConfig({ ...reportConfig, endDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-600" />
                Export Options
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                  <div className="flex gap-2">
                    {(["PDF", "CSV", "Excel"] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setReportConfig({ ...reportConfig, format })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          reportConfig.format === format
                            ? "bg-orange-600 text-white shadow-md"
                            : "bg-white text-slate-700 hover:bg-orange-50 border border-orange-200"
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeCharts"
                    checked={reportConfig.includeCharts}
                    onChange={(e) => setReportConfig({ ...reportConfig, includeCharts: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="includeCharts" className="text-sm text-slate-700">
                    Include charts and visualizations
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              disabled={generating || (reportConfig.dateRange === "custom" && (!reportConfig.startDate || !reportConfig.endDate))}
              className="w-full px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Generate & Download Report
                </>
              )}
            </button>
          </div>

          {/* Quick Export */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Export</h3>
              <div className="space-y-3">
                {[
                  { label: "Campaigns Data", endpoint: "/api/data/export?type=campaigns" },
                  { label: "Budget Data", endpoint: "/api/data/export?type=budgets" },
                  { label: "Engagement Data", endpoint: "/api/data/export?type=engagement" },
                  { label: "All Data", endpoint: "/api/data/export?type=all" },
                ].map((exportOption) => (
                  <button
                    key={exportOption.label}
                    onClick={async () => {
                      try {
                        const response = await fetch(exportOption.endpoint);
                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${exportOption.label.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString()}.json`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        }
                      } catch (error) {
                        console.error("Error exporting:", error);
                      }
                    }}
                    className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-slate-900">{exportOption.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Report History */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Reports</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>No recent reports</p>
                <p className="text-xs">Generated reports will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

