"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, AlertCircle, AlertTriangle, Info, X, CheckCircle, Filter } from "lucide-react";

interface Alert {
  id: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  message: string;
  threshold: number;
  current_value: number;
  status: "Active" | "Resolved" | "Dismissed";
  created_at: Date;
  resolved_at?: Date;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [severityFilter, setSeverityFilter] = useState<string>("All");

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, severityFilter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "All" ? "/api/alerts" : `/api/alerts?status=${statusFilter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        let filtered = data.map((a: any) => ({ ...a, created_at: new Date(a.created_at), resolved_at: a.resolved_at ? new Date(a.resolved_at) : undefined }));
        if (severityFilter !== "All") {
          filtered = filtered.filter((a: Alert) => a.severity === severityFilter);
        }
        setAlerts(filtered);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/alerts/${id}`, { method: "PATCH", body: JSON.stringify({ status: "Resolved" }) });
      if (response.ok) {
        fetchAlerts();
      }
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "High":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "Medium":
        return <Info className="w-5 h-5 text-yellow-600" />;
      case "Low":
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === "Active");
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "Critical");

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
              Marketing Alerts
            </h1>
            <p className="text-slate-700">Real-time monitoring and notifications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Active Alerts</span>
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{activeAlerts.length}</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-red-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Critical</span>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-red-600">{criticalAlerts.length}</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Alerts</span>
              <AlertTriangle className="w-5 h-5 text-slate-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{alerts.length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Status:</span>
          </div>
          {["All", "Active", "Resolved", "Dismissed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                statusFilter === status
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white/90 text-slate-700 hover:bg-white border border-orange-200"
              }`}
            >
              {status}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-medium text-slate-700">Severity:</span>
            {["All", "Critical", "High", "Medium", "Low"].map((severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  severityFilter === severity
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-white/90 text-slate-700 hover:bg-white border border-orange-200"
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No alerts found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === "Critical"
                      ? "bg-red-50 border-red-200"
                      : alert.severity === "High"
                      ? "bg-orange-50 border-orange-200"
                      : alert.severity === "Medium"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs text-slate-600">{alert.type}</span>
                          {alert.status === "Active" && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-slate-900 font-medium mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span>Threshold: {alert.threshold}</span>
                          <span>Current: {alert.current_value}</span>
                          <span>Created: {alert.created_at.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {alert.status === "Active" && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        title="Resolve Alert"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

