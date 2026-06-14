// Component popup (modal) dung chung, co nut Dong va noi dung tuy y o giua
export default function SimpleModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="rounded bg-gray-100 px-3 py-1">Đóng</button>
        </div>
        {children}
      </div>
    </div>
  );
}
