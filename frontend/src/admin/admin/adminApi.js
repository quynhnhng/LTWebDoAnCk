const API_URL = "http://localhost:5000";

// Lay thong tin admin dang dang nhap tu localStorage
// (duoc luu boi AdminLogin trong AdminApp.jsx voi key "pcshop_admin")
function getAdminHeaders() {
  try {
    const admin = JSON.parse(localStorage.getItem("pcshop_admin"));
    if (admin?.Username) {
      return { "x-admin-username": admin.Username };
    }
  } catch {
    // bo qua loi parse
  }
  return {};
}

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { ...getAdminHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Co loi xay ra");
  return data;
}

export async function apiSend(path, method, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAdminHeaders(),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Co loi xay ra");
  return data;
}

export const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + "đ";
