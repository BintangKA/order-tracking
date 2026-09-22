import { useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

export interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Header */}
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto bg-white">
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
