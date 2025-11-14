"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Plus, Edit, Trash2, CheckCircle, Clock, X, Filter } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  platform: string;
  scheduled_date: Date;
  status: "Scheduled" | "Published" | "Draft" | "Cancelled";
  creator_id?: string;
  created_at: Date;
}

export default function ContentCalendarPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchContent();
  }, [statusFilter]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "All" ? "/api/content-calendar" : `/api/content-calendar?status=${statusFilter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setContentItems(data.map((item: any) => ({ ...item, scheduled_date: new Date(item.scheduled_date), created_at: new Date(item.created_at) })));
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-700 border-green-300";
      case "Scheduled":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Published":
        return <CheckCircle className="w-4 h-4" />;
      case "Scheduled":
        return <Clock className="w-4 h-4" />;
      case "Draft":
        return <Edit className="w-4 h-4" />;
      case "Cancelled":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const upcomingContent = contentItems
    .filter((item) => item.status === "Scheduled" && item.scheduled_date >= new Date())
    .sort((a, b) => a.scheduled_date.getTime() - b.scheduled_date.getTime())
    .slice(0, 5);

  const todayContent = contentItems.filter(
    (item) =>
      item.scheduled_date.toDateString() === new Date().toDateString() && item.status === "Scheduled"
  );

  const groupedByDate = contentItems.reduce((acc, item) => {
    const date = item.scheduled_date.toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

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
                Content Calendar
              </h1>
              <p className="text-slate-700">Plan and schedule your content</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              <Plus className="w-4 h-4" />
              New Content
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Content</span>
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{contentItems.length}</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-blue-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Scheduled</span>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {contentItems.filter((i) => i.status === "Scheduled").length}
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-green-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Published</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {contentItems.filter((i) => i.status === "Published").length}
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Today</span>
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{todayContent.length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Status:</span>
          </div>
          {["All", "Scheduled", "Published", "Draft", "Cancelled"].map((status) => (
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
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                viewMode === "list"
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white/90 text-slate-700 hover:bg-white border border-orange-200"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                viewMode === "calendar"
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white/90 text-slate-700 hover:bg-white border border-orange-200"
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Upcoming Content */}
        {upcomingContent.length > 0 && (
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Content</h3>
            <div className="space-y-3">
              {upcomingContent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-600">
                        {item.platform} • {item.content_type} • {item.scheduled_date.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">All Content</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : contentItems.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No content scheduled. Create your first content item to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Platform</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Scheduled</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentItems
                    .sort((a, b) => a.scheduled_date.getTime() - b.scheduled_date.getTime())
                    .map((item) => (
                      <tr key={item.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{item.title}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{item.content_type}</td>
                        <td className="py-3 px-4 text-slate-700">{item.platform}</td>
                        <td className="py-3 px-4 text-slate-700">{item.scheduled_date.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

