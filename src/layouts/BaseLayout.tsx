import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, AlertTriangle } from "lucide-react";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Close dropdown
      if (open && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false);
      }
      // Close modal
      if (confirmOpen && modalRef.current && !modalRef.current.contains(target)) {
        setConfirmOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [confirmOpen, open]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="w-full max-w-8xl mx-auto px-8 sm:px-6 lg:px-16 flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sakthi Technology Logo" className="w-32 object-cover" />
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
          <div className="relative" ref={dropdownRef}>
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
                  onClick={() => {
                    setOpen(false);
                    setConfirmOpen(true);
                  }}
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
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-[999] animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-scaleIn"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <AlertTriangle className="w-12 h-12 text-red-500" />

              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Logout
              </h2>

              <p className="text-gray-600 text-sm">
                Are you sure you want to logout from your account?
              </p>

              <div className="flex gap-4 mt-4 w-full">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={logout}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BaseLayout;
