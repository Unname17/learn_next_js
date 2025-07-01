"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchBarang } from "@/lib/api";
import { toast } from "sonner";

interface Barang {
  id: string;
  nama_barang: string;
}

interface Stock {
  id?: string;
  id_barang: string;
  limit: number;
}

interface Props {
  stock?: Stock;
  trigger: React.ReactNode;
  onSubmit: (data: Stock) => void;
}

export default function StockFormModal({ stock, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [barangList, setBarangList] = useState<Barang[]>([]);

  const [form, setForm] = useState<Stock>({
    id_barang: stock?.id_barang || "",
    limit: stock?.limit || 1,
    id: stock?.id,
  });

  useEffect(() => {
    async function loadBarang() {
      try {
        const data = await fetchBarang();
        setBarangList(data);
      } catch {
        toast.error("Gagal mengambil data barang");
      }
    }
    loadBarang();
  }, []);

  // Reset form setiap buka modal (edit atau tambah)
  useEffect(() => {
    if (open) {
      setForm({
        id_barang: stock?.id_barang || "",
        limit: stock?.limit || 1,
        id: stock?.id,
      });
    }
  }, [open, stock]);

  const handleChangeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value);
    setForm((f) => ({
      ...f,
      limit: typeof value === "number" && !isNaN(value) ? value : 0,
    }));
  };

  const handleChangeBarang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({
      ...f,
      id_barang: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!form.id_barang) {
      toast.error("Silakan pilih barang");
      return;
    }
    if (form.limit <= 0 || isNaN(form.limit)) {
      toast.error("Limit harus lebih dari 0");
      return;
    }
    onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stock ? "Edit Stok" : "Tambah Stok"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <select
            value={form.id_barang}
            onChange={handleChangeBarang}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Pilih Barang --</option>
            {barangList.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nama_barang}
              </option>
            ))}
          </select>

          <Input
            type="number"
            min={1}
            value={form.limit}
            onChange={handleChangeLimit}
            placeholder="Limit Stok"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {stock ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
