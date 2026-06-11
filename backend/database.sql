CREATE DATABASE PCShopDB;
GO

USE PCShopDB;
GO

CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Price INT NOT NULL,
    ImageUrl VARCHAR(MAX),
    Category VARCHAR(50) NOT NULL
);
GO

CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TotalPrice INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT FOREIGN KEY REFERENCES Orders(Id),
    ProductId INT FOREIGN KEY REFERENCES Products(Id),
    Quantity INT NOT NULL,
    Price INT NOT NULL
);
GO

INSERT INTO Products (Title, Price, ImageUrl, Category)
VALUES 
(N'PC Intel i7-14700F/ VGA RTX 5070', 54990000, 'https://cdn.hstatic.net/products/200000722513/post-01_f9eb7cb1fce5469ebc684c1cbf943f87_grande.jpg', 'pc'),
(N'PC Intel Core Ultra 7 265F/ VGA RTX 5070', 57990000, 'https://cdn.hstatic.net/products/200000722513/post-01_53342b42ceed47a2a10a823de706d545_grande.jpg', 'pc'),
(N'PC Intel Core Ultra 7 265F/ VGA RTX 5070Ti', 66990000, 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__34cded95d1b546368161e3273ab0f50e_master.jpg', 'pc'),
(N'PC Intel Core Ultra 7 265F/ VGA RTX 5080', 76590000, 'https://cdn.hstatic.net/products/200000722513/pc_rtx_5060__2_of_84__c7867c9dc9d94d72a6c18c61e398cee3_grande.jpg', 'pc'),
(N'PC Intel i7-14700F/ VGA RTX 5080', 81490000, 'https://cdn.hstatic.net/products/200000722513/web__61_of_86__aea66174cf754130b266656c48778519_grande.jpg', 'pc'),
(N'PC AMD R7-9800x3D/ VGA RTX 5080 (Powered by MSI)', 88880000, 'https://product.hstatic.net/200000722513/product/pc_gvn__i7-_4070_-_3_0ea0d3f21b41464991ac7134a04ac5e4_grande.png', 'pc'),
(N'laptop', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'laptop'),
(N'laptop-gaming', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'laptop-gaming'),
(N'main-cpu-vga', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'main-cpu-vga'),
(N'case-nguon-tan', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'case-nguon-tan'),
(N'oCung-ram', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'oCung-ram'),
(N'taiNghe', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'taiNghe'),
(N'banPhim', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'banPhim'),
(N'chuot', 1000000, 'https://cdn2.steamgriddb.com/icon/ba8ad81d576f0dc2f54732c1d37e09f3/32/512x512.png', 'chuot');
GO

INSERT INTO Products (Title, Price, ImageUrl, Category)
VALUES 
(N'Tai nghe gaming không dây Akko Verge S9 Ultra White', 1090000, 'https://cdn.hstatic.net/products/200000722513/tai-nghe-gaming-khong-day-akko-verge-s9-ultra-white-1_3b9bdacaacfd4de3916ad1e2e80b203a_master.jpg', 'taiNghe')
