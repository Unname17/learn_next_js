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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchBarang } from "@/lib/api";

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
  const [form, setForm] = useState({
    id_barang: stock?.id_barang ?? "",
    limit: stock?.limit ?? 0,
  });
  const [value, setValue] = useState("");
  const [barangList, setBarangList] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit({
      id: stock?.id, // <- pastikan ID ini dikirim
      id_barang: form.id_barang,
      limit: form.limit,
    });
    setOpen(false);
  };

  useEffect(() => {
    const loadBarang = async () => {
      try {
        const data = await fetchBarang();
        setBarangList(data);
      } catch (err) {
        console.error("Error fetching barang:", err);
      }
    };

    loadBarang();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stock ? "Edit Stock" : "Tambah Stock"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Select
            value={form.id_barang ?? ""}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, id_barang: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Barang" />
            </SelectTrigger>
            <SelectContent>
              {barangList.map((barang) => (
                <SelectItem key={barang.id} value={barang.id}>
                  {barang.nama_barang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="id_barang" value={value} />

          <Input
            name="limit"
            placeholder="Jumlah"
            value={form.limit}
            onChange={handleChange}
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
