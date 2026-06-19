import sql from "../config/db.js";

// GET /api/products?category=<tên danh mục>
//Home.jsx vàCategoryPage.jsx
//lấy danh sách sản phẩm và hỗ trợ lọc theo danh mục
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const request = new sql.Request();

    let query = `
      SELECT p.*, c.Name as CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.Id
    `;

    if (category) {
      request.input("category", sql.NVarChar, category);
      query += " WHERE c.Name = @category";
    }

    query += " ORDER BY p.Id DESC";

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay du lieu san pham" });
  }
};

// GET /api/categories
//Sidebar.jsx
//lấy danh sách các danh mục sản phẩm phục vụ hiển thị menu hoặc sidebar cho người dùng
export const getCategories = async (req, res) => {
  try {
    const result = await sql.query("SELECT Name FROM Categories ORDER BY Id");
    const categories = result.recordset.map((item) => item.Name);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay danh muc" });
  }
};
