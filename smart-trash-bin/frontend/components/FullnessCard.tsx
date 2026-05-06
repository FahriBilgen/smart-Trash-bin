"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, CheckCircle2, Droplets } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AnimatedNumber from "./AnimatedNumber";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FullnessCardProps {
  percent: number;
  status: string;
}

export default function FullnessCard({ percent, status }: FullnessCardProps) {
  const isFull = percent >= 90;
  const isWarning = percent >= 75 && percent < 90;

  const getStatusColor = () => {
    if (isFull) return "text-red-500";
    if (isWarning) return "text-orange-500";
    return "text-emerald-500";
  };

  const getLiquidColor = () => {
    if (isFull) return "bg-gradient-to-t from-red-500 to-red-400";
    if (isWarning) return "bg-gradient-to-t from-orange-500 to-orange-400";
    return "bg-gradient-to-t from-emerald-500 to-emerald-400";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-[3rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500"
    >
      {/* Dynamic Background Glow */}
      <div className={cn(
        "absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] transition-colors duration-1000 opacity-20",
        isFull ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-emerald-500"
      )} />
      
      <div className="flex items-center justify-between w-full mb-10 z-10">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className={cn("p-4 rounded-2xl shadow-lg shadow-black/5", "bg-white", getStatusColor())}
          >
            <Trash2 size={28} />
          </motion.div>
          <div>
            <h3 className="text-2xl font-black text-secondary tracking-tight">Kapasite</h3>
            <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">{status}</p>
          </div>
        </div>
        <motion.div 
          animate={isFull ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={cn("p-3 rounded-full bg-white shadow-sm", getStatusColor())}
        >
          {isFull ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
        </motion.div>
      </div>

      <div className="relative w-56 h-72 bg-primary/5 rounded-[3.5rem] border-[6px] border-white/80 shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Liquid Layer */}
        <motion.div 
          className={cn("absolute bottom-0 left-0 right-0", getLiquidColor())}
          initial={{ height: 0 }}
          animate={{ height: `${percent}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          {/* Advanced Waves */}
          <div className="absolute top-0 left-0 right-0 h-8 -mt-4 overflow-hidden">
            <motion.div 
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="flex w-[200%] h-full opacity-40"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1/4 h-full bg-white rounded-[50%] blur-sm" />
              ))}
            </motion.div>
          </div>
          
          {/* Bubbles */}
          <AnimatePresence>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ bottom: 0, x: Math.random() * 100, opacity: 0 }}
                animate={{ bottom: "100%", opacity: [0, 0.5, 0] }}
                transition={{ duration: 2 + i, repeat: Infinity, delay: i }}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="text-center bg-white/20 backdrop-blur-md rounded-full px-6 py-4 border border-white/30 shadow-xl">
            <div className="text-5xl font-black text-secondary tracking-tighter">
              <AnimatedNumber value={percent} />
              <span className="text-2xl ml-1 opacity-60">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 w-full z-10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white/60 backdrop-blur-sm p-5 rounded-[2rem] border border-white/40 text-center shadow-sm"
        >
          <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest block mb-2">Hacim</span>
          <div className="text-lg font-bold text-secondary">50L</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white/60 backdrop-blur-sm p-5 rounded-[2rem] border border-white/40 text-center shadow-sm"
        >
          <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest block mb-2">Doluluk</span>
          <div className={cn("text-lg font-bold", getStatusColor())}>
            {Math.round(50 * (percent / 100))}L
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
