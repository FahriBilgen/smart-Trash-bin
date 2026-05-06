"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Save, X, Sparkles } from "lucide-react";
import { updateUserInfo, type User as UserType } from "../lib/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onUpdate: (user: UserType) => void;
};

export default function UserSetupModal({ isOpen, onClose, currentUser, onUpdate }: Props) {
  const [email, setEmail] = useState(currentUser?.email || "");
  const [firstName, setFirstName] = useState(currentUser?.first_name || "");
  const [lastName, setLastName] = useState(currentUser?.last_name || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = await updateUserInfo({
        email,
        first_name: firstName,
        last_name: lastName,
      });
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error("User update error:", error);
      alert("Bilgiler kaydedilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={currentUser ? onClose : undefined}
            className="absolute inset-0 bg-secondary/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="relative mb-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary">
                <Sparkles size={40} />
              </div>
              <h2 className="text-2xl font-black text-secondary tracking-tight">
                {currentUser ? "Hesap Ayarları" : "Hoş Geldiniz"}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                {currentUser ? "Profil bilgilerinizi güncelleyin" : "Akıllı çöp kovası sistemini kurun"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-2xl bg-primary/5 border-2 border-transparent px-12 py-4 text-secondary font-medium focus:border-primary/30 focus:bg-white focus:outline-none transition-all placeholder:text-muted-foreground/40"
                    placeholder="Adınız"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-2xl bg-primary/5 border-2 border-transparent px-12 py-4 text-secondary font-medium focus:border-primary/30 focus:bg-white focus:outline-none transition-all placeholder:text-muted-foreground/40"
                    placeholder="Soyadınız"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-primary/5 border-2 border-transparent px-12 py-4 text-secondary font-medium focus:border-primary/30 focus:bg-white focus:outline-none transition-all placeholder:text-muted-foreground/40"
                    placeholder="E-posta Adresiniz"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {currentUser && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-2xl border-2 border-primary/20 px-6 py-4 font-bold text-secondary transition-all hover:bg-primary/5 active:scale-95"
                  >
                    Vazgeç
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] rounded-2xl bg-secondary px-6 py-4 font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/90 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Save size={20} />
                      Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
