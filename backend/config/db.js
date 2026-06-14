import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Da ket noi thanh cong voi SQL Server (PCShopDB)");
  } catch (err) {
    console.error("Loi ket noi CSDL:", err);
    process.exit(1);
  }
};

export default sql;
