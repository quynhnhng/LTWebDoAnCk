import sql from "../config/db.js";

// GET /api/admin/categories
//Lấy categories
export const getCategories = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM Categories ORDER BY Id DESC");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay danh muc" });
  }
};

// POST /api/admin/categories
export const createCategory = async (req, res) => {
  try {
    await new sql.Request()
      .input("Name", sql.NVarChar, req.body.Name)
      .query("INSERT INTO Categories (Name) VALUES (@Name)");

    res.status(201).json({ message: "Da them danh muc" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi them danh muc" });
  }
};

// PUT /api/admin/categories/:id
export const updateCategory = async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("Name", sql.NVarChar, req.body.Name)
      .query("UPDATE Categories SET Name = @Name WHERE Id = @Id");

    res.json({ message: "Da sua danh muc" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi sua danh muc" });
  }
};

// DELETE /api/admin/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM Categories WHERE Id = @Id");

    res.json({ message: "Da xoa danh muc" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Khong the xoa danh muc dang co san pham" });
  }
};
