import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { apiGet } from "../adminApi.js";
import PageTitle from "../components/PageTitle.jsx";
import StatisticTable from "../components/StatisticTable.jsx";

export default function StatisticsPage() {
  const [data, setData] = useState({ byDay: [], byWeek: [], byMonth: [] });

  useEffect(() => {
    apiGet("/api/admin/statistics").then(setData).catch(alert);
  }, []);

  return (
    <div>
      <PageTitle icon={BarChart3} title="Thống Kê Doanh Thu" />
      <StatisticTable title="Theo ngày" rows={data.byDay} />
      <StatisticTable title="Theo tuần" rows={data.byWeek} />
      <StatisticTable title="Theo tháng" rows={data.byMonth} />
    </div>
  );
}
