// Activity logging utility for localStorage

export type ActivityType = "creator-recruitment" | "campaign-launch" | "viral-content";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

const ACTIVITY_STORAGE_KEY = "islandgo-recent-activities";
const MAX_ACTIVITIES = 10;

export const addActivity = (activity: Omit<Activity, "id" | "timestamp">): void => {
  try {
    const existing = getActivities();
    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };

    const updated = [newActivity, ...existing].slice(0, MAX_ACTIVITIES);
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving activity:", error);
  }
};

export const getActivities = (): Activity[] => {
  try {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Activity[];
  } catch (error) {
    console.error("Error reading activities:", error);
    return [];
  }
};

export const clearActivities = (): void => {
  try {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing activities:", error);
  }
};

export const removeActivity = (id: string): void => {
  try {
    const activities = getActivities();
    const filtered = activities.filter((a) => a.id !== id);
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing activity:", error);
  }
};

export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

