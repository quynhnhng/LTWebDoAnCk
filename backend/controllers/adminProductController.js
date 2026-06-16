import sql from "../config/db.js";

const toNumberOrNull = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  return Number(value);
};

// GET /api/admin/products?search=&category=
export const getProducts = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    const request = new sql.Request()
      .input("search", sql.NVarChar, `%${search}%`)
      .input("category", sql.Int, toNumberOrNull(category));

    const result = await request.query(`
      SELECT p.*, c.Name AS CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.Id
      WHERE (@search = '%%' OR p.Title LIKE @search)
        AND (@category IS NULL OR p.CategoryId = @category)
      ORDER BY p.Id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay san pham" });
  }
};

// POST /api/admin/products
export const createProduct = async (req, res) => {
  try {
    const { CategoryId, Title, Price, PromoPrice, Description, ImageUrl } =
      req.body;

    await new sql.Request()
      .input("CategoryId", sql.Int, CategoryId)
      .input("Title", sql.NVarChar, Title)
      .input("Price", sql.Int, Price)
      .input("PromoPrice", sql.Int, toNumberOrNull(PromoPrice))
      .input("Description", sql.NVarChar, Description || "")
      .input("ImageUrl", sql.VarChar, ImageUrl || "").query(`
        INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl)
        VALUES (@CategoryId, @Title, @Price, @PromoPrice, @Description, @ImageUrl)
      `);

    res.status(201).json({ message: "Da them san pham" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi them san pham" });
  }
};

// PUT /api/admin/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { CategoryId, Title, Price, PromoPrice, Description, ImageUrl } =
      req.body;

    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("CategoryId", sql.Int, CategoryId)
      .input("Title", sql.NVarChar, Title)
      .input("Price", sql.Int, Price)
      .input("PromoPrice", sql.Int, toNumberOrNull(PromoPrice))
      .input("Description", sql.NVarChar, Description || "")
      .input("ImageUrl", sql.VarChar, ImageUrl || "").query(`
        UPDATE Products
        SET CategoryId = @CategoryId,
            Title      = @Title,
            Price      = @Price,
            PromoPrice = @PromoPrice,
            Description = @Description,
            ImageUrl   = @ImageUrl
        WHERE Id = @Id
      `);

    res.json({ message: "Da cap nhat san pham" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi sua san pham" });
  }
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // First delete related OrderItems to avoid foreign key constraint
    await new sql.Request()
      .input("ProductId", sql.Int, productId)
      .query("DELETE FROM OrderItems WHERE ProductId = @ProductId");

    // Then delete the product
    await new sql.Request()
      .input("Id", sql.Int, productId)
      .query("DELETE FROM Products WHERE Id = @Id");

    res.json({ message: "Da xoa san pham" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi xoa san pham: " + error.message });
  }
};
