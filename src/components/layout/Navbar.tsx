import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  LogOut,
  LogIn,
  Shield,
  Menu,
  X,
  UserPlus,
  Search,
  Award,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export type MainRoute = 'home' | 'admin' | 'teacher' | 'student' | 'parent' | 'accountant' | 'staff';

interface NavbarProps {
  currentRoute: MainRoute;
  onNavigateRoute: (route: MainRoute) => void;
  onToggleSidebar?: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigateRoute,
  onToggleSidebar,
  pendingCount = 0,
}) => {
  const { currentUser, signInWithGoogle, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (currentRoute !== 'home') {
      onNavigateRoute('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-emerald-950 text-white sticky top-0 z-40 shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Right side: Mosque Branding */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {currentRoute === 'admin' && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
                title="قائمة الإدارة"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => {
                onNavigateRoute('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-3 space-x-reverse text-right group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md border border-amber-300 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6 text-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-base sm:text-lg tracking-wide text-amber-300 font-quran">
                    جامع سعيد الجابي
                  </h1>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 hidden sm:inline">
                    حلقات القرآن الكريم
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 hidden sm:block">
                  مجمع التحفيظ والتربية الإيمانية
                </p>
              </div>
            </button>
          </div>

          {/* Center: Simplified Navigation (Just like standard clean halaqat sites) */}
          {currentRoute === 'home' ? (
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3 py-2 rounded-lg font-bold text-white hover:text-amber-300 hover:bg-emerald-900/60 transition-colors"
              >
                الرئيسية
              </button>
              <button
                onClick={() => scrollToSection('circles-section')}
                className="px-3 py-2 rounded-lg font-bold text-emerald-100 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>الحلقات القرآنية</span>
              </button>
              <button
                onClick={() => scrollToSection('register-section')}
                className="px-3 py-2 rounded-lg font-bold text-emerald-100 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>التسجيل في الجامع</span>
              </button>
              <button
                onClick={() => scrollToSection('inquiry-section')}
                className="px-3 py-2 rounded-lg font-bold text-emerald-100 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>استعلام ومتابعة الطالب</span>
              </button>
              <button
                onClick={() => scrollToSection('honor-section')}
                className="px-3 py-2 rounded-lg font-bold text-emerald-100 hover:text-amber-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>لوحة الشرف</span>
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onNavigateRoute('home')}
                className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 hover:text-white rounded-lg text-xs font-bold border border-emerald-700/60 transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة للموقع العام</span>
              </button>
              <span className="text-xs text-amber-300 font-semibold px-2 py-1 bg-emerald-900/40 rounded border border-emerald-800">
                لوحة التحكم الإدارية
              </span>
            </div>
          )}

          {/* Left side: Admin button & Simple login */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {currentRoute === 'home' ? (
              <button
                onClick={() => onNavigateRoute('admin')}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 border border-amber-300"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>لوحة الإدارة</span>
                {pendingCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => onNavigateRoute('home')}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-emerald-600 transition-colors flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>الموقع العام</span>
              </button>
            )}

            {/* Quick Auth Button */}
            {currentUser ? (
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                disabled={loading}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 rounded-xl text-xs font-medium border border-emerald-800 transition-colors"
                title="دخول المشرفين"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>دخول</span>
              </button>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-800 px-4 pt-3 pb-5 space-y-2 text-xs animate-in slide-in-from-top-2">
          {currentRoute === 'home' ? (
            <>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full text-right py-2 px-3 rounded-lg font-bold text-white hover:bg-emerald-900"
              >
                الرئيسية
              </button>
              <button
                onClick={() => scrollToSection('circles-section')}
                className="w-full text-right py-2 px-3 rounded-lg font-bold text-emerald-100 hover:bg-emerald-900 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>الحلقات القرآنية</span>
              </button>
              <button
                onClick={() => scrollToSection('register-section')}
                className="w-full text-right py-2 px-3 rounded-lg font-bold text-emerald-100 hover:bg-emerald-900 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>التسجيل في الجامع</span>
              </button>
              <button
                onClick={() => scrollToSection('inquiry-section')}
                className="w-full text-right py-2 px-3 rounded-lg font-bold text-emerald-100 hover:bg-emerald-900 flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>استعلام ومتابعة الطالب</span>
              </button>
              <button
                onClick={() => scrollToSection('honor-section')}
                className="w-full text-right py-2 px-3 rounded-lg font-bold text-emerald-100 hover:bg-emerald-900 flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>لوحة الشرف</span>
              </button>
              <div className="pt-2 border-t border-emerald-900">
                <button
                  onClick={() => {
                    onNavigateRoute('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 bg-amber-500 text-emerald-950 font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>دخول لوحة الإدارة (/admin)</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                onNavigateRoute('home');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للموقع العام للجامع</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
