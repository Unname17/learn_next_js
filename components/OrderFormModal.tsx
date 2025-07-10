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
import { fetchBarang, fetchCustomers } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

interface Order {
  id?: string;
  id_customer: string;
  id_barang: string;
  order_date: Date;
  jumlah_barang: number;
  total: number;
}

interface Props {
  order?: Order;
  trigger: React.ReactNode;
  onSubmit: (data: Order) => void;
}

export default function StockFormModal({ order, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [barangList, setBarangList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  const [form, setForm] = useState<Order>({
    id_customer: order?.id_customer ?? "",
    id_barang: order?.id_barang ?? "",
    order_date: order?.order_date ?? new Date(),
    jumlah_barang: order?.jumlah_barang ?? 0,
    total: order?.total ?? 0,
    id: order?.id,
  });

  // Fetch barang list
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

  // Fetch customer list
  useEffect(() => {
    async function loadCustomer() {
      try {
        const data = await fetchCustomers();
        setCustomerList(data);
      } catch {
        toast.error("Gagal mengambil data Customer");
      }
    }
    loadCustomer();
  }, []);

  // Reset form saat modal dibuka
  useEffect(() => {
    if (open) {
      setForm({
        id: order?.id || "",
        id_customer: order?.id_customer || "",
        id_barang: order?.id_barang || "",
        order_date: order?.order_date || new Date(),
        jumlah_barang: order?.jumlah_barang || 0,
        total: order?.total || 0,
      });
    }
  }, [open, order]);

  // Hitung total harga ketika id_barang atau jumlah_barang berubah
  useEffect(() => {
    const barang = barangList.find((b) => b.id === form.id_barang);
    const hargaBarang = barang?.harga || 0;
    const totalHarga = hargaBarang * form.jumlah_barang;
    setForm((f) => ({
      ...f,
      total: totalHarga,
    }));
  }, [form.id_barang, form.jumlah_barang, barangList]);

  // Handler untuk input tanggal (convert ke Date)
  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({
      ...f,
      order_date: new Date(e.target.value),
    }));
  };

  // Handler untuk input angka (jumlah_barang)
  const handleChangeJumlahBarang = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : parseInt(e.target.value);
    setForm((f) => ({
      ...f,
      jumlah_barang: isNaN(value) ? 0 : value,
    }));
  };

  // Format Date object ke MySQL datetime "YYYY-MM-DD HH:mm:ss"
  const formatDateTimeMySQL = (date: Date) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  // Validasi dan submit form
  const handleSubmit = () => {
    if (!form.id_barang) {
      toast.error("Silakan pilih barang");
      return;
    }
    if (!form.id_customer) {
      toast.error("Silakan pilih pelanggan");
      return;
    }
    if (form.jumlah_barang <= 0 || isNaN(form.jumlah_barang)) {
      toast.error("Jumlah barang harus lebih dari 0");
      return;
    }
    if (form.total <= 0 || isNaN(form.total)) {
      toast.error("Total harus lebih dari 0");
      return;
    }

    // Kirim data dengan order_date sudah diformat MySQL datetime string
    onSubmit({
      ...form,
      order_date: formatDateTimeMySQL(form.order_date) as any, // cast supaya sesuai tipe (string ke Date)
    });

    setOpen(false);
  };

  // Format tanggal ke yyyy-mm-dd agar bisa bind ke input date
  const formatDateInput = (date: Date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Tambah Order"}</DialogTitle>
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
          <input type="hidden" name="id_barang" value={form.id_barang} />

          <Select
            value={form.id_customer ?? ""}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, id_customer: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Pelanggan" />
            </SelectTrigger>
            <SelectContent>
              {customerList.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.customer_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="id_customer" value={form.id_customer} />

          <Input
            type="date"
            value={formatDateInput(form.order_date)}
            onChange={handleChangeDate}
            placeholder="Tanggal Transaksi"
          />

          <Input
            value={form.jumlah_barang}
            onChange={handleChangeJumlahBarang}
            placeholder="Jumlah Pembelian"
          />

          {/* Total harga tampil sebagai teks / readonly input */}
          <div className="border rounded px-3 py-2 bg-gray-100 text-right">
            Total Harga: Rp {form.total.toLocaleString()}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {order ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
