"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, RefreshCw, LayoutDashboard, User as UserIcon, Bell, Activity, ArrowUpRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  acknowledgeAlert,
  type AlertItem,
  type DailyStats,
  type LatestReading,
  type User,
} from "../lib/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
        await Promise.allSettled([
          getLatestReading(),
          getDailyStats(),
          getAlerts(),
          getRecentReadings(),
          getUserInfo(),
        ]);

      setLatest(latestData.status === 'fulfilled' ? latestData.value : null);
      setStats(statsData.status === 'fulfilled' ? statsData.value : null);
      setAlerts(alertsData.status === 'fulfilled' ? (alertsData.value || []) : []);
      setReadings(readingsData.status === 'fulfilled' ? (readingsData.value || []) : []);
      setUser(userData.status === 'fulfilled' ? userData.value : null);

      if (userData.status === 'fulfilled' && !userData.value && !isModalOpen) {
        setIsModalOpen(true);
      }

      setLastRefresh(new Date().toLocaleTimeString());
      setError("");
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Bağlantı Kesildi");
    } finally {
      setLoading(false);
    }
  }

  const handleAcknowledge = async (id: number) => {
    try {
      await acknowledgeAlert(id);
      loadDashboardData();
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const intervalId = setInterval(loadDashboardData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading && !latest) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="noise-overlay" />
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-primary font-black uppercase tracking-[0.5em] text-[10px]"
        >
          Anka Sistemi Başlatılıyor
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-primary/30 font-sans">
      <div className="noise-overlay" />
      
      <UserSetupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentUser={user}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      <div className="relative z-10 px-8 py-16 md:px-20 lg:px-32 max-w-[1800px] mx-auto">
        {/* Header */}
        <header className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="glass-pill inline-flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif • {lastRefresh}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-secondary tracking-tighter leading-[0.85] mb-8 text-balance">
              {user ? user.first_name : "Smart"} <br/> 
              <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-lg font-medium text-muted-foreground max-w-md leading-relaxed">
              IoT tabanlı akıllı kova sistemi üzerinden gelen verilerin anlık analiz ve izleme paneli.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-2xl shadow-secondary/20 group"
            >
              <Settings size={32} className="group-hover:rotate-90 transition-transform duration-700" />
            </button>
            <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center text-secondary relative">
               <UserIcon size={32} />
               {alerts.filter(a => !a.acknowledged).length > 0 && (
                 <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full text-white text-[10px] font-black flex items-center justify-center border-4 border-background">
                   {alerts.filter(a => !a.acknowledged).length}
                 </div>
               )}
            </div>
          </motion.div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12 text-red-500 font-black uppercase tracking-widest text-[10px] flex items-center gap-3"
          >
            <Activity size={14} className="animate-pulse" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Main Visualizer */}
          <div className="lg:col-span-5 h-full">
            <FullnessCard 
              percent={latest?.fill_percent || 0} 
              status={latest?.status || "Stabil"} 
            />
          </div>

          {/* Stats & Tables */}
          <div className="lg:col-span-7 space-y-24">
            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase tracking-[0.1em]">Anlık Metrikler</h2>
                <div className="h-[1px] flex-1 mx-8 bg-border/40" />
              </div>
              <StatsCards 
                gasRaw={latest?.gas_raw || 0} 
                distance={latest?.distance_cm || 0} 
                odorAlert={latest?.odor_alert || false}
                lastUpdate={latest?.created_at}
              />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">Günlük Verim</h3>
                  <div className="p-10 rounded-[3rem] bg-white border border-border/40 flex flex-col items-center justify-center text-center shadow-sm">
                     <div className="text-5xl font-black text-secondary tracking-tighter mb-2">
                        %{stats?.average_fill || 0}
                     </div>
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest">Ortalama Doluluk</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">Günlük Toplam Olay</h3>
                  <div className="p-10 rounded-[3rem] bg-secondary text-white flex flex-col items-center justify-center text-center shadow-2xl shadow-secondary/10">
                     <div className="text-5xl font-black tracking-tighter mb-2">
                        {stats?.alarm_count || 0}
                     </div>
                     <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Tespit Edilen Olay</p>
                  </div>
               </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase tracking-[0.1em]">Veri Günlüğü</h2>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                  TÜMÜ <ArrowUpRight size={14} />
                </button>
              </div>
              <RecentReadingsTable readings={readings} />
            </section>
          </div>
        </div>

        {/* Alerts Section - Full Width at bottom for a high-end feel */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-secondary tracking-tighter uppercase tracking-[0.1em]">Olay Kayıtları</h2>
            <div className="glass-pill">Kritik Bildirimler</div>
          </div>
          <AlertsTable 
            alerts={alerts} 
            onAcknowledge={handleAcknowledge} 
          />
        </section>

        <footer className="mt-48 pb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-border/40 pt-12">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
            ANKA PROJESI • SMART TRASH SYSTEM
          </div>
          <div className="flex gap-8">
             <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">v1.2.0</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Status: Stable</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
