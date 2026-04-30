"use client";

// Sorumlu: Fahri + Alper + Mustafa
// FAHRI + ALPER - Canli Dashboard
// Fahri: Premium tasarim ve profil yonetimini hazirladi.
// Alper: Backend API'den 1 saniyede bir otomatik veri cekme mantigini ekledi.
// Mustafa: Sensor verilerinin dashboard'da dogru yorumlanmasini kontrol eder.

import { useEffect, useState } from "react";

import FullnessCard from "./FullnessCard";
import StatsCards from "./StatsCards";
import AlertsTable from "./AlertsTable";
import RecentReadingsTable from "./RecentReadingsTable";
import UserSetupModal from "./UserSetupModal";

import {
  getAlerts,
  getDailyStats,
  getLatestReading,
  getRecentReadings,
  getUserInfo,
  type AlertItem,
  type DailyStats,
  type LatestReading,
  type User,
} from "../lib/api";

export default function LiveDashboard() {
  const [latest, setLatest] = useState<LatestReading | null>(null);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [readings, setReadings] = useState<LatestReading[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadDashboardData() {
    try {
      const [latestData, statsData, alertsData, readingsData, userData] =
        await Promise.all([
          getLatestReading(),
          getDailyStats(),
          getAlerts(),
          getRecentReadings(),
          getUserInfo(),
        ]);

      setLatest(latestData);
      setStats(statsData);
      setAlerts(alertsData);
      setReadings(readingsData);
      setUser(userData);
      
      if (!userData && !isModalOpen) {
        setIsModalOpen(true);
      }

      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Bağlantı hatası: Sunucuya ulaşılamıyor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
    const intervalId = setInterval(loadDashboardData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 selection:bg-indigo-100">
      {/* Arka Plan Dekorasyonu */}
      <div className="absolute left-0 top-0 h-[500px] w-full bg-gradient-to-b from-indigo-100/50 to-transparent" />
      <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-blue-100/30 blur-[120px]" />
      
      <UserSetupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentUser={user}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Header Section */}
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-700">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Smart IoT Node
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
              {user ? (
                <span>Welcome back, <span className="text-indigo-600">{user.first_name}</span>.</span>
              ) : (
                "Trash Monitoring"
              )}
            </h1>
            <p className="text-lg font-medium text-slate-500 max-w-xl leading-relaxed">
              Real-time analytics and odor monitoring system for your smart environment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl bg-white/50 p-1 backdrop-blur-sm md:flex">
              <div className="px-4 py-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                <p className="text-sm font-bold text-slate-900 tabular-nums">LIVE {lastRefresh}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 font-bold text-white shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95"
            >
              Settings
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Main Visualizer */}
          <FullnessCard reading={latest} />

          {/* Statistics Grid */}
          <StatsCards stats={stats} />

          {/* Tables Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <AlertsTable alerts={alerts} onAlertUpdated={loadDashboardData} />
            <RecentReadingsTable readings={readings} />
          </div>
        </div>
        
        <footer className="mt-20 border-t border-slate-200 py-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Smart Trash Bin Project &copy; 2026 • Powered by ESP32 & FastAPI
          </p>
        </footer>
      </div>
    </main>
  );
}
