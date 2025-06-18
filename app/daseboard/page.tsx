"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; id: string; } | null>(
    null
  );

  useEffect(() => {
    // Ambil token dari localStorage (atau bisa juga pakai cookies/session)
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      toast.error("Anda belum login!");
      router.push("/login");
      return;
    }

    // Simulasikan data user (bisa fetch dari API)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ name: "Asrul Abdullah", email: "asrul@example.com", id:"xxxx"}); // fallback
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await logout(token); // panggil API untuk hapus token dari server
      toast.error("Logout berhasil");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

    } catch (err) {
      toast.error("Gagal logout");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 space-y-4">
      <h1 className="text-3xl font-bold">Selamat Datang di Dashboard</h1>

      {user && (
        <div className="border rounded p-4 bg-gray-50 space-y-2">
          <p>
            <strong>Nama:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p><strong>ID User:</strong>{user.id}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}