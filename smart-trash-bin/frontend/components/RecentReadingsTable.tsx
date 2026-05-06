"use client";

import { motion } from "framer-motion";
import { History, Calendar, ArrowRight } from "lucide-react";

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
    transition: { staggerChildren: 0.05 }
  }
} as const;

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
} as const;

export default function RecentReadingsTable({ readings }: RecentReadingsTableProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40">
              <th className="py-6 px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em]">Zaman</th>
              <th className="py-6 px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em]">Doluluk</th>
              <th className="py-6 px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em] text-center">Gaz</th>
              <th className="py-6 px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em] text-right">Durum</th>
            </tr>
          </thead>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {readings.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
                  Veri Havuzu Boş
                </td>
              </tr>
            ) : (
              readings.map((reading) => (
                <motion.tr 
                  key={reading.id}
                  variants={item}
                  className="border-b border-border/20 group hover:bg-white/40 transition-colors"
                >
                  <td className="py-6 px-4">
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-secondary">
                          {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-tighter">
                          {new Date(reading.created_at).toLocaleDateString()}
                        </span>
                     </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-black text-secondary w-12 tabular-nums">%{reading.fill_percent}</span>
                      <div className="flex-1 h-[2px] bg-border/20 rounded-full overflow-hidden max-w-[100px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${reading.fill_percent}%` }}
                          className="h-full bg-primary" 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-sm font-black text-muted-foreground">{reading.gas_raw}</span>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      reading.status === 'full' ? 'bg-red-50 text-red-500' : 
                      reading.status === 'warning' ? 'bg-orange-50 text-orange-500' : 
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {reading.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}
