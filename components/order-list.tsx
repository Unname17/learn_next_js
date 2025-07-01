"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  createOrder,
  deleteOrder,
  fetchOrder,
  updateOrder,
  fetchBarang,
  fetchCustomer,
} from "@/lib/api";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import OrderFormModal from "./OrderFormModal";

interface Order {
  id?: string;
  customer_id: string;
  id_barang: string;
  order_date: Date | string; // Bisa string atau Date
  jumlah_barang: number;
  total: number;
}

interface Barang {
  id: string;
  nama_barang: string;
}

interface Customer {
  id: string;
  customer_name: string;
}

export default function OrderList() {
  const [order, setOrder] = useState<Order[]>([]);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [OrderData, barangData, customerData] = await Promise.all([
          fetchOrder(),
          fetchBarang(),
          fetchCustomer(),
        ]);
        setOrder(OrderData);
        setBarangList(barangData);
        setCustomerList(customerData);
      } catch (error) {
        toast.error("Gagal memuat data");
        console.error(error);
      }
    }

    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrder((prev) => prev.filter((u) => u.id !== id));
      toast.success("Data Pemesanan berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Data Pemesanan");
    }
  };

  const handleUpdate = async (data: Order) => {
    try {
      await updateOrder(data.id!, data);
      const updatedOrder = await fetchOrder();
      setOrder(updatedOrder);
      toast.success("Data Order berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Data Pesanan");
    }
  };

  const handleCreate = async (data: Omit<Order, "id">) => {
    try {
      await createOrder(data);
      const updated = await fetchOrder();
      setOrder(updated);
      toast.success("Data Pemesanan berhasil ditambahkan");
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan Data Pemesanan");
    }
  };

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  const getNamaBarang = (id_barang: string) => {
    return (
      barangList.find((b) => b.id === id_barang)?.nama_barang ||
      "Barang tidak ditemukan"
    );
  };

  const getNamaCustomer = (customer_id: string) => {
    return (
      customerList.find((b) => b.id === customer_id)?.customer_name ||
      "Customer tidak ditemukan"
    );
  };

  // Format tanggal tampil rapi (dd Month yyyy)
  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Urutkan order berdasarkan order_date ascending
  const sortedOrders = [...order].sort(
    (a, b) =>
      new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
  );

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Pemesanan Barang</h2>
        <OrderFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Pelanggan</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Tanggal Transaksi</TableHead>
            <TableHead>Jumlah pemebelian</TableHead>
            <TableHead>Total Pembelian</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{getNamaCustomer(item.customer_id)}</TableCell>
              <TableCell>{getNamaBarang(item.id_barang)}</TableCell>
              <TableCell>{formatDate(item.order_date)}</TableCell>
              <TableCell>{item.jumlah_barang}</TableCell>
              <TableCell>{formatRupiah(item.total)}</TableCell>
              <TableCell className="text-right space-x-2">
                <OrderFormModal
                  order={item}
                  onSubmit={handleUpdate}
                  trigger={
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Yakin ingin menghapus Data Pemesanan ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id!)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
