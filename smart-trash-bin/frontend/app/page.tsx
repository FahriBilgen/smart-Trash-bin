"use client";

import LiveDashboard from "@/components/LiveDashboard";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <LiveDashboard />
    </motion.div>
  );
}
