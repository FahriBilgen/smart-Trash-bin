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

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function createAbortController(timeoutMs: number = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 2
): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { controller, timeoutId } = createAbortController(10000);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        throw new ApiError(errorMessage, response.status, url);
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;

      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw lastError;
}

export async function getLatestReading(): Promise<LatestReading | null> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/dashboard/latest`);
    const data = await response.json();

    if (!data || (data.message && data.data === null)) {
      return null;
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Failed to fetch latest reading: ${error.message}`);
    }
    throw error;
  }
}

export async function getRecentReadings(): Promise<LatestReading[]> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/readings/recent?limit=20`
    );
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Failed to fetch recent readings: ${error.message}`);
    }
    throw error;
  }
}

export async function getAlerts(): Promise<AlertItem[]> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/alerts?limit=20`
    );
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Failed to fetch alerts: ${error.message}`);
    }
    throw error;
  }
}

export async function getDailyStats(): Promise<DailyStats> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/stats/daily`
    );
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Failed to fetch daily stats: ${error.message}`);
    }
    throw error;
  }
}

export async function acknowledgeAlert(alertId: number) {
  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/alerts/${alertId}/acknowledge`,
      { method: "PATCH" }
    );
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Failed to acknowledge alert ${alertId}: ${error.message}`);
    }
    throw error;
  }
}

export async function getUserInfo(): Promise<User | null> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/user`);
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        return null;
      }
      console.error(`Failed to fetch user info: ${error.message}`);
    }
    throw error;
  }
}

export async function updateUserInfo(userData: {
  email: string;
  first_name: string;
  last_name: string;
}): Promise<User> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/user`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Failed to update user info: ${error.message}`);
    }
    throw error;
  }
}
