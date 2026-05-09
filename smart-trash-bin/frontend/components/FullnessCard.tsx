"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
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
  const isOdor = status === 'odor_alert';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center group h-full"
    >
      {}
      <div className={cn(
        "glass-pill mb-8 flex items-center gap-2 z-10 transition-colors",
        isOdor && "bg-red-500 text-white border-red-400"
      )}>
        {isOdor ? <AlertTriangle size={10} className="fill-white" /> : <Zap size={10} className="text-primary fill-primary" />}
        <span>{isOdor ? "KRİTİK DURUM" : "Kapasite Analizi"}</span>
      </div>

      {}
      <div className="relative w-full max-w-[280px] h-[400px] md:h-[450px]">
        {}
        <div className={cn(
          "absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 blur-2xl rounded-full transition-colors",
          isOdor ? "bg-red-500/20" : "bg-secondary/10"
        )} />
        
        {}
        <div className={cn(
          "absolute inset-0 bg-white/30 backdrop-blur-3xl rounded-[4rem] border-[1px] shadow-[inset_0_0_40px_rgba(255,255,255,0.5)] overflow-hidden flex items-end transition-colors",
          isOdor ? "border-red-300 bg-red-50/20" : "border-white/80"
        )}>
          {}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          
          {}
          <motion.div 
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-colors duration-1000",
              (isFull || isOdor) ? "bg-red-400/80" : "bg-primary/60"
            )}
            initial={{ height: 0 }}
            animate={{ height: `${percent}%` }}
            transition={{ type: "spring", stiffness: 30, damping: 15 }}
          >
            {}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
            
            {}
            <motion.div 
              animate={{ x: ["-25%", "25%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-6 left-[-50%] w-[200%] h-12 bg-white/20 rounded-[40%] blur-sm"
            />
          </motion.div>

          {}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={percent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className={cn(
                "text-7xl font-black tracking-tighter leading-none mb-2 transition-colors",
                isOdor ? "text-red-600" : "text-secondary"
              )}>
                <AnimatedNumber value={percent} />
                <span className="text-xl ml-1 opacity-30">%</span>
              </div>
              <div className={cn(
                "text-[10px] font-black uppercase tracking-[0.3em] transition-colors",
                isOdor ? "text-red-400" : "text-secondary/40"
              )}>
                Doluluk
              </div>
            </motion.div>
          </div>
        </div>

        {}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className={cn(
            "absolute -left-6 md:-left-12 top-1/4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border transition-colors",
            isOdor ? "text-red-500 border-red-200" : "text-primary border-white/80"
          )}
        >
          {isOdor ? <AlertTriangle size={18} /> : <Trash2 size={18} />}
        </motion.div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -right-6 md:-right-12 bottom-1/4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-500 border border-white/80"
        >
          <ShieldCheck size={18} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h4 className={cn(
          "text-xl font-black tracking-tight mb-2 capitalize transition-colors",
          isOdor ? "text-red-600" : "text-secondary"
        )}>
          {isOdor ? "Koku Tespiti Edildi!" : status}
        </h4>
        <div className="flex items-center justify-center gap-4">
           <div className={cn("h-[1px] w-8 transition-colors", isOdor ? "bg-red-200" : "bg-primary/20")} />
           <span className={cn(
             "text-[10px] font-black uppercase tracking-[0.4em] transition-colors",
             isOdor ? "text-red-400" : "text-muted-foreground/50"
           )}>
             {isOdor ? "DİKKAT" : "Sistem Stabil"}
           </span>
           <div className={cn("h-[1px] w-8 transition-colors", isOdor ? "bg-red-200" : "bg-primary/20")} />
        </div>
      </motion.div>
    </motion.div>
  );
}
