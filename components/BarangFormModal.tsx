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
import { useState } from "react";

interface Barang {
  id?: string;
  nama_barang: string;
  harga: number;
  jumlah?: number;
}

interface Props {
  barang?: Barang;
  trigger: React.ReactNode;
  onSubmit: (data: Barang) => void;
}

export default function BarangFormModal({ barang, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Barang>({
    nama_barang: barang?.nama_barang || "",
    harga: barang?.harga || "",
    jumlah: barang?.jumlah || "",
    id: barang?.id || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{barang ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            name="nama_barang"
            placeholder="Nama"
            value={form.nama_barang}
            onChange={handleChange}
          />
          <Input
            name="jumlah"
            placeholder="Jumlah"
            value={form.jumlah}
            onChange={handleChange}
          />
          <Input
            name="harga"
            placeholder="Harga"
            value={form.harga}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {barang ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
