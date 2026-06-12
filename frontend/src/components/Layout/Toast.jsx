import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 2500,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-white px-5 py-4 rounded-lg shadow-2xl border-l-4 transform animate-fade-in-up transition-all max-w-sm border-primary">
      {type === "success" ? (
        <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
      ) : (
        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
      )}
      <p className="text-gray-800 font-medium text-sm">{message}</p>
    </div>
  );
}
