import { useEffect, useState } from "react";
import { ClipboardList, DollarSign, LayoutDashboard, ShoppingBag, Users } from "lucide-react";
import { apiGet, formatMoney } from "../adminApi.js";
import PageTitle from "../components/PageTitle.jsx";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiGet("/api/admin/dashboard").then(setData).catch(alert);
  }, []);

  const cards = [
    { label: "Tổng doanh thu", value: formatMoney(data?.totalRevenue), icon: DollarSign },
    { label: "Số đơn hàng", value: data?.orderCount || 0, icon: ClipboardList },
    { label: "Số sản phẩm", value: data?.productCount || 0, icon: ShoppingBag },
    { label: "Số khách hàng", value: data?.customerCount || 0, icon: Users },
  ];

  return (
    <div>
      <PageTitle icon={LayoutDashboard} title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.label}</p>
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
