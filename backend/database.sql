
-- Database hoàn chỉnh
-- ============================================================

CREATE DATABASE PCShopDB;
GO

USE PCShopDB;
GO

-- ============================================================
-- 1. TẠO CÁC BẢNG
-- ============================================================

-- Bảng Phân quyền (Roles)
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(50) NOT NULL
);
GO

-- Bảng Người dùng (Users)
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Address NVARCHAR(255),
    RoleId INT FOREIGN KEY REFERENCES Roles(Id),
    Status VARCHAR(20) DEFAULT 'active' -- active, locked, banned
);
GO

-- Bảng Danh mục (Categories)
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL
);
GO

-- Bảng Sản phẩm (Products)
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CategoryId INT FOREIGN KEY REFERENCES Categories(Id),
    Title NVARCHAR(255) NOT NULL,
    Price INT NOT NULL,
    PromoPrice INT NULL,
    Description NVARCHAR(MAX),
    ImageUrl VARCHAR(MAX)
);
GO

-- Bảng Đơn hàng (Orders)
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    CreatedAt DATETIME DEFAULT GETDATE(),
    ReceiverName NVARCHAR(100) NOT NULL,
    ReceiverPhone VARCHAR(20) NOT NULL,
    ShippingAddress NVARCHAR(255) NOT NULL,
    TotalPrice INT NOT NULL,
    Status NVARCHAR(50) DEFAULT N'Chờ xác nhận'
);
GO

-- Bảng Chi tiết Đơn hàng (OrderItems)
CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT FOREIGN KEY REFERENCES Orders(Id),
    ProductId INT FOREIGN KEY REFERENCES Products(Id),
    Quantity INT NOT NULL,
    Price INT NOT NULL
);
GO

-- Bảng thông báo
CREATE TABLE Notifications (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    UserId     INT NULL FOREIGN KEY REFERENCES Users(Id),  -- NULL = thông báo cho tất cả
    Title      NVARCHAR(255) NOT NULL,
    Message    NVARCHAR(MAX) NOT NULL,
    Type       VARCHAR(50) DEFAULT 'info',   -- info | success | warning | error
    IsRead     BIT DEFAULT 0,
    CreatedAt  DATETIME DEFAULT GETDATE()
);
GO

-- ============================================================
-- 2. DỮ LIỆU MẪU: Roles, Users, Categories
-- ============================================================

INSERT INTO Roles (Name)
VALUES ('admin'), ('user');
GO

INSERT INTO Users (Username, Password, FullName, Email, Phone, Address, RoleId, Status)
VALUES
('admin1', '123456', N'Quản trị viên', 'admin@pcshop.com', '0999999999', N'Hà Nội', 1, 'active'),
('khachhang1', '123456', N'Nguyễn Văn A', 'nva@gmail.com', '0888888888', N'TP. Hồ Chí Minh', 2, 'active');

GO

-- Thêm cột ResetToken (lưu token đặt lại mật khẩu)
ALTER TABLE Users
ADD ResetToken VARCHAR(128) NULL;
GO

-- Thêm cột ResetExpires (lưu thời gian hết hạn của token)
ALTER TABLE Users
ADD ResetExpires DATETIME NULL;
GO


INSERT INTO Categories (Name)
VALUES
(N'PC'),                        -- Id = 1
(N'Laptop'),                    -- Id = 2
(N'Laptop Gaming'),             -- Id = 3
(N'Main - CPU - VGA'),          -- Id = 4
(N'Case - Nguồn - Tản nhiệt'),  -- Id = 5
(N'Ổ cứng - RAM'),              -- Id = 6
(N'Tai nghe'),                  -- Id = 7
(N'Bàn phím'),                  -- Id = 8
(N'Chuột');                     -- Id = 9
GO

