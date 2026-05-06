"use client";

import { motion } from "framer-motion";
import { Gauge, Wind, Clock, Activity } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AnimatedNumber from "./AnimatedNumber";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsCardsProps {
  gasRaw: number;
  distance: number;
  odorAlert: boolean;
  lastUpdate?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
} as const;

export default function StatsCards({ gasRaw, distance, odorAlert, lastUpdate }: StatsCardsProps) {
  const stats = [
    {
      title: "Hava Kalitesi",
      value: gasRaw,
      unit: "RAW",
      icon: Wind,
      color: odorAlert ? "text-red-500" : "text-primary",
      desc: odorAlert ? "KRİTİK KOKU TESPİTİ" : "Normal Seviye",
      isAlert: odorAlert
    },
    {
      title: "Mesafe",
      value: distance,
      unit: "CM",
      icon: Gauge,
      color: "text-secondary",
      desc: "Anlık Mesafe",
      isAlert: false
    },
    {
      title: "Veri Gecikmesi",
      value: lastUpdate ? lastUpdate.split(':')[1] : 0,
      unit: "SN",
      icon: Clock,
      color: "text-secondary",
      desc: "Senkronizasyon",
      isAlert: false
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={item}
          whileHover={{ y: -5 }}
          className={cn(
            "relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
            stat.isAlert 
              ? "bg-red-50 border-red-200 shadow-[0_20px_40px_rgba(239,68,68,0.1)]" 
              : "bg-white border-border/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(45,36,30,0.05)]"
          )}
        >
          {/* Decorative Corner Element */}
          <div className={cn(
            "absolute top-0 right-0 w-24 h-24 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110",
            stat.isAlert ? "bg-red-500/10" : "bg-primary/5"
          )} />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className={cn(
              "mb-6 w-12 h-12 flex items-center justify-center rounded-2xl transition-colors", 
              stat.isAlert ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-muted/50 " + stat.color
            )}>
              <stat.icon size={22} strokeWidth={stat.isAlert ? 2.5 : 1.5} />
            </div>

            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-1">
                <span className={cn(
                  "text-4xl font-black tracking-tighter leading-none",
                  stat.isAlert ? "text-red-600" : "text-secondary"
                )}>
                  {typeof stat.value === 'number' ? <AnimatedNumber value={stat.value} /> : stat.value}
                </span>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  stat.isAlert ? "text-red-400" : "text-muted-foreground/40"
                )}>{stat.unit}</span>
              </div>
              
              <p className={cn(
                "text-[11px] font-black uppercase tracking-[0.2em] mb-1",
                stat.isAlert ? "text-red-700" : "text-secondary"
              )}>{stat.title}</p>
              <p className={cn(
                "text-[10px] font-medium",
                stat.isAlert ? "text-red-500/80 font-bold" : "text-muted-foreground/60"
              )}>{stat.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
