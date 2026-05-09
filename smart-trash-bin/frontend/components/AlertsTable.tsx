"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Trash2, Clock } from "lucide-react";

interface AlertItem {
  id: number;
  type: string;
  message: string;
  acknowledged: boolean;
  created_at: string;
}

interface AlertsTableProps {
  alerts: AlertItem[];
  onAcknowledge: (id: number) => void;
}

export default function AlertsTable({ alerts, onAcknowledge }: AlertsTableProps) {
  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="space-y-8">
      <AnimatePresence mode="popLayout">
        {activeAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 rounded-[3rem] border border-dashed border-border/60 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black text-secondary tracking-tight">Sistem Güvende</h4>
               <p className="text-xs font-medium text-muted-foreground">Aktif bir uyarı veya sorun tespit edilmedi.</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAlerts.map((alert) => (
              <motion.div
                layout
                key={alert.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="relative p-8 rounded-[2.5rem] bg-white border border-border/50 shadow-sm overflow-hidden group"
              >
                {}
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[5rem] -mr-8 -mt-8" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-red-50 text-red-500">
                      <AlertCircle size={20} />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                      <Clock size={12} />
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <h4 className="text-lg font-black text-secondary tracking-tight mb-2">
                    {alert.type === 'full' ? 'Kapasite Aşımı' : 'Koku Tespiti'}
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8">
                    {alert.message}
                  </p>

                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="w-full py-4 rounded-2xl bg-secondary text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-secondary/90 active:scale-95"
                  >
                    Bildirimi Onayla
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
