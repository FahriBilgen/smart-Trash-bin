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
      desc: odorAlert ? "Koku Tespiti" : "Normal Seviye"
    },
    {
      title: "Mesafe",
      value: distance,
      unit: "CM",
      icon: Gauge,
      color: "text-secondary",
      desc: "Anlık Mesafe"
    },
    {
      title: "Veri Gecikmesi",
      value: lastUpdate ? lastUpdate.split(':')[1] : 0,
      unit: "SN",
      icon: Clock,
      color: "text-secondary",
      desc: "Senkronizasyon"
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
          className="relative p-8 rounded-[2.5rem] bg-white border border-border/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(45,36,30,0.05)] overflow-hidden"
        >
          {/* Decorative Corner Element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className={cn("mb-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/50 transition-colors", stat.color)}>
              <stat.icon size={22} strokeWidth={1.5} />
            </div>

            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-secondary tracking-tighter leading-none">
                  {typeof stat.value === 'number' ? <AnimatedNumber value={stat.value} /> : stat.value}
                </span>
                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{stat.unit}</span>
              </div>
              
              <p className="text-[11px] font-black text-secondary uppercase tracking-[0.2em] mb-1">{stat.title}</p>
              <p className="text-[10px] font-medium text-muted-foreground/60">{stat.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
