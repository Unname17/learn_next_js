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
  createStock,
  deleteStock,
  fetchStock,
  updateStock,
  fetchBarang,
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
import StockFormModal from "./StockFormModal";

interface Stock {
  id: string;
  id_barang: string;
  limit: number;
}

interface Barang {
  id: string;
  nama_barang: string;
}

export default function StockList() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [barangList, setBarangList] = useState<Barang[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [stockData, barangData] = await Promise.all([
          fetchStock(),
          fetchBarang(),
        ]);
        setStock(stockData);
        setBarangList(barangData);
      } catch (error) {
        toast.error("Gagal memuat data");
        console.error(error);
      }
    }

    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteStock(id);
      setStock((prev) => prev.filter((u) => u.id !== id));
      toast.success("Stock Barang berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Stock Barang");
    }
  };

  const handleUpdate = async (data: Stock) => {
    try {
      await updateStock(data.id!, data);
      const updatedStock = await fetchStock();
      setStock(updatedStock);
      toast.success("Stock Barang berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Stock Barang");
    }
  };

  const handleCreate = async (data: Omit<Stock, "id">) => {
    try {
      await createStock(data);
      const updated = await fetchStock();
      setStock(updated);
      toast.success("Stock Barang berhasil ditambahkan");
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan Stock Barang");
    }
  };

  // fungsi bantu untuk cari nama barang dari id_barang
  const getNamaBarang = (id_barang: string) => {
    return (
      barangList.find((b) => b.id === id_barang)?.nama_barang ||
      "Barang tidak ditemukan"
    );
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Stock Barang</h2>
        <StockFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Limit Barang</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stock.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{getNamaBarang(item.id_barang)}</TableCell>
              <TableCell>{item.limit}</TableCell>
              <TableCell className="text-right space-x-2">
                <StockFormModal
                  stock={item}
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
                        Yakin ingin menghapus Stock barang ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
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
