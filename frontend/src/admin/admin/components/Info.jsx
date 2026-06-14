// Component hien thi 1 dong "Nhãn: Giá trị" dung trong modal chi tiet
export default function Info({ label, value }) {
  return (
    <p className="mb-2 text-sm">
      <span className="font-bold text-gray-700">{label}: </span>
      <span className="text-gray-600">{value || "-"}</span>
    </p>
  );
}
