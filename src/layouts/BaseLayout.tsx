import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="w-full max-w-8xl mx-auto px-8 sm:px-6 lg:px-16 flex items-center justify-between h-16 md:h-20">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sakthi Technology Logo" className="w-32  object-cover" />
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Sakthi Laser Technology
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Enterprise Resource Planning
              </p>
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            {/* Round button */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 text-black flex items-center justify-center focus:ring focus:ring-blue-300 hover:bg-gray-100 transition"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Dropdown menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize truncate">Role: {user?.role_type}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-[calc(100vw-50px)] mx-auto px-0 lg:px-8 md:py-6">
        <div className="bg-white shadow rounded-lg md:p-6 ">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-4 mt-auto shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Sakthi Technology. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;
