import { useEffect, useMemo, useState } from "react";
import { Edit, FolderTree, Search, Trash2 } from "lucide-react";
import { apiGet, apiSend } from "../adminApi.js";
import PageTitle from "../components/PageTitle.jsx";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => setCategories(await apiGet("/api/admin/categories"));

  useEffect(() => {
    apiGet("/api/admin/categories").then(setCategories).catch(alert);
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return categories;
    return categories.filter((cat) => String(cat.Name || "").toLowerCase().includes(keyword));
  }, [categories, search]);

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await apiSend(`/api/admin/categories/${editing.Id}`, "PUT", { Name: name });
    else await apiSend("/api/admin/categories", "POST", { Name: name });
    setName("");
    setEditing(null);
    await load();
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;
    await apiSend(`/api/admin/categories/${id}`, "DELETE", {});
    await load();
  };

  return (
    <div>
      <PageTitle icon={FolderTree} title="Quản Lý Danh Mục" />
      <form onSubmit={submit} className="mb-5 flex gap-2 rounded-lg bg-white p-4 shadow-sm">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên danh mục"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-primary px-4 py-2 font-medium text-white">
          {editing ? "Lưu" : "Thêm"}
        </button>
      </form>

      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm danh mục..."
            className="w-full rounded border py-2 pl-10 pr-3"
          />
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {filteredCategories.map((cat) => (
          <div key={cat.Id} className="flex items-center justify-between border-b p-4">
            <span className="font-medium">{cat.Name}</span>
            <div>
              <button
                onClick={() => {
                  setEditing(cat);
                  setName(cat.Name);
                }}
                className="mr-2 rounded bg-blue-50 p-2 text-blue-600"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button onClick={() => remove(cat.Id)} className="rounded bg-red-50 p-2 text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className="p-4 text-sm text-gray-500">Không có danh mục phù hợp</div>
        )}
      </div>
    </div>
  );
}
