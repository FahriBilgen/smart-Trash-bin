"use client";

import { motion } from "framer-motion";
import { Gauge, Wind, Thermometer, Clock, Activity } from "lucide-react";
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
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const item = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
} as const;

export default function StatsCards({ gasRaw, distance, odorAlert, lastUpdate }: StatsCardsProps) {
  const stats = [
    {
      title: "Hava Kalitesi",
      value: gasRaw,
      unit: "Raw",
      icon: Wind,
      color: odorAlert ? "text-red-500" : "text-primary",
      bgColor: odorAlert ? "bg-red-50" : "bg-primary/5",
      alert: odorAlert ? "Koku Tespiti!" : null
    },
    {
      title: "Mesafe",
      value: distance,
      unit: "cm",
      icon: Gauge,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Ortam Sıcaklığı",
      value: 24,
      unit: "°C",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Veri Akışı",
      value: lastUpdate ? lastUpdate.split(':')[1] : 0,
      unit: "sn",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={item}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-card rounded-[2.5rem] p-7 group cursor-default relative overflow-hidden"
        >
          {/* Subtle Glow on Hover */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-white to-transparent",
            stat.bgColor
          )} />

          <div className="flex items-start justify-between mb-6 relative z-10">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={cn("p-4 rounded-2xl shadow-inner bg-white/80", stat.color)}
            >
              <stat.icon size={24} />
            </motion.div>
            {stat.alert && (
              <motion.span 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="px-3 py-1 bg-red-500 text-white text-[9px] font-black rounded-full uppercase tracking-tighter shadow-lg shadow-red-200"
              >
                {stat.alert}
              </motion.span>
            )}
            {!stat.alert && (
              <div className="p-2 rounded-full bg-emerald-50 text-emerald-500">
                <Activity size={12} className="animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="relative z-10">
            <p className="text-xs font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">{stat.title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-secondary tracking-tighter">
                {typeof stat.value === 'number' ? <AnimatedNumber value={stat.value} /> : stat.value}
              </span>
              <span className="text-sm font-bold text-muted-foreground/40">{stat.unit}</span>
            </div>
          </div>

          {/* Progress bar decoration */}
          <div className="mt-4 w-full h-1 bg-primary/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               transition={{ duration: 2, delay: index * 0.2 }}
               className={cn("h-full opacity-20", stat.color.replace('text', 'bg'))}
             />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
