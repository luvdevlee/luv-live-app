"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks";
import { AuthModal } from "@/components/forms";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const navItems = [
    { href: "/home", label: "Trang chủ" },
    { href: "/lives", label: "Lives"},
    { href: "/games", label: "Games" },
    { href: "/liveshow", label: "Liveshow" },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 border-b transition-all duration-300"
      style={{ 
        height: "var(--header-height)",
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--header-border)",
        boxShadow: "var(--header-shadow)"
      }}
    >
      <div className="header-container">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center gap-16">
          <Link 
            href="/" 
            className="logo-text text-2xl font-bold transition-colors"
            style={{ color: "var(--header-text)" }}
          >
            Luv Live
          </Link>

          <nav className="nav-items relative flex gap-8 font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-item relative py-2 transition-colors duration-200 group"
                  style={{ 
                    color: isActive ? "var(--header-text)" : "var(--header-text-muted)"
                  }}
                >
                  {item.label}
                  
                  {/* Underline effect */}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(90deg, var(--primary), #8b5cf6)' 
                        : 'linear-gradient(90deg, var(--primary), #8b5cf6)'
                    }}
                  />
                  
                  {/* Subtle glow effect for active state */}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm"
                      style={{
                        background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section - Search, Theme Toggle & Auth */}
        <div className="flex items-center gap-4">
          <div className="max-w-sm">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="search-input w-48 px-4 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--header-button-bg)",
                color: "var(--header-text)",
                border: "1px solid var(--border)"
              }}
            />
          </div>

          {/* Dark / Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors"
            style={{
              backgroundColor: "var(--header-button-bg)",
              color: "var(--header-text-muted)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--header-button-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--header-button-bg)";
            }}
            aria-label={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Auth buttons */}
          <div className="auth-buttons flex items-center gap-3">
            <button 
              onClick={() => openAuthModal('register')}
              className="btn-gradient"
            >
              Đăng ký
            </button>
            <button 
              onClick={() => openAuthModal('login')}
              className="btn-gradient"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        defaultMode={authModal.mode}
      />
    </header>
  );
}
