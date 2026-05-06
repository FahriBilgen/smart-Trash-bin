"use client";

import { motion } from "framer-motion";
import { BellRing, CheckCircle, Trash2, Wind } from "lucide-react";

interface Alert {
  id: number;
  type: string;
  message: string;
  acknowledged: boolean;
  created_at: string;
}

interface AlertsTableProps {
  alerts: Alert[];
  onAcknowledge: (id: number) => void;
}

export default function AlertsTable({ alerts, onAcknowledge }: AlertsTableProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card rounded-[2.5rem] p-8 h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
            <BellRing size={20} />
          </div>
          <h3 className="text-xl font-bold text-secondary">Bildirimler</h3>
        </div>
        {alerts.length > 0 && (
          <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">
            {alerts.length} Yeni
          </span>
        )}
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Her Şey Yolunda!</p>
            <p className="text-xs text-muted-foreground/60">Yeni bildirim bulunmuyor.</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl border flex items-start gap-4 transition-all group ${
                alert.acknowledged ? 'bg-muted/30 border-transparent grayscale' : 'bg-white/50 border-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                alert.type === 'odor' ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'
              }`}>
                {alert.type === 'odor' ? <Wind size={18} /> : <Trash2 size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary truncate">{alert.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
              {!alert.acknowledged && (
                <button 
                  onClick={() => onAcknowledge(alert.id)}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Onayla"
                >
                  <CheckCircle size={16} />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 201, 181, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
}
