"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

import { createOrder, updateOrder, fetchOrder, deleteOrder } from "@/lib/api"; // asumsi ada API ini
import OrderFormModal from "./OrderFormModal";

// const OrderFormModal = ({ onSubmit, order, trigger }: any) => trigger;

export default function DaftarOrder() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOrder();
        setOrders(data);
      } catch (err) {
        console.error("Gagal fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id); // panggil API hapus
      setOrders((prev) => prev.filter((item) => item.id !== id)); // update UI
      toast.success("Order berhasil dihapus");
    } catch (err: any) {
      toast.error("Gagal menghapus order");
      console.error(err);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await createOrder(data);
      const updatedOrders = await fetchOrder();
      setOrders(updatedOrders);
      toast.success("Order berhasil ditambahkan");
    } catch (err: any) {
      const message = err?.message?.toLowerCase?.() || "";

      if (message.includes("tidak mencukupi")) {
        toast.warning("Stok barang tidak mencukupi untuk order ini.");
      } else {
        toast.error("Gagal menambahkan order");
      }
    }
  };

  const handleUpdate = async (data: any) => {
    console.log("Update order ID:", data.id);
    try {
      await updateOrder(data.id, data);
      const updatedOrders = await fetchOrder();
      setOrders(updatedOrders);
      toast.success("Order berhasil diperbarui");
    } catch (err: any) {
      const message = err?.message?.toLowerCase?.() || "";

      if (message.includes("tidak mencukupi")) {
        toast.warning("Stok barang tidak mencukupi untuk update order.");
      } else {
        toast.error("Gagal memperbarui order");
      }

      // Opsional: Hilangkan error di console agar tidak mengganggu
      // console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Order</h2>
        <OrderFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama Customer</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Tanggal Order</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.customer?.customer_name}</TableCell>
              <TableCell>{order.barang?.nama_barang}</TableCell>
              <TableCell>
                {new Date(order.order_date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{order.jumlah_barang}</TableCell>
              <TableCell>Rp {order.total.toLocaleString("id-ID")}</TableCell>
              <TableCell className="text-right space-x-2">
                <OrderFormModal
                  order={order}
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
                        Yakin ingin menghapus order ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(order.id)}
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
