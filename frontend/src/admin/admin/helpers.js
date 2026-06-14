// Cac gia tri rong dung de khoi tao form
export const emptyProduct = {
  CategoryId: "",
  Title: "",
  Price: "",
  PromoPrice: "",
  Description: "",
  ImageUrl: "",
};

export const emptyAdmin = {
  Username: "",
  Password: "",
  FullName: "",
  Email: "",
  Phone: "",
  Address: "",
  Status: "active",
};

// Danh sach trang thai don hang
export const orderStatuses = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

// Lay thong tin admin dang dang nhap tu localStorage
export function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem("pcshop_admin"));
  } catch {
    return null;
  }
}
