import { useEffect, useState } from "react";
import { Boxes, Edit, Plus, Search, Trash2 } from "lucide-react";
import { apiGet, apiSend, formatMoney } from "../adminApi.js";
import { emptyProduct } from "../helpers.js";
import PageTitle from "../components/PageTitle.jsx";
import Pagination from "../components/Pagination.jsx";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    const query = `?search=${encodeURIComponent(search)}&category=${category}`;
    setProducts(await apiGet(`/api/admin/products${query}`));
    setCategories(await apiGet("/api/admin/categories"));
  };

  useEffect(() => {
    Promise.all([
      apiGet("/api/admin/products?search=&category="),
      apiGet("/api/admin/categories"),
    ])
      .then(([productData, categoryData]) => {
        setProducts(productData);
        setCategories(categoryData);
      })
      .catch(alert);
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const pageItems = products.slice((page - 1) * pageSize, page * pageSize);

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      CategoryId: Number(form.CategoryId),
      Price: Number(form.Price),
      PromoPrice: form.PromoPrice === "" ? null : Number(form.PromoPrice),
    };

    if (editingId) await apiSend(`/api/admin/products/${editingId}`, "PUT", body);
    else await apiSend("/api/admin/products", "POST", body);

    setForm(emptyProduct);
    setEditingId(null);
    await load();
  };

  const edit = (product) => {
    setEditingId(product.Id);
    setForm({
      CategoryId: product.CategoryId || "",
      Title: product.Title || "",
      Price: product.Price || "",
      PromoPrice: product.PromoPrice || "",
      Description: product.Description || "",
      ImageUrl: product.ImageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    await apiSend(`/api/admin/products/${id}`, "DELETE", {});
    await load();
  };

  return (
    <div>
      <PageTitle icon={Boxes} title="Quản Lý Sản Phẩm" />

      <form onSubmit={submit} className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <input required placeholder="Tên sản phẩm" value={form.Title} onChange={(e) => setForm({ ...form, Title: e.target.value })} className="rounded border px-3 py-2" />
          <select required value={form.CategoryId} onChange={(e) => setForm({ ...form, CategoryId: e.target.value })} className="rounded border px-3 py-2">
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => <option key={cat.Id} value={cat.Id}>{cat.Name}</option>)}
          </select>
          <input required type="number" placeholder="Giá" value={form.Price} onChange={(e) => setForm({ ...form, Price: e.target.value })} className="rounded border px-3 py-2" />
          <input type="number" placeholder="Giá khuyến mãi" value={form.PromoPrice} onChange={(e) => setForm({ ...form, PromoPrice: e.target.value })} className="rounded border px-3 py-2" />
          <input placeholder="Link hình ảnh" value={form.ImageUrl} onChange={(e) => setForm({ ...form, ImageUrl: e.target.value })} className="rounded border px-3 py-2 md:col-span-2" />
          <textarea placeholder="Mô tả" value={form.Description} onChange={(e) => setForm({ ...form, Description: e.target.value })} className="rounded border px-3 py-2 md:col-span-2" />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-medium text-white">
            <Plus className="h-4 w-4" /> {editingId ? "Lưu sản phẩm" : "Thêm sản phẩm"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyProduct); }} className="rounded bg-gray-200 px-4 py-2">
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="mb-4 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm sản phẩm..." className="w-full rounded border py-2 pl-10 pr-3" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border px-3 py-2">
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => <option key={cat.Id} value={cat.Id}>{cat.Name}</option>)}
        </select>
        <button onClick={() => { setPage(1); load().catch(alert); }} className="rounded bg-gray-900 px-4 py-2 text-white">
          Lọc
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Khuyến mãi</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr key={p.Id} className="border-t">
                <td className="p-3">{p.Id}</td>
                <td className="p-3 font-medium">{p.Title}</td>
                <td className="p-3">{p.CategoryName}</td>
                <td className="p-3">{formatMoney(p.Price)}</td>
                <td className="p-3">{p.PromoPrice ? formatMoney(p.PromoPrice) : "-"}</td>
                <td className="p-3">
                  <button onClick={() => edit(p)} className="mr-2 rounded bg-blue-50 p-2 text-blue-600"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => remove(p.Id)} className="rounded bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
