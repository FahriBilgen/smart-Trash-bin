// Sorumlu: Alper
// ALPER - Backend API bağlantı adresleri
// Frontend bu dosya üzerinden FastAPI backend'e istek atıyor.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type LatestReading = {
  id: number;
  bin_id: number;
  distance_cm: number;
  fill_percent: number;
  gas_raw: number;
  status: string;
  is_full: boolean;
  odor_alert: boolean;
  created_at: string;
};

export type AlertItem = {
  id: number;
  bin_id: number;
  type: string;
  message: string;
  acknowledged: boolean;
  created_at: string;
};

export type DailyStats = {
  date: string;
  average_fill: number;
  max_fill: number;
  min_fill: number;
  reading_count: number;
  alarm_count: number;
};

export type User = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

export async function getLatestReading(): Promise<LatestReading | null> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/latest`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Latest reading could not be fetched");
  }

  const data = await response.json();

  if (data.data === null) {
    return null;
  }

  return data;
}

export async function getRecentReadings(): Promise<LatestReading[]> {
  const response = await fetch(`${API_BASE_URL}/api/readings/recent?limit=20`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Recent readings could not be fetched");
  }

  return response.json();
}

export async function getAlerts(): Promise<AlertItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/alerts?limit=20`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Alerts could not be fetched");
  }

  return response.json();
}

export async function getDailyStats(): Promise<DailyStats> {
  const response = await fetch(`${API_BASE_URL}/api/stats/daily`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Daily stats could not be fetched");
  }

  return response.json();
}

export async function acknowledgeAlert(alertId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/alerts/${alertId}/acknowledge`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error("Alert could not be acknowledged");
  }

  return response.json();
}

export async function getUserInfo(): Promise<User | null> {
  const response = await fetch(`${API_BASE_URL}/api/user`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
}

export async function updateUserInfo(userData: {
  email: string;
  first_name: string;
  last_name: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("User info could not be updated");
  }

  return response.json();
}
