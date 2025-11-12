"use client";

import { useState, useEffect } from "react";
import { Users, MapPin, Sparkles, X, Clock } from "lucide-react";
import { Activity, getActivities, removeActivity, formatTimestamp, clearActivities } from "@/lib/activity";

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Load activities from localStorage
    setActivities(getActivities());

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = () => {
      setActivities(getActivities());
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for changes (since same-tab updates don't trigger storage event)
    const interval = setInterval(() => {
      setActivities(getActivities());
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleRemove = (id: string) => {
    removeActivity(id);
    setActivities(getActivities());
  };

  const handleClearAll = () => {
    if (confirm("Clear all recent activities?")) {
      clearActivities();
      setActivities([]);
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "creator-recruitment":
        return <Users className="w-4 h-4 text-[#FF6B35]" />;
      case "campaign-launch":
        return <MapPin className="w-4 h-4 text-[#4ECB71]" />;
      case "viral-content":
        return <Sparkles className="w-4 h-4 text-[#00D4FF]" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "creator-recruitment":
        return "border-[#FF6B35]/20 bg-[#FF6B35]/5";
      case "campaign-launch":
        return "border-[#4ECB71]/20 bg-[#4ECB71]/5";
      case "viral-content":
        return "border-[#00D4FF]/20 bg-[#00D4FF]/5";
      default:
        return "border-amber-200 bg-amber-50";
    }
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          Recent Activity
        </h3>
        <div className="flex items-center gap-2">
          {activities.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-0" : "rotate-45"}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border ${getActivityColor(activity.type)} animate-in fade-in slide-in-from-right-4 transition-all duration-300`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(activity.id)}
                      className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Remove activity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

