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
import { createStock, deleteStock, fetchStock, updateStock } from "@/lib/api";
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
import StockFormModal from "./StockFormModal";

interface Stock {
  id: number;
  id_barang: string;
  limit: number;
}

export default function StockList() {
  const [stock, setStock] = useState<Stock[]>([]);

  useEffect(() => {
    fetchStock().then(setStock);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteStock(id, token);
      setStock((prev) => prev.filter((u) => u.id !== id));
      toast.success("Stock berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus stock");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      console.log(data);
      await updateStock(data.id, data, token);
      const updatedStock = await fetchStock();
      setStock(updatedStock);

      toast.success("Stock berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate stock");
    }
  };

  const handleCreate = async (data: { id_barang: string; limit: number }) => {
    const token = localStorage.getItem("token");
    try {
      await createStock(data, token);
      const updated = await fetchStock();
      setStock(updated);
      toast.success("Stock berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan stock");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Stock</h2>
        <StockFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Id Barang</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Harga Satuan</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stock.map((stock, index) => (
            <TableRow key={stock.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{stock.id_barang}</TableCell>
              <TableCell>{stock.barang?.nama_barang}</TableCell>
              <TableCell>{stock.barang?.jumlah}</TableCell>
              <TableCell>{stock.barang?.harga}</TableCell>
              <TableCell>{stock.limit}</TableCell>
              <TableCell>
                {stock.barang?.jumlah < stock.limit ? (
                  <span className="bg-red-700 text-white font-semibold text-sm px-2 py-1 rounded-sm">
                    Out of Stock
                  </span>
                ) : (
                  <span className="bg-green-700 text-white font-semibold text-sm px-2 py-1 rounded-sm">
                    In Stock
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <StockFormModal
                  stock={stock}
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
                        Yakin ingin menghapus stock ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(stock.id)}
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
