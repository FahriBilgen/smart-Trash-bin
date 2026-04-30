"use client";

// Sorumlu: Fahri
// FAHRI - Kullanici Kurulum ve Ayarlar Modali
// Bu bilesen kullanicidan ad, soyad ve mail bilgilerini alir.

import { useState } from "react";
import { updateUserInfo, type User } from "../lib/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdate: (user: User) => void;
};

export default function UserSetupModal({ isOpen, onClose, currentUser, onUpdate }: Props) {
  const [email, setEmail] = useState(currentUser?.email || "");
  const [firstName, setFirstName] = useState(currentUser?.first_name || "");
  const [lastName, setLastName] = useState(currentUser?.last_name || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentUser ? "Account Settings" : "Welcome to Smart Trash Bin"}
        </h2>
        <p className="mt-2 text-gray-600">
          Please enter your details. Alert notifications will be sent to this email address.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              placeholder="Fahri"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              placeholder="Soyad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              placeholder="example@gmail.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Saving..." : "Save and Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
