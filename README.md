# PC Shop - Website Thương Mại Điện Tử (Đồ án Môn Học)

Đây là mã nguồn đồ án môn học "Lập trình Web" (Đề tài số 3: Xây dựng website bán hàng). Dự án "PC Shop" chuyên cung cấp các thiết bị, linh kiện máy tính và gaming gear. Hệ thống được chia làm 2 phần: Giao diện Khách hàng (Client) và Giao diện Quản trị viên (Admin Dashboard), được đóng gói và triển khai hoàn toàn bằng Docker.

## Công nghệ sử dụng

- Frontend: ReactJS, Vite, Tailwind CSS, Lucide React.
- Backend: Node.js, ExpressJS, Nodemailer (Gửi email).
- Database: Microsoft SQL Server.
- DevOps: Docker & Docker Compose.

## Hướng dẫn cài đặt và chạy dự án

Để chạy dự án này từ mã nguồn clone trên GitHub về, bạn vui lòng thực hiện lần lượt các bước dưới đây.

### Bước 1: Cấu hình Email để gửi mã Quên mật khẩu

Hệ thống có chức năng gửi email xác nhận khi người dùng quên mật khẩu. Để chức năng này hoạt động, bạn cần dùng một tài khoản Gmail thật để làm máy chủ gửi thư:

1. Truy cập https://myaccount.google.com/security bằng tài khoản Gmail của bạn và tiến hành Bật xác thực 2 bước.
2. Sau khi bật thành công, truy cập https://myaccount.google.com/apppasswords.
3. Tạo 1 ứng dụng mới với tên là "PCShop". Hệ thống sẽ cấp cho bạn một đoạn mật khẩu ứng dụng (gồm 16 chữ cái). Hãy copy mật khẩu này.

### Bước 2: Thiết lập biến môi trường (.env)

1. Di chuyển vào thư mục `backend` của dự án.
2. Copy file `.env.example` và đổi tên thành `.env`.
3. Mở file `.env` lên và chỉ thay đổi 2 trường sau:
   - `GMAIL_USER`: Điền địa chỉ email bạn dùng ở Bước 1.
   - `GMAIL_APP_PASSWORD`: Điền mật khẩu ứng dụng (16 chữ cái viết liền) bạn vừa copy ở Bước 1.
4. Lưu ý: Tất cả các trường khác trong file `.env` giữ nguyên không thay đổi.

### Bước 3: Nạp cơ sở dữ liệu bằng SSMS

1. Mở phần mềm SQL Server Management Studio (SSMS) trên máy tính của bạn.
2. Tại bảng kết nối, chuyển sang phần "Connection String" (Chuỗi kết nối) và nhập chính xác đoạn mã dưới đây:

```text
Data Source=127.0.0.1,1434;Persist Security Info=False;User ID=sa;Password=PCShop@Dev123;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=30
```

3. Nhấn Connect.
4. Sau khi kết nối thành công, bạn mở file `database.sql` (nằm trong thư mục backend) vào trong SSMS.
5. Chạy (Execute) toàn bộ file sql đó để hệ thống tự động tạo bảng và nhập dữ liệu.

### Bước 4: Build và Khởi động hệ thống bằng Docker

1. Mở Terminal (Command Prompt / PowerShell) tại thư mục gốc của dự án (nơi chứa file `docker-compose.yml`).
2. Chạy lệnh sau để khởi tạo toàn bộ hệ thống:

```bash
docker-compose up --build -d
```

3. Chờ đợi khoảng 1-2 phút để Docker tải các phần mềm cần thiết và khởi động máy chủ.

### Bước 5: Truy cập ứng dụng

Hệ thống đã hoàn toàn sẵn sàng. Bạn có thể truy cập vào trang web thông qua trình duyệt:

- Link trang chủ: http://localhost:5173/

---

## Tài khoản Test mẫu

1. Khách hàng (User)

- User: khachhang1 | Pass: 123456

2. Quản trị viên (Admin)

- User: admin1 | Pass: 123456
