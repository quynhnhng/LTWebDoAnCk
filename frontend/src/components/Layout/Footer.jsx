export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10 z-10 mt-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 text-center">
        <div>
          <h2 className="text-lg font-semibold">
            T&#7892;NG &#272;&#192;I H&#7894; TR&#7906; (8:00 - 21:00)
          </h2>
          <div className="mt-3 grid gap-2 text-sm text-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            <p>Mua h&#224;ng: 1900.1234</p>
            <p>B&#7843;o h&#224;nh: 1900.5678</p>
            <p>Khi&#7871;u n&#7841;i: 1800.7890</p>
            <p>Email: cskh@pcshopvn.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <p className="mt-2 text-sm text-gray-400">Created in 2026 by PSHOP</p>
          <p className="mt-2 text-sm text-gray-400">
            &copy; 2026 PC Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}