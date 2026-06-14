// Component tieu de cho moi trang, co icon + ten trang, co the them nut o ben phai
export default function PageTitle({ icon, title, children }) {
  const TitleIcon = icon;

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-red-50 p-2 text-primary">
          <TitleIcon className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}
