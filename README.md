# PC Shop E-Commerce Website

Dự án website thương mại điện tử bán máy tính và linh kiện PC. Được phát triển theo mô hình Fullstack với ReactJS và Node.js kết hợp SQL Server.

## Công nghệ sử dụng

- **Frontend:** ReactJS, Tailwind CSS, Vite, React Router DOM.
- **Backend:** Node.js, Express.js.
- **Cơ sở dữ liệu:** Microsoft SQL Server (SSMS).

## Hướng dẫn cài đặt và chạy dự án (Local)

Để chạy dự án này trên máy tính của bạn, vui lòng làm theo các bước sau:

### Bước 1: Clone dự án và cài đặt thư viện

```bash
# Clone repository này về máy
git clone <link_github_cua_ban>

# Cài đặt thư viện cho Frontend
cd frontend
npm install

# Mở một Terminal khác, cài đặt thư viện cho Backend
cd backend
npm install
```

### Bước 2: Khởi tạo Cơ sở dữ liệu (Database)

1. Mở phần mềm **SQL Server Management Studio (SSMS)**.
2. Mở file `database.sql` (nằm trong dự án) trên SSMS.
3. Nhấn **Execute (F5)** để chạy toàn bộ mã script. Hệ thống sẽ tự động tạo Database `PCShopDB`, các bảng cần thiết và chèn sẵn 14 sản phẩm mẫu.

### Bước 3: Cấu hình biến môi trường (Backend)

1. Vào thư mục `backend`, tìm file `.env.example`.
2. Copy nội dung file đó và tạo một file mới tên là `.env` (ngang hàng với `.env.example`).
3. Mở file `.env` lên và điền mật khẩu đăng nhập SQL Server của máy bạn vào biến `DB_PASSWORD`.

### Bước 4: Khởi động Server

Bạn cần chạy song song cả Frontend và Backend ở 2 cửa sổ Terminal khác nhau.

**Chạy Backend:**

```bash
cd backend
npm run dev
```

**Chạy Frontend:**

```bash
cd frontend
npm run dev
```
