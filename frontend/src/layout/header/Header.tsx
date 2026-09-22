export interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Left side: Mobile Toggle & Brand Context */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Buka Sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-black transition hover:bg-gray-100 lg:hidden"
          type="button"
          onClick={onToggleSidebar}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-black">
            Real-Time Order & Job Tracking
          </h2>
          <p className="text-[11px] text-gray-500">
            Field Service Operations Console
          </p>
        </div>
      </div>

      {/* Right side: Quick Status & Profile Info */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Dispatcher Station Avatar */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-3 sm:pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            OP
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-black">
              Operations Team
            </p>
            <p className="text-[10px] text-gray-500">
              Dispatcher
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
