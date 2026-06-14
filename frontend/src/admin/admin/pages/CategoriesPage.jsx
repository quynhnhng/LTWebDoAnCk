import { useEffect, useState } from "react";
import { Edit, FolderTree, Trash2 } from "lucide-react";
import { apiGet, apiSend } from "../adminApi.js";
import PageTitle from "../components/PageTitle.jsx";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => setCategories(await apiGet("/api/admin/categories"));

  useEffect(() => {
    apiGet("/api/admin/categories").then(setCategories).catch(alert);
  }, []);

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
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên danh mục" className="flex-1 rounded border px-3 py-2" />
        <button className="rounded bg-primary px-4 py-2 font-medium text-white">{editing ? "Lưu" : "Thêm"}</button>
      </form>

      <div className="rounded-lg bg-white shadow-sm">
        {categories.map((cat) => (
          <div key={cat.Id} className="flex items-center justify-between border-b p-4">
            <span className="font-medium">{cat.Name}</span>
            <div>
              <button onClick={() => { setEditing(cat); setName(cat.Name); }} className="mr-2 rounded bg-blue-50 p-2 text-blue-600"><Edit className="h-4 w-4" /></button>
              <button onClick={() => remove(cat.Id)} className="rounded bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
