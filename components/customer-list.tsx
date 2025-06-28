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
import { createCustomer, deleteCustomer, fetchCustomer, updateCustomer } from "@/lib/api";
import { Button } from "./ui/button";
import CustomerFormModal from "./CustomerFormModal";
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

interface Customer {
  id: number;
  customer_name: string;
  alamat: string;
  no_hp: string;
}

export default function CustomerTable() {
  const [users, setCustomer] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomer().then(setCustomer);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteCustomer(id, token);
      setCustomer((prev) => prev.filter((u) => u.id !== id));
      toast.success("Customer berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Customer");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateCustomer(data.id, data, token);
      const updatedCustomer = await fetchCustomer();
      setCustomer(updatedCustomer);

      toast.success("Customer berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Customer");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createCustomer(data, token);
      const updated = await fetchCustomer();
      setCustomer(updated);
      toast.success("Customer berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan Customer");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar User</h2>
        <CustomerFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>No Hp</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customer.map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{customer.customer_name}</TableCell>
              <TableCell>{customer.alamat}</TableCell>
              <TableCell>{customer.no_hp}</TableCell>
              <TableCell className="text-right space-x-2">
                <CustomerFormModal
                  customer={customer}
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
                        Yakin ingin menghapus Customer ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(customer.id)}
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