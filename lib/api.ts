import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token"); // atau dari cookies

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};

export const logout = async (token: string | null) => {
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await axios.post(
    `${BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Register
export async function register(data: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registrasi gagal");
  }

  return res.json();
}

// Reset Password
export async function resetPassword(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Reset password gagal");
  }

  return await res.json();
}

// API Count Pengguna (tanpa autentikasi)
export async function fetchUserCount(): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/users/count`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Gagal mengambil data user");
    const data = await res.json();
    return data.count;
  } catch (error) {
    console.error("fetchUserCount error:", error);
    return null;
  }
}

// API Count Customer (tanpa autentikasi)
export async function fetchCustomerCount(): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/customer/count`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Gagal mengambil data Customer");
    const data = await res.json();
    return data.count;
  } catch (error) {
    console.error("fetchUserCount error:", error);
    return null;
  }
}

// API Count Barang (tanpa autentikasi)
export async function fetchBarangCount(): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/barang/count`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Gagal mengambil data Barang");
    const data = await res.json();
    return data.count;
  } catch (error) {
    console.error("fetchUserCount error:", error);
    return null;
  }
}

// API Count Order (tanpa autentikasi)
export async function fetchOrderCount(): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/order/count`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Gagal mengambil data Order");
    const data = await res.json();
    return data.count;
  } catch (error) {
    console.error("fetchUserCount error:", error);
    return null;
  }
}

//api user
export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api customer
export async function fetchCustomers() {
  const res = await fetch(`${BASE_URL}/customer`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createCustomer(data: {
  customer_name: string;
  alamat: string;
  no_hp: string;
}) {
  const res = await fetch(`${BASE_URL}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",

      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    const e = new Error("Gagal update");
    (e as any).response = {
      status: res.status,
      json: async () => error,
    };
    throw e;
  }
  return res.json();
}

export async function updateCustomer(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    const e = new Error("Gagal update");
    (e as any).response = {
      status: res.status,
      json: async () => error,
    };
    throw e;
  }

  return res.json();
}

export async function deleteCustomer(id: number) {
  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api barang
export async function fetchBarang() {
  const res = await fetch(`${BASE_URL}/barang`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createBarang(data: {
  nama_barang: string;
  jumlah: number;
  harga: number;
}) {
  const res = await fetch(`${BASE_URL}/barang`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBarang(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/barang/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteBarang(id: number) {
  const res = await fetch(`${BASE_URL}/barang/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api Stock
export async function fetchStock() {
  const res = await fetch(`${BASE_URL}/stock`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createStock(data: { id_barang: string; limit: number }) {
  const res = await fetch(`${BASE_URL}/stock`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateStock(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/stock/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}

export async function deleteStock(id: number) {
  const res = await fetch(`${BASE_URL}/stock/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

//api Order
export async function fetchOrder() {
  const res = await fetch(`${BASE_URL}/order`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createOrder(data: {
  customer_id: string;
  id_barang: string;
  order_date: Date;
  jumlah_barang: number;
  total: number;
}) {
  const res = await fetch(`${BASE_URL}/order`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const e = new Error(errorData.message || "Gagal membuat order");
    (e as any).message = errorData.message;
    throw e;
  }

  return res.json();
}

export async function updateOrder(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/order/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const e = new Error(errorData.message || "Gagal update order");
    throw e;
  }
}

export async function deleteOrder(id: number) {
  const res = await fetch(`${BASE_URL}/order/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
