import { NavLink } from "react-router-dom";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-white">
          <NavLink
            className="flex items-center gap-3 font-extrabold tracking-tight text-black"
            to="/orders"
            onClick={onClose}
          >
            <img
              src="/logo/sucofindo-logo.png"
              alt="Sucofindo Logo"
              className="h-20 object-contain"
            />
          </NavLink>

          {/* Close button on mobile */}
          <button
            aria-label="Close Sidebar"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black lg:hidden"
            type="button"
            onClick={onClose}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 bg-white">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Menu Utama
          </div>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-black font-semibold text-white shadow-xs"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`
            }
            to="/orders"
            onClick={onClose}
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Daftar Order</span>
          </NavLink>
        </nav>



        {/* User / Dispatcher Profile Footer */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black font-bold text-white text-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-black">
                Dispatcher Officer
              </p>
              <p className="truncate text-[11px] text-gray-500">
                Admin Station
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
