"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldCheck, Zap } from "lucide-react";
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center group h-full"
    >
      {/* Label Pill */}
      <div className="glass-pill mb-8 flex items-center gap-2 z-10">
        <Zap size={10} className="text-primary fill-primary" />
        <span>Kapasite Analizi</span>
      </div>

      {/* Main Vessel */}
      <div className="relative w-64 h-[450px]">
        {/* Vessel Shadow/Base */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-secondary/10 blur-2xl rounded-full" />
        
        {/* Glass Container */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl rounded-[4rem] border-[1px] border-white/80 shadow-[inset_0_0_40px_rgba(255,255,255,0.5)] overflow-hidden flex items-end">
          {/* Inner Light/Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          
          {/* Liquid Vessel */}
          <motion.div 
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-colors duration-1000",
              isFull ? "bg-red-400/80" : "bg-primary/60"
            )}
            initial={{ height: 0 }}
            animate={{ height: `${percent}%` }}
            transition={{ type: "spring", stiffness: 30, damping: 15 }}
          >
            {/* Top Surface Glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
            
            {/* Waves */}
            <motion.div 
              animate={{ x: ["-25%", "25%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-6 left-[-50%] w-[200%] h-12 bg-white/20 rounded-[40%] blur-sm"
            />
          </motion.div>

          {/* Reading Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={percent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-7xl font-black text-secondary tracking-tighter leading-none mb-2">
                <AnimatedNumber value={percent} />
                <span className="text-xl ml-1 opacity-30">%</span>
              </div>
              <div className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.3em]">
                Doluluk
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Icons around the vessel */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -left-12 top-1/4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary border border-white/80"
        >
          <Trash2 size={20} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -right-12 bottom-1/4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-500 border border-white/80"
        >
          <ShieldCheck size={20} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h4 className="text-xl font-black text-secondary tracking-tight mb-2 capitalize">{status}</h4>
        <div className="flex items-center justify-center gap-4">
           <div className="h-[1px] w-8 bg-primary/20" />
           <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em]">Sistem Stabil</span>
           <div className="h-[1px] w-8 bg-primary/20" />
        </div>
      </motion.div>
    </motion.div>
  );
}
