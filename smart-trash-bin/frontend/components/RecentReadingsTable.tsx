"use client";

import { motion } from "framer-motion";
import { History, ArrowRight, Calendar } from "lucide-react";

interface Reading {
  id: number;
  distance_cm: number;
  fill_percent: number;
  gas_raw: number;
  status: string;
  created_at: string;
}

interface RecentReadingsTableProps {
  readings: Reading[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
} as const;

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
} as const;

export default function RecentReadingsTable({ readings }: RecentReadingsTableProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[3rem] p-10 h-full relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-secondary/5 text-secondary">
            <History size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-secondary tracking-tight">Geçmiş Veriler</h3>
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              <Calendar size={12} />
              <span>Son 20 Kayıt</span>
            </div>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm font-black text-primary hover:text-secondary transition-colors flex items-center gap-2 group bg-primary/5 px-4 py-2 rounded-xl"
        >
          ANALİZ <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-6 py-2">Zaman Damgası</th>
              <th className="px-6 py-2">Doluluk Oranı</th>
              <th className="px-6 py-2 text-center">Gaz (Raw)</th>
              <th className="px-6 py-2 text-right">Durum</th>
            </tr>
          </thead>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {readings.map((reading) => (
              <motion.tr 
                key={reading.id}
                variants={item}
                className="group cursor-default"
              >
                <td className="px-6 py-5 rounded-l-[1.5rem] bg-white/40 group-hover:bg-white/80 transition-colors">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-secondary">
                        {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 font-bold uppercase">
                        {new Date(reading.created_at).toLocaleDateString()}
                      </span>
                   </div>
                </td>
                <td className="px-6 py-5 bg-white/40 group-hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden min-w-[80px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${reading.fill_percent}%` }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
                      />
                    </div>
                    <span className="text-sm font-black text-secondary w-10">%{reading.fill_percent}</span>
                  </div>
                </td>
                <td className="px-6 py-5 bg-white/40 group-hover:bg-white/80 transition-colors text-center font-bold text-muted-foreground">
                  {reading.gas_raw}
                </td>
                <td className="px-6 py-5 rounded-r-[1.5rem] bg-white/40 group-hover:bg-white/80 transition-colors text-right">
                  <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                    reading.status === 'full' ? 'bg-red-500 text-white' : 
                    reading.status === 'warning' ? 'bg-orange-400 text-white' : 
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {reading.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 201, 181, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
}
