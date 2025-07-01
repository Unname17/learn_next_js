"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(username, password);

      // Misalnya token dikembalikan dan disimpan
      if (res.token) {
        // Simpan token ke localStorage atau cookies
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        // Redirect ke dashboard
        toast.success("Login berhasil!");
        setTimeout(() => {
          router.push("/dashboard-full");
        }, 1000); // 1 detik delay
      } else {
        toast.error("Login gagal: token tidak diterima");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Terjadi kesalahan saat login.";
      toast.error("Login gagal", {
        description: msg,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Username:</label>
          <input
            type="text"
            className="border w-full px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            className="border w-full px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}