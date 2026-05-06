"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, RefreshCw, LayoutDashboard, User as UserIcon, Bell, Activity } from "lucide-react";
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
      setError("Sunucu bağlantısı sağlanamadı. Lütfen internetinizi veya backend servisini kontrol edin.");
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
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-primary mb-8"
        >
          <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl flex items-center justify-center border border-primary/10">
             <RefreshCw size={40} className="text-primary" />
          </div>
        </motion.div>
        <p className="text-secondary font-black tracking-widest uppercase text-[10px] animate-pulse">Sistem Başlatılıyor</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-primary/30 font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <UserSetupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentUser={user}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      <div className="relative z-10 px-6 py-10 md:px-12 lg:px-16 max-w-[1500px] mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center text-white shadow-xl">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-secondary tracking-tight">
                  {user ? `Hoş geldin, ${user.first_name}` : "Akıllı Çöp Sistemi"}
                </h1>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
              <p className="text-sm font-bold text-muted-foreground/60 flex items-center gap-2">
                <span className="uppercase tracking-widest text-[10px]">Canlı Veri Akışı</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                <span>{lastRefresh}</span>
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-2xl bg-white border border-primary/10 flex items-center justify-center text-secondary shadow-sm hover:shadow-md transition-all relative"
            >
              <Bell size={20} />
              {alerts.filter(a => !a.acknowledged).length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </motion.button>
            
            <motion.button 
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all"
            >
              <Settings size={18} />
              Ayarlar
            </motion.button>
          </motion.div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold text-xs flex items-center gap-3"
          >
            <Activity size={16} className="animate-pulse" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <FullnessCard 
                percent={latest?.fill_percent || 0} 
                status={latest?.status || "Aktif"} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[2.5rem] p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <RefreshCw size={20} />
                    </div>
                    <h2 className="text-xl font-black text-secondary tracking-tight">Günlük İstatistikler</h2>
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed text-sm">
                    Bugün veritabanına <span className="text-secondary font-black">{stats?.reading_count || 0}</span> adet veri girişi sağlandı. 
                    Toplamda <span className="text-red-500 font-black">{stats?.alarm_count || 0}</span> adet uyarı durumu oluştu.
                  </p>
                </div>
                
                <div className="mt-8 space-y-6">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Günlük Ortalama Doluluk</span>
                        <span className="text-sm font-black text-secondary">%{stats?.average_fill || 0}</span>
                      </div>
                      <div className="w-full h-2.5 bg-primary/5 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats?.average_fill || 0}%` }}
                          transition={{ duration: 1.5 }}
                          className="h-full bg-primary rounded-full shadow-lg"
                        />
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-2xl bg-white/40 border border-white/60 text-center">
                         <span className="text-[9px] font-black text-muted-foreground/40 uppercase block mb-1">En Yüksek</span>
                         <span className="text-sm font-black text-secondary">%{stats?.max_fill || 0}</span>
                      </div>
                      <div className="flex-1 p-4 rounded-2xl bg-white/40 border border-white/60 text-center">
                         <span className="text-[9px] font-black text-muted-foreground/40 uppercase block mb-1">En Düşük</span>
                         <span className="text-sm font-black text-secondary">%{stats?.min_fill || 0}</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>

            <StatsCards 
              gasRaw={latest?.gas_raw || 0} 
              distance={latest?.distance_cm || 0} 
              odorAlert={latest?.odor_alert || false}
              lastUpdate={latest?.created_at}
            />

            <RecentReadingsTable readings={readings} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 h-full min-h-[500px]">
            <AlertsTable 
              alerts={alerts} 
              onAcknowledge={handleAcknowledge} 
            />
          </div>
        </div>

        <footer className="mt-24 pb-8 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
            Akıllı Çöp Kovası Projesi &copy; 2026 • Gerçek Zamanlı İzleme
          </p>
        </footer>
      </div>
    </div>
  );
}
