import sql from "../config/db.js";

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT
        (SELECT ISNULL(SUM(TotalPrice), 0) FROM Orders WHERE Status = N'Hoàn thành') AS totalRevenue,
        (SELECT COUNT(*) FROM Orders)                                                   AS orderCount,
        (SELECT COUNT(*) FROM Products)                                                 AS productCount,
        (SELECT COUNT(*) FROM Users u JOIN Roles r ON u.RoleId = r.Id WHERE r.Name = 'user') AS customerCount
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay dashboard" });
  }
};

// GET /api/admin/statistics
export const getStatistics = async (req, res) => {
  try {
    const byDay = await sql.query(`
      SELECT
        CONVERT(VARCHAR(10), CreatedAt, 120) AS Label,
        SUM(TotalPrice)                      AS Revenue,
        COUNT(*)                             AS OrderCount
      FROM Orders
      WHERE Status = N'Hoàn thành'
      GROUP BY CONVERT(VARCHAR(10), CreatedAt, 120)
      ORDER BY Label DESC
    `);

    const byWeek = await sql.query(`
      SELECT
        CONCAT(YEAR(CreatedAt), '-W', DATEPART(WEEK, CreatedAt)) AS Label,
        SUM(TotalPrice)                                           AS Revenue,
        COUNT(*)                                                  AS OrderCount
      FROM Orders
      WHERE Status = N'Hoàn thành'
      GROUP BY YEAR(CreatedAt), DATEPART(WEEK, CreatedAt)
      ORDER BY MIN(CreatedAt) DESC
    `);

    const byMonth = await sql.query(`
      SELECT
        CONVERT(VARCHAR(7), CreatedAt, 120) AS Label,
        SUM(TotalPrice)                     AS Revenue,
        COUNT(*)                            AS OrderCount
      FROM Orders
      WHERE Status = N'Hoàn thành'
      GROUP BY CONVERT(VARCHAR(7), CreatedAt, 120)
      ORDER BY Label DESC
    `);

    res.json({
      byDay: byDay.recordset,
      byWeek: byWeek.recordset,
      byMonth: byMonth.recordset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay thong ke" });
  }
};