-- ============================================================
-- 3. SẢN PHẨM - CategoryId = 1: PC
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(1, N'PC Intel i7-14700F/ VGA RTX 5070', 54990000, NULL, N'Cấu hình chi tiết đang cập nhật...', 'https://cdn.hstatic.net/products/200000722513/post-01_f9eb7cb1fce5469ebc684c1cbf943f87_grande.jpg'),
(1, N'PC Intel Core Ultra 7 265F/ VGA RTX 5070', 57990000, NULL, N'Cấu hình chi tiết đang cập nhật...', 'https://cdn.hstatic.net/products/200000722513/post-01_53342b42ceed47a2a10a823de706d545_grande.jpg'),
(1, N'PC Intel Core Ultra 7 265F/ VGA RTX 5070Ti', 66990000, NULL, N'Cấu hình chi tiết đang cập nhật...', 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__34cded95d1b546368161e3273ab0f50e_master.jpg'),
(1, N'PC Intel Core Ultra 7 265F/ VGA RTX 5080', 76590000, 75000000, N'Cấu hình chi tiết đang cập nhật...', 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__c7867c9dc9d94d72a6c18c61e398cee3_grande.jpg'),
(1, N'PC Intel i7-14700F/ VGA RTX 5080', 81490000, NULL, N'Cấu hình chi tiết đang cập nhật...', 'https://cdn.hstatic.net/products/200000722513/web__61_of_86__aea66174cf754130b266656c48778519_grande.jpg'),
(1, N'PC AMD R7-9800x3D/ VGA RTX 5080 (Powered by MSI)', 88880000, NULL, N'Cấu hình chi tiết đang cập nhật...', 'https://product.hstatic.net/200000722513/product/pc_gvn__i7-_4070_-_3_0ea0d3f21b41464991ac7134a04ac5e4_grande.png'),
(1, N'PC GVN Intel i5-14400F/ VGA RTX 5060', 18990000, NULL, N'CPU Intel Core i5-14400F, VGA RTX 5060, RAM 16GB DDR4, SSD 512GB NVMe. Chiến game 1080p mượt mà.', 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__34cded95d1b546368161e3273ab0f50e_master.jpg'),
(1, N'PC GVN Intel i5-14400F/ VGA RTX 5060 Ti', 23490000, 22990000, N'CPU Intel Core i5-14400F, VGA RTX 5060 Ti 16GB, RAM 16GB DDR4, SSD 512GB. Gaming 1080p/2K đỉnh cao.', 'https://cdn.hstatic.net/products/200000722513/post-01_f9eb7cb1fce5469ebc684c1cbf943f87_grande.jpg'),
(1, N'PC GVN AMD R5-7600/ VGA RTX 4060', 19890000, 18990000, N'CPU AMD Ryzen 5 7600, VGA RTX 4060 8GB, RAM 16GB DDR5, SSD 512GB, Main B650. Gaming tầm trung xuất sắc.', 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__c7867c9dc9d94d72a6c18c61e398cee3_grande.jpg'),
(1, N'PC GVN Intel i5-14600KF/ VGA RTX 4060', 21490000, NULL, N'CPU Intel Core i5-14600KF, VGA RTX 4060 8GB, RAM 16GB DDR4, SSD 512GB. Hiệu năng vượt trội tầm giá.', 'https://cdn.hstatic.net/products/200000722513/post-01_53342b42ceed47a2a10a823de706d545_grande.jpg'),
(1, N'PC GVN Intel i5-14600KF/ VGA RTX 4070', 29990000, 28990000, N'CPU Intel Core i5-14600KF, VGA RTX 4070 12GB, RAM 32GB DDR5, SSD 1TB. Gaming 2K siêu mượt.', 'https://cdn.hstatic.net/products/200000722513/web__61_of_86__aea66174cf754130b266656c48778519_grande.jpg'),
(1, N'PC GVN Intel i7-14700F/ VGA RTX 4060', 24990000, NULL, N'CPU Intel Core i7-14700F 20 nhân, VGA RTX 4060 8GB, RAM 32GB DDR4, SSD 1TB. Đa nhiệm và gaming.', 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__34cded95d1b546368161e3273ab0f50e_master.jpg'),
(1, N'PC GVN Homework Intel i5-12400 (Văn phòng)', 12490000, 11990000, N'CPU Intel Core i5-12400, RAM 8GB DDR4, SSD 256GB, tích hợp Intel UHD 730. PC văn phòng giá rẻ đáng mua.', 'https://cdn.hstatic.net/products/200000722513/post-01_53342b42ceed47a2a10a823de706d545_grande.jpg'),
(1, N'PC GVN Intel i3-10100F/ VGA GTX 1650 (Entry Gaming)', 9990000, NULL, N'CPU Intel Core i3-10100F, VGA GTX 1650 4GB, RAM 8GB DDR4, SSD 256GB. Entry-level gaming giá hợp lý.', 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__c7867c9dc9d94d72a6c18c61e398cee3_grande.jpg');
GO

-- ============================================================
-- 4. SẢN PHẨM - CategoryId = 2: Laptop
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(2, N'Laptop Dell Inspiron 15 3530 i5-1334U/ 8GB/ 512GB/ 15.6" FHD', 13990000, 12990000, N'Intel Core i5-1334U, 8GB RAM, SSD 512GB, màn 15.6 inch Full HD, Windows 11. Laptop văn phòng phổ thông đáng mua.', 'https://cdn.hstatic.net/products/200000722513/ava_0a30ce7dc91d4bf9bc058f46086f636d_master.png'),
(2, N'Laptop Lenovo IdeaPad Slim 3 14IRH10 Core i5-13420H/ 8GB/ 512GB', 12990000, NULL, N'Intel Core i5-13420H, 8GB RAM, 512GB SSD, màn 14 inch FHD. Mỏng nhẹ phù hợp học sinh sinh viên.', 'https://product.hstatic.net/200000722513/product/ideapad_slim_3_14irh10_ct2_08_7408b9ead5d149d0a406c036154727d4_master.png'),
(2, N'Laptop ASUS VivoBook 15 X1504ZA i5-1235U/ 8GB/ 512GB', 13490000, 12490000, N'Intel Core i5-1235U, 8GB RAM, SSD 512GB, màn 15.6 FHD 60Hz. Thiết kế đẹp, hiệu năng tốt tầm giá.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_12__8_152.png'),
(2, N'Laptop HP 15s-fq5108TU i5-1235U/ 8GB/ 256GB', 11990000, NULL, N'Intel Core i5-1235U, 8GB RAM, 256GB SSD, 15.6 FHD IPS, pin 41Wh. Laptop HP giá tốt cho văn phòng.', 'https://product.hstatic.net/200000722513/product/khung-laptop-23_b898f38424a44201bf2df947e637c74e_master.png'),
(2, N'Laptop Lenovo ThinkBook 14 G6 IRL i7-1355U/ 16GB/ 512GB', 19990000, 18490000, N'Intel Core i7-1355U, 16GB RAM, SSD 512GB, vỏ kim loại cao cấp. Laptop doanh nhân hiệu năng mạnh.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ssss_2__1_90.png'),
(2, N'Laptop Dell Vostro 3520 i5-1235U/ 8GB/ 256GB/ 15.6" FHD', 13490000, NULL, N'Intel Core i5-1235U, 8GB RAM, 256GB SSD, 15.6 FHD. Dòng doanh nghiệp bền bỉ giá hợp lý.', 'https://cdn.tgdd.vn/Products/Images/44/324340/dell-vostro-15-3520-i5-i5u165w11gru-2-750x500.jpg'),
(2, N'Laptop ASUS VivoBook 14 X1404ZA i5-1235U/ 16GB/ 512GB', 14990000, 13990000, N'Intel Core i5-1235U, 16GB RAM, 512GB SSD, 14 inch FHD IPS. Hiệu năng đa nhiệm tốt pin bền.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ssss_2_34.png'),
(2, N'Laptop HP EliteBook 840 G10 i5-1335U/ 16GB/ 512GB', 26990000, 25990000, N'Intel Core i5-1335U, 16GB RAM, SSD 512GB, 14 inch FHD IPS, bảo mật vân tay và IR. Doanh nghiệp cao cấp.', 'https://media.vitinhnguyenkim.vn/uploads/product/laptop/HP/HP-ELITEBOOK-840-G10-SILVER.png'),
(2, N'Laptop Lenovo V14 G4 IRU i5-1335U/ 8GB/ 256GB', 10990000, 9990000, N'Intel Core i5-1335U, 8GB RAM, 256GB SSD, 14 inch FHD. Laptop giá rẻ cho nhu cầu cơ bản.', 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/2023_9_11_638300287131464874_lenovo-v14-g3-iap-i5-1235u-5.jpg'),
(2, N'Laptop Dell Inspiron 14 5440 i5-1334U/ 16GB/ 512GB/ OLED', 19990000, NULL, N'Intel Core i5-1334U, 16GB RAM, 512GB SSD, màn OLED 2.8K 120Hz. Hiển thị tuyệt đẹp cho sáng tạo.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_19__4_25_2.png'),
(2, N'Laptop ASUS Zenbook 14 UX3405MA Core Ultra 5 125H/ 16GB/ 512GB', 24990000, 23490000, N'Intel Core Ultra 5 125H, 16GB RAM, 512GB SSD, OLED 2.8K 120Hz, trọng lượng 1.2kg. Siêu mỏng nhẹ cao cấp.', 'https://vn.store.asus.com/media/catalog/product/cache/2a6b0744b87cbe1990f7a65c1fd3659e/z/e/zenbook_14_oled_ux3405ma_ponder_blue_product_photo_05.jpg'),
(2, N'Laptop HP OmniBook X 14 Snapdragon X Elite/ 16GB/ 512GB', 28990000, NULL, N'Snapdragon X Elite X1E-78-100, 16GB RAM, 512GB SSD, màn 2.2K 60Hz, pin 48h. Copilot+ AI PC.', 'https://www.laptopvip.vn/images/ab__webp/thumbnails/715/585/detailed/36/AndazNA-Silver-Consumer-1659x1246-www.laptopvip.vn-1717228860.png.webp');
GO

-- ============================================================
-- 5. SẢN PHẨM - CategoryId = 3: Laptop Gaming
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(3, N'Laptop Gaming MSI Thin 15 B13UC i7-13620H/ RTX 3050/ 8GB/ 512GB', 16990000, 15490000, N'Intel Core i7-13620H, RTX 3050 4GB, 8GB RAM, 512GB SSD, 15.6 FHD 144Hz. Mỏng nhẹ gaming tầm trung.', 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_15_b13u_abbb0dcf12.png'),
(3, N'Laptop Gaming Lenovo LOQ 15IAX9E i5-12450HX/ RTX 4050/ 16GB/ 512GB', 18990000, NULL, N'Intel Core i5-12450HX, RTX 4050 6GB, 16GB RAM, 512GB SSD, 15.6 FHD 144Hz. Gaming sinh viên đáng mua.', 'https://cdn.hstatic.net/products/200000722513/loq_essential_15irx11_ct1_01_4961c63b8ebb481baa44fe9bf69f1db7_master.png'),
(3, N'Laptop Gaming ASUS TUF A15 FA507NV R7-7735HS/ RTX 4060/ 16GB/ 512GB', 22990000, 21490000, N'AMD Ryzen 7 7735HS, RTX 4060 8GB, 16GB RAM, SSD 512GB, 15.6 FHD 144Hz. Tản nhiệt TUF siêu bền.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_14__9_136.png'),
(3, N'Laptop Gaming Lenovo Legion 5 16IRX9 i7-14650HX/ RTX 4060/ 16GB/ 1TB', 27990000, NULL, N'Intel Core i7-14650HX, RTX 4060 8GB, 16GB RAM, 1TB SSD, 16 inch WUXGA 165Hz. Legion bản nâng cấp.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_3__5_17.png'),
(3, N'Laptop Gaming ASUS ROG Strix G16 G614JVR i7-14650HX/ RTX 4060/ 16GB/ 512GB', 29990000, 27990000, N'Intel Core i7-14650HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, 16 inch QHD+ 240Hz. ROG đẳng cấp gaming.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_1__7_61.png'),
(3, N'Laptop Gaming MSI Katana 15 B13VGK i7-13620H/ RTX 4070/ 16GB/ 1TB', 31990000, NULL, N'Intel Core i7-13620H, RTX 4070 8GB, 16GB RAM, 1TB SSD, 15.6 FHD 144Hz. MSI cấu hình mạnh tầm trung+.', 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_katana_15_b13v_1_9310c95515.png'),
(3, N'Laptop Gaming Lenovo Legion 5 Pro 16IRX9 i9-14900HX/ RTX 4070/ 32GB/ 1TB', 41990000, 39990000, N'Intel Core i9-14900HX, RTX 4070 8GB, 32GB RAM, 1TB SSD, 16 inch 2K 165Hz. Legion Pro hiệu năng đỉnh.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_2__6_18.png'),
(3, N'Laptop Gaming ASUS ROG Zephyrus G14 GA403UV R9-8945HS/ RTX 4060/ 16GB/ 1TB', 34990000, NULL, N'AMD Ryzen 9 8945HS, RTX 4060 8GB, 16GB RAM, 1TB SSD, 14 inch WQXGA 165Hz, 1.5kg. Nhỏ gọn nhưng mạnh.', 'https://laptopaz.vn/media/product/3587_asus_rog_zephyrus_g14_ga403uv.jpg'),
(3, N'Laptop Gaming ASUS ROG Strix Scar 16 G634JYR i9-14900HX/ RTX 4090/ 32GB/ 1TB', 79990000, 74990000, N'Intel Core i9-14900HX, RTX 4090 16GB, 32GB RAM, 1TB SSD, 16 inch QHD+ 240Hz. Ông hoàng laptop gaming.', 'https://assets.vinhpici.vn/laptop-asus-rog-strix-scar-16-2024-g634-i9-14900hx-rtx-4090-ram-32gb-ssd-1tb-16-2-5k-miniled-240hz.webp'),
(3, N'Laptop Gaming Acer Nitro Lite 16 NL16 71G i5-13420H/ RTX 3050/ 8GB/ 512GB', 15490000, 14490000, N'Intel Core i5-13420H, RTX 3050 6GB, 8GB RAM, 512GB SSD, 16 inch WUXGA 60Hz. Entry gaming giá tốt.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_5__9_148.png'),
(3, N'Laptop Gaming Dell Alienware M15 R6 i7-11800H/ RTX 3070/ 16GB/ 1TB', 49990000, 46990000, N'Intel Core i7-11800H, RTX 3070 8GB, 16GB RAM, 1TB SSD, 15.6 FHD 165Hz, tản nhiệt Cryo-Tech. Huyền thoại Alienware.', 'https://www.laptopvip.vn/images/ab__webp/thumbnails/715/585/detailed/30/avatar-sijs-b2-www.laptopvip.vn-1676706278.jpg.webp');
GO

-- ============================================================
-- 6. SẢN PHẨM - CategoryId = 4: Main - CPU - VGA
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(4, N'CPU Intel Core i5-14400F (LGA1700, 10 nhân, 4.7GHz)', 3890000, 3690000, N'10 nhân 16 luồng, xung tối đa 4.7GHz, TDP 65W. CPU tầm trung xuất sắc cho gaming và đa nhiệm.', 'https://product.hstatic.net/200000722513/product/n22561-001-i5f-_univ_2e1135c9919d46ce97e95d2e19cb74f3_master.png'),
(4, N'CPU Intel Core i7-14700F (LGA1700, 20 nhân, 5.3GHz)', 7690000, 7490000, N'20 nhân 28 luồng, xung tối đa 5.3GHz. Hiệu năng đa nhiệm cực mạnh cho cả gaming lẫn sáng tạo.', 'https://product.hstatic.net/200000722513/product/n22459-001-rpl-i7f-fhs-dva-bc-univ_png_21fc4faaaca646ae9804e8bcc729ae57_master.png'),
(4, N'CPU AMD Ryzen 5 7600X (AM5, 6 nhân, 5.3GHz)', 4290000, NULL, N'6 nhân 12 luồng, xung tối đa 5.3GHz, hỗ trợ DDR5. Hiệu năng gaming 1080p đỉnh phân khúc tầm trung.', 'https://product.hstatic.net/200000722513/product/ryzen_5_-_1_be51e69b02cf4ed78a758a6337e56a27_ae6fad038dff4fa985e2e4b86abc8d85_master.jpg'),
(4, N'CPU AMD Ryzen 7 9800X3D (AM5, 8 nhân, 5.2GHz, 3D V-Cache)', 12990000, NULL, N'8 nhân 16 luồng, 3D V-Cache 96MB, xung tối đa 5.2GHz. CPU gaming số 1 thế giới hiện tại.', 'https://cdn.hstatic.net/products/200000722513/bo-vi-xu-ly-amd-ryzen-7-9800x3d-tray-1_691bda07cba94f7fa8b50f9d594b554b_master.png'),
(4, N'Mainboard ASUS TUF GAMING B760M-PLUS WIFI DDR4', 3290000, 3090000, N'Chipset B760, LGA1700, DDR4, PCIe 5.0, WiFi 6, hỗ trợ Intel Gen 12/13/14. Bo mạch chủ bền đẹp.', 'https://product.hstatic.net/200000722513/product/-asus-tuf-gaming-b760m-plus-wifi-d4-1_d9c072631509461c8fd880c9e48b9344_3547fd3988ef4d41beb979299a72fad9_master.png'),
(4, N'Mainboard ASUS TUF GAMING Z890-PLUS WIFI DDR5', 6990000, NULL, N'Chipset Z890, LGA1851, DDR5, PCIe 5.0, WiFi 7, hỗ trợ Intel Core Ultra Gen2. Main cao cấp mới nhất.', 'https://product.hstatic.net/200000722513/product/tuf-gaming-z890--plus-wifi-01_fbdb878d37804cb5977d7e89e203023d_master.jpg'),
(4, N'Mainboard ASUS TUF GAMING B650M-E WIFI DDR5', 3890000, 3690000, N'Chipset B650, AM5, DDR5, WiFi 6, hỗ trợ AMD Ryzen 7000/9000 Series. Nền tảng AMD tầm trung.', 'https://product.hstatic.net/200000722513/product/image__7__8575cbe67ed045d592b99c79d539e222_master.png'),
(4, N'VGA MSI GeForce RTX 4060 VENTUS 2X BLACK OC 8GB', 7990000, 7490000, N'RTX 4060 8GB GDDR6, 128-bit, DLSS 3, hỗ trợ 4K output. Card tầm trung gaming 1080p đỉnh cao.', 'https://product.hstatic.net/200000722513/product/rtx_4060_ventus_2x_black_8g_oc_c34ea8c824fb4afb9f1241cec761e799_master.png'),
(4, N'VGA MSI GeForce RTX 4070 VENTUS 3X OC 12GB', 13490000, 12990000, N'RTX 4070 12GB GDDR6X, 192-bit, DLSS 3, Ada Lovelace. Gaming 2K cực mượt, hiệu năng/điện tốt nhất.', 'https://storage-asset.msi.com/global/picture/product/product_1681290408841efcdbaa180e44982f9a29181171cb.webp'),
(4, N'VGA MSI GeForce RTX 5070 12G VENTUS 3X OC', 19990000, NULL, N'RTX 5070 12GB GDDR7, 192-bit, DLSS 4, Blackwell architecture. Thế hệ GPU mới nhất của NVIDIA 2025.', 'https://product.hstatic.net/200000420363/product/_new_-anh-sp-web_73adc39722d6473d9b9c481232fc7034_grande.png'),
(4, N'VGA ASUS PRIME Radeon RX 7600 8GB OC', 5690000, 5490000, N'RX 7600 8GB GDDR6, 128-bit, FSR 3, RDNA3. Lựa chọn AMD tầm trung giá hợp lý cho 1080p.', 'https://product.hstatic.net/1000333506/product/asus-dual-radeon_-rx-7600-oc-edition-8gb-gddr6-product-1-510x510_d2e30712ef614fe6887a0a91acbeb393_grande.png'),
(4, N'VGA ASUS PRIME GeForce RTX 4060 Ti 8GB', 10490000, 9990000, N'RTX 4060 Ti 8GB GDDR6, 128-bit, DLSS 3. Nâng cấp lý tưởng từ RTX 30 series cho gaming 1080p/1440p.', 'https://product.hstatic.net/200000722513/product/fwebp__7__0758534121424881bf4d9f9b5fec68c1_master.png');
GO

-- ============================================================
-- 7. SẢN PHẨM - CategoryId = 5: Case - Nguồn - Tản nhiệt
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(5, N'Case Corsair 4000D Airflow TG Mid-Tower ATX', 2290000, 1990000, N'Case ATX mid-tower, kính cường lực, 2 fan 120mm tích hợp, luồng khí tốt. Thiết kế tối giản sang trọng.', 'https://product.hstatic.net/200000722513/product/cc-9011291-ww_01__1__0a6064cc137446a6be8f25cc4a2645fd_master.png'),
(5, N'Case Lian Li LANCOOL 216 RGB Mid-Tower ATX', 2690000, NULL, N'Case ATX mid-tower, 2 fan ARGB 160mm tích hợp, tấm kính cường lực 4mm, quản lý cáp tốt.', 'https://anphat.com.vn/media/product/45216_7.jpg'),
(5, N'Case NZXT H5 Flow RGB Mid-Tower ATX', 1990000, NULL, N'Case ATX compact, 2 fan ARGB 120mm, mặt trước mesh thoáng khí. Thiết kế hiện đại đơn giản.', 'https://www.tncstore.vn/media/product/250-11524-vo-case-nzxt-h5-flow-rgb-all-black-cc-h52fb-r1--1-.jpg'),
(5, N'Case Fractal Design Meshify 2 Compact Solid ATX', 2190000, NULL, N'Case ATX compact, mặt trước mesh thoáng khí, 2 fan 140mm tích hợp, quản lý cáp tốt.', 'https://pcngon.vn/wp-content/uploads/2025/04/Vo-case-may-tinh-Mini-ITX-Fractal-Meshify-2-1.jpg'),
(5, N'Nguồn Corsair RM850x 850W 80 Plus Gold Fully Modular', 3290000, 2990000, N'850W, 80 Plus Gold, fully modular, quạt Zero RPM, bảo hành 10 năm. Nguồn cao cấp đáng tin cậy.', 'https://product.hstatic.net/200000722513/product/9325_67b2dd4e5b73932fd2ee660f1435fbec_3a65f5f238474ef2877b8032b5940dfd_cc925440dd3e4b14aeee50d66a52c670_master.jpg'),
(5, N'Nguồn ASUS ROG LOKI SFX-L 850W Platinum Fully Modular', 4290000, NULL, N'850W, 80 Plus Platinum, SFX-L, fully modular, quạt 92mm. Nguồn nhỏ gọn cho build mini-ITX cao cấp.', 'https://cdn-transformations.hacom.vn/insecure/f:webp/q:85/rt:fit/w:1080/aHR0cHM6Ly9oYW5vaWNvbXB1dGVyY2RuLmNvbS9tZWRpYS9wcm9kdWN0LzczMjE2X2xva2lfc2Z4X2xfODUwd19fNF8uanBn.webp'),
(5, N'Nguồn Seasonic Focus GX-750 750W 80 Plus Gold', 2590000, 2390000, N'750W, 80 Plus Gold, semi-modular, quạt Fluid Dynamic Bearing yên tĩnh. Lựa chọn phổ biến tầm trung.', 'https://product.hstatic.net/1000369156/product/18_8daaa3b892df42d3b7ee287a7aef528a_grande.png'),
(5, N'Tản nhiệt nước AIO Corsair iCUE H100i RGB ELITE 240mm', 2990000, 2690000, N'AIO 240mm, 2 fan ARGB 120mm, đầu bơm RGB, tương thích LGA1700/AM5. Làm mát mạnh và đẹp.', 'https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tan-nhiet-nuoc-aio-corsair-icue-h100i-rgb-elite-cw-9060078-ww-2.jpg?v=1743638850323'),
(5, N'Tản nhiệt nước AIO ASUS ROG RYUJIN III 360 ARGB', 5490000, 4990000, N'AIO 360mm, 3 fan ROG ARGB 120mm, màn LCD 60fps trên đầu bơm, tương thích AM5/LGA1700.', 'https://anphat.com.vn/media/product/45491_1.jpg');
GO

-- ============================================================
-- 8. SẢN PHẨM - CategoryId = 6: Ổ cứng - RAM
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(6, N'SSD Samsung 870 EVO 500GB SATA III 2.5"', 1190000, 990000, N'Dung lượng 500GB, chuẩn SATA III, tốc độ đọc 560MB/s, ghi 530MB/s. SSD phổ thông bán chạy nhất.', 'https://anphat.com.vn/media/product/36410_1611137200_247_o_cung_ssd_500gb_samsung_870_evo_mz_77e500bw_2.jpg'),
(6, N'SSD Samsung 980 PRO 1TB NVMe PCIe 4.0 M.2', 2490000, 2190000, N'1TB, PCIe Gen 4.0 x4, tốc độ đọc 7000MB/s, ghi 5000MB/s. SSD M.2 cao cấp cho PC và PS5.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/-/o-cung-ssd-samsung-980-pro-pcie-nvme-4-0x4-1tb_3_.png'),
(6, N'SSD Kingston NV3 1TB NVMe PCIe 4.0 M.2', 1290000, 1190000, N'1TB, PCIe Gen 4.0, tốc độ đọc 6000MB/s. SSD tầm trung tốc độ cao, giá tốt nhất phân khúc.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__2_129.png'),
(6, N'SSD Samsung 990 PRO 2TB NVMe PCIe 4.0 M.2', 4290000, 3990000, N'2TB, PCIe Gen 4.0, đọc 7450MB/s, ghi 6900MB/s. SSD dung lượng khủng tốc độ đỉnh cao.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_10__5_247.png'),
(6, N'HDD Western Digital Blue 2TB 3.5" 7200RPM', 1490000, NULL, N'2TB, SATA III, 7200RPM, cache 256MB. Ổ cứng lưu trữ dung lượng lớn giá thành phải chăng.', 'https://western.com.vn/media/product/417_o_cung_hdd_wd_blue_2tb_wd20ezbx_vcom.jpg'),
(6, N'RAM Kingston Fury Beast RGB 16GB (1x16GB) DDR5 5600MHz', 1690000, 1490000, N'16GB DDR5-5600, CL36, LED RGB đẹp. RAM DDR5 phổ thông tốt nhất cho nền tảng Intel/AMD mới.', 'https://pcmarket.vn/media/product/10653_ram_desktop_kingston_fury_beast_rgb_32gb_2x16gb_ddr4_1.jpg'),
(6, N'RAM Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 2990000, 2790000, N'32GB DDR5-6000, CL30, Intel XMP 3.0, AMD EXPO. RAM DDR5 cao cấp cho hệ thống hiệu năng đỉnh.', 'https://product.hstatic.net/200000420363/product/6_255f748f9fd447ba929fdaf8411d7dd9_grande.jpg'),
(6, N'RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz', 3490000, NULL, N'32GB DDR5-6400, CL32, LED RGB, Intel XMP 3.0. RAM DDR5 hàng đầu cho overclock và gaming.', 'https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-pc-g-skill-trident-z5-rgb-32gb-5600mhz-ddr5-16gbx2-f5-5600u3636c16gx2-tz5rk-b21b41ed-0aa2-4420-9b9b-6b71cc3f5aba-6a2a846d-a863-4a50-a124-33f241d2fd45-1b201605-9865-4dda-a765-9fca69be4cff.png?v=1758522525623');
GO

-- ============================================================
-- 9. SẢN PHẨM - CategoryId = 7: Tai nghe
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(7, N'Tai nghe gaming Akko Verge S9 Ultra White Không dây', 1090000, 990000, N'Không dây 2.4GHz + Bluetooth, driver 40mm, thời lượng pin 65h, micro lọc tiếng ồn AI.', 'https://akkogear.com.vn/wp-content/uploads/2026/04/15-768x768.png'),
(7, N'Tai nghe Razer Kraken X Black 7.1 Surround', 890000, 790000, N'Có dây 3.5mm, driver 40mm, âm thanh 7.1 Surround ảo, micro cardioid uốn cong, 250g nhẹ bền.', 'https://product.hstatic.net/200000722513/product/earvn-tai-nghe-razer-kraken-x-black-2_335d91e748794846947697af124433bd_8b44a0130db848409d59d5dd0b61239f_master.jpg'),
(7, N'Tai nghe Razer BlackShark V2 X USB 7.1 Surround', 1190000, 990000, N'Có dây USB, driver 50mm TriForce, âm thanh 7.1, chụp tai giả da, chỉ 240g. Chuẩn eSport chuyên nghiệp.', 'https://product.hstatic.net/200000722513/product/vn-tai-nghe-razer-blackshark-v2-photoroom_e7d768a99de7423b9d24382728d710ce_master.png'),
(7, N'Tai nghe Logitech G335 Wired Gaming Headset', 890000, NULL, N'Có dây 3.5mm, driver 40mm, micro flip-to-mute tiện lợi, DTS X 2.0, đệm tai mềm mại, 240g.', 'https://product.hstatic.net/200000837185/product/g355_black_compressed_9b1ed3736cac4881b527ae0f23447f0e_grande.jpg'),
(7, N'Tai nghe ASUS ROG Strix Go USB-C Gaming', 2490000, 2190000, N'USB-C, driver ASUS Essence 40mm, micro AI lọc ồn, tương thích Switch và PS5 và PC, chỉ 262g.', 'https://dlcdnwebimgs.asus.com/gain/0007ACEA-3911-4BC1-A5FC-38E4337D875C/w717/h525/fwebp'),
(7, N'Tai nghe Razer BlackShark V2 Pro 2023 Wireless', 4490000, 3990000, N'Không dây HyperSpeed, driver 50mm TriForce Titanium, âm thanh THX Spatial, micro siêu đơn hướng, pin 70h.', 'https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/tai-nghe-khong-day-razer-blackshark-v2-pro-rz04-04530100-r3m1-4.jpg?v=1775012788733'),
(7, N'Tai nghe Razer BlackShark V3 Pro White Wireless', 7280000, NULL, N'Không dây HyperSpeed và Bluetooth, driver 50mm titanium, micro siêu rõ. Flagship tai nghe Razer 2025.', 'https://cdn.hstatic.net/products/200000722513/blackshark_v3_pro_white__2025__render-01_6f5cba2b52104d4c96cb5c88be8f1017_master.png'),
(7, N'Tai nghe ASUS ROG Delta S Animate USB Gaming', 3290000, 2990000, N'Có dây USB, driver ESS 50mm, âm thanh 7.1 MQA, mặt chụp tai LED Matrix hiển thị hình ảnh động. Độc đáo.', 'https://dlcdnwebimgs.asus.com/gain/459EC147-E757-4C4A-92CE-23EB38B0C81D/w717/h525/fwebp'),
(7, N'Tai nghe Logitech G Pro X 2 LIGHTSPEED Wireless', 5490000, 4990000, N'Không dây LIGHTSPEED, driver 50mm Blue VO!CE, pin 50h. Phiên bản Pro cho game thủ chuyên nghiệp.', 'https://product.hstatic.net/200000722513/product/gg8eh9a3_d2b2d4b1a1ea4cbc90c1f8cf559ec020_master.png');
GO

-- ============================================================
-- 10. SẢN PHẨM - CategoryId = 8: Bàn phím
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(8, N'Bàn phím cơ Keychron K3 RGB Hot Swap (75%, Bluetooth)', 1390000, 1290000, N'75% layout, hot swap, RGB, Bluetooth 5.1 và USB-C, tương thích Mac và Win. Siêu mỏng chỉ 22mm.', 'https://www.keychron.com/cdn/shop/products/Keychron-K3-ultra_slim-Hot_swappable-wireless-mechanical-keyboard-Mac-Windows-iOS-Android-75percent-layout-White-backlight-aluminum-frame-low-profile-Gateron-mechanical-switch-red.jpg?v=1699321418&width=1214'),
(8, N'Bàn phím Akko 3068B Plus Multi-modes RGB (65%)', 1090000, 990000, N'65%, kết nối 3 chế độ Bluetooth và 2.4GHz và USB, Akko switch, RGB. Lựa chọn tầm trung giá tốt nhất.', 'https://akko.vn/wp-content/uploads/2022/11/ban-phim-co-akko-3068b-plus-blue-on-white-001-768x768.jpg'),
(8, N'Bàn phím Keychron B6P-K1 Scissor Switch Wireless (Full size)', 890000, NULL, N'Full size siêu mỏng 14.5mm, Scissor switch êm, 3 chế độ kết nối 2.4G và BT và USB-C, tương thích Mac và Win.', 'https://product.hstatic.net/200000722513/product/download__9__7e93b9bf7ab345b5b33350b5beab3121_master.png'),
(8, N'Bàn phím gaming Razer BlackWidow V4 X Wired RGB', 2290000, 1990000, N'Full size, Razer Mechanical Yellow switch, RGB Chroma, có phím macro, chống tràn nước IPX4.', 'https://product.hstatic.net/200000722513/product/2_0d44b2aba78a4de4b8a0dc4cd7c8eb66_master.jpg'),
(8, N'Bàn phím gaming ASUS ROG Strix Scope TKL Deluxe', 2590000, 2290000, N'TKL 87%, ROG RX Red switch, RGB Aura Sync, chống tràn nước, kê tay từ tính. Chuẩn eSport chuyên nghiệp.', 'https://product.hstatic.net/200000722513/product/thumb-tap-trung-manh-recovered32125.gif10_dba82b7b6e0c4604a39c923d15bde9c7_master.gif'),
(8, N'Bàn phím gaming Logitech G915 TKL LIGHTSPEED Wireless', 4490000, 3990000, N'TKL, GL Tactile switch thấp, LIGHTSPEED và Bluetooth, RGB LIGHTSYNC, thiết kế slim cao cấp bậc nhất.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/b/a/ban-phim-gaming-khong-day-logitech-g915-x-lightspeed-tkl-low-profile_1.jpg'),
(8, N'Bàn phím gaming Razer Huntsman V3 Pro TKL Analog', 3990000, 3490000, N'TKL, Analog Optical switch thế hệ 3, RGB Chroma, polling rate 8000Hz. Đỉnh cao công nghệ bàn phím gaming.', 'https://product.hstatic.net/200000722513/product/250-9303-ban-phim-razer-v3-pro-tenkeyless-1_b7d6ef40b1224ede9552186f348113da_master.jpg'),
(8, N'Bàn phím cơ Leopold FC900R PD Blue Switch (Full size)', 2190000, NULL, N'Full size Cherry MX Blue, POM plate, build quality hàng đầu. Lựa chọn audiophile bàn phím cơ cao cấp.', 'https://product.hstatic.net/200000722513/product/-leopold-fc900r-pd-white-blue-star-04_1e3fe162014a49aca95a691469103581_c125ba7f411b42b3851840475e0eb8a4_master.jpg');
GO

-- ============================================================
-- 11. SẢN PHẨM - CategoryId = 9: Chuột
-- ============================================================
INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl) VALUES
(9, N'Chuột Razer DeathAdder Essential Wired (6400 DPI)', 490000, NULL, N'Có dây USB, 6400 DPI, 5 nút, công thái học tay phải, LED Chroma. Chuột gaming giá rẻ tốt nhất thị trường.', 'https://product.hstatic.net/200000722513/product/thumbchuot_7445abea69bf461e881eeba2b6cbbd8d_master.jpg'),
(9, N'Chuột Razer Orochi V2 Wireless (18000 DPI)', 1390000, 1190000, N'Không dây 2.4G và Bluetooth, 18000 DPI, pin 425h, nhỏ gọn bỏ túi. Gaming di động tiện lợi tối ưu.', 'https://owlgaming.vn/wp-content/uploads/2024/01/chuot-razer-orochi-v2-black-768x768.jpg'),
(9, N'Chuột Razer Basilisk V3 Wired (26000 DPI)', 1590000, 1390000, N'Có dây USB, Focus+ 26K DPI, 11 nút, cuộn thông minh HyperScroll, RGB Chroma, thiết kế công thái học.', 'https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/chuot-gaming-razer-basilisk-v3-rz01-04000100-r3m1-1689929210200.png?v=1775012922980'),
(9, N'Chuột Logitech G304 LIGHTSPEED Wireless (12000 DPI)', 690000, 590000, N'Không dây LIGHTSPEED, HERO sensor 12000 DPI, pin AA 250h, 99g. Chuột không dây giá rẻ tốt nhất thị trường.', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_i_xu_ng_36__2.png'),
(9, N'Chuột Logitech G502 X Plus LIGHTSPEED Wireless (25600 DPI)', 2990000, 2690000, N'Không dây LIGHTSPEED, HERO 25K sensor, 89g, 13 nút lập trình, RGB LIGHTSYNC, thiết kế công thái học.', 'https://product.hstatic.net/200000722513/product/g502x-plus-gallery-2-black_1db5bbb43d2f443ea2eaf758a6f97e77_ba770c37d454493f986eaaf4e81bddcf_master.png'),
(9, N'Chuột Logitech G Pro X SUPERLIGHT 2 Wireless (32000 DPI)', 3490000, 3190000, N'Không dây LIGHTSPEED, HERO 2 32K sensor, 60g siêu nhẹ, pin 95h. Chuột gaming Pro chuyên nghiệp đỉnh cao.', 'https://anphat.com.vn/media/product/46381_logitech_g_pro_x_superlight_2_wireless_white_anphatcomputer_1.jpg'),
(9, N'Chuột ASUS ROG Strix Impact III Wireless (36000 DPI)', 1090000, NULL, N'Không dây 2.4G và Bluetooth, 36000 DPI, 79g, switch ROG Optical, pin 100h. Giá tốt cho chuột không dây.', 'https://product.hstatic.net/200000722513/product/impact-iii-wireless-1_b43da959481841769eb1899d9ce1e32e_1024x1024_thumb_56af8e8918cb40a48d3b2c92ec9e0139_master.jpg'),
(9, N'Chuột Logitech G502 HERO Wired (25600 DPI)', 990000, 890000, N'Có dây USB, HERO 25K sensor, 25600 DPI, 11 nút, trọng lượng điều chỉnh được, RGB. Bestseller lâu năm.', 'https://product.hstatic.net/200000722513/product/10001_01736316d2b443d0838e5a0741434420_master.png');
GO

-- ============================================================
-- KIỂM TRA KẾT QUẢ
-- ============================================================
SELECT c.Name AS [Danh mục], COUNT(p.Id) AS [Số sản phẩm]
FROM Products p
JOIN Categories c ON p.CategoryId = c.Id
GROUP BY c.Id, c.Name
ORDER BY c.Id;
GO
