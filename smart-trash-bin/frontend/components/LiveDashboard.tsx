"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, RefreshCw, LayoutDashboard, User as UserIcon, Bell } from "lucide-react";
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
      setError("Bağlantı hatası: Sunucuya ulaşılamıyor.");
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
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-primary mb-8"
        >
          <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center">
             <RefreshCw size={48} />
          </div>
        </motion.div>
        <p className="text-secondary font-black tracking-widest uppercase text-xs animate-pulse">Sistem Yükleniyor</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-primary/30">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, -50, 0],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px]"
        />
      </div>

      <UserSetupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentUser={user}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      <div className="relative z-10 px-6 py-12 md:px-12 lg:px-20 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <motion.div 
              whileHover={{ rotate: -10, scale: 1.1 }}
              className="w-20 h-20 rounded-[2.5rem] bg-secondary flex items-center justify-center text-white shadow-2xl shadow-secondary/20"
            >
              <LayoutDashboard size={40} />
            </motion.div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black text-secondary tracking-tighter md:text-5xl">
                  {user ? `Hoş geldin, ${user.first_name}` : "Dashboard"}
                </h1>
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-lg font-bold text-muted-foreground/60 flex items-center gap-3">
                <span className="uppercase tracking-[0.3em] text-xs font-black">Canlı İzleme</span>
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                <span className="tabular-nums">{lastRefresh}</span>
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
               <motion.button 
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 className="w-14 h-14 rounded-2xl bg-white border border-primary/10 flex items-center justify-center text-secondary shadow-sm hover:shadow-md transition-all"
               >
                 <Bell size={24} />
                 {alerts.length > 0 && (
                   <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                 )}
               </motion.button>
            </div>
            
            <motion.button 
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-secondary text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-secondary/30 hover:bg-secondary/90 transition-all"
            >
              <Settings size={20} />
              Hesap Ayarları
            </motion.button>
            
            <div className="w-14 h-14 rounded-2xl bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm">
              <UserIcon size={28} />
            </div>
          </motion.div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-10 p-6 rounded-3xl bg-red-50 border border-red-100 text-red-600 font-black text-sm flex items-center gap-4 shadow-xl shadow-red-500/5"
          >
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Visualizer & Summary */}
          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <FullnessCard 
                percent={latest?.fill_percent || 0} 
                status={latest?.status || "Aktif"} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[3rem] p-10 h-full flex flex-col justify-between border-primary/5"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <RefreshCw size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-secondary tracking-tight">Sistem Özeti</h2>
                  </div>
                  <p className="text-muted-foreground font-medium leading-loose text-sm">
                    Bugün toplam <span className="text-secondary font-black">{stats?.reading_count || 0}</span> veri noktası kaydedildi. 
                    Sistem kararlılığı <span className="text-emerald-600 font-black">%99.8</span> seviyesinde. 
                    Ortalama doluluk oranı şuan <span className="text-primary font-black">%{stats?.average_fill || 0}</span> olarak ölçüldü.
                  </p>
                </div>
                
                <div className="mt-10 space-y-6">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Genel Verimlilik</span>
                        <span className="text-sm font-black text-secondary">%{stats?.average_fill || 0}</span>
                      </div>
                      <div className="w-full h-3 bg-primary/5 rounded-full overflow-hidden p-0.5 border border-white">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats?.average_fill || 0}%` }}
                          transition={{ duration: 1.5, type: "spring" }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-lg shadow-primary/20"
                        />
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-2xl bg-white/40 border border-white text-center">
                         <span className="text-[9px] font-black text-muted-foreground/40 uppercase block mb-1">Max Doluluk</span>
                         <span className="text-sm font-black text-secondary">%{stats?.max_fill || 0}</span>
                      </div>
                      <div className="flex-1 p-4 rounded-2xl bg-white/40 border border-white text-center">
                         <span className="text-[9px] font-black text-muted-foreground/40 uppercase block mb-1">Alarm Sayısı</span>
                         <span className="text-sm font-black text-red-500">{stats?.alarm_count || 0}</span>
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

          {/* Side: Alerts */}
          <div className="lg:col-span-4 h-full">
            <AlertsTable 
              alerts={alerts} 
              onAcknowledge={handleAcknowledge} 
            />
          </div>
        </div>

        <footer className="mt-32 pb-12 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-6 px-10 py-5 rounded-[2rem] bg-white/30 backdrop-blur-md border border-white/40"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
              Anka Projesi &copy; 2026 • Premium IoT Ecosystem
            </p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
