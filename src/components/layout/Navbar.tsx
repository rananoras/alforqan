import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  BookOpen,
  UserCheck,
  LogOut,
  LogIn,
  Shield,
  Calendar,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Users,
} from 'lucide-react';

export type MainRoute = 'home' | 'admin' | 'teacher' | 'student';

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
  const {
    currentUser,
    userProfile,
    activeRole,
    setActiveRole,
    signInWithGoogle,
    logout,
    loading,
  } = useAuth();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'admin', label: 'مدير عام', desc: 'صلاحيات كاملة والتحكم بالإعدادات', color: 'bg-emerald-700 text-white' },
    { role: 'staff', label: 'شؤون الطلاب', desc: 'إدارة التسجيل والملفات والحضور', color: 'bg-teal-700 text-white' },
    { role: 'teacher', label: 'معلم حلقة', desc: 'رصد الحفظ والمراجعة والتقييم', color: 'bg-blue-700 text-white' },
    { role: 'accountant', label: 'محاسب مالي', desc: 'إدارة الرسوم والإيصالات والمالية', color: 'bg-amber-700 text-white' },
    { role: 'parent', label: 'ولي أمر / طالب', desc: 'عرض بطاقة الطالب والحفظ والرسوم', color: 'bg-purple-700 text-white' },
  ];

  // Arabic Date Formatter
  const today = new Date();
  const gregorianDate = today.toLocaleDateString('ar-SA-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="bg-emerald-950 text-white sticky top-0 z-40 shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Right side: Mobile Menu + Mosque Brand */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {currentRoute === 'admin' && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
                title="القائمة"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            <button
              onClick={() => onNavigateRoute('home')}
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
                    مجمع حلقات القرآن
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 hidden sm:block">
                  إدارة شؤون الحلقات والطلاب والتحفيظ
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links: Home/Registration, Student, Teacher, and Admin */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-900/60 p-1 rounded-xl border border-emerald-800/80 text-xs">
            <button
              onClick={() => onNavigateRoute('home')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentRoute === 'home'
                  ? 'bg-amber-400 text-emerald-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              الرئيسية (التسجيل)
            </button>

            <button
              onClick={() => onNavigateRoute('student')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'student'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>بوابة الطالب</span>
            </button>

            <button
              onClick={() => onNavigateRoute('teacher')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'teacher'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-300" />
              <span>بوابة المعلم</span>
            </button>

            <button
              onClick={() => onNavigateRoute('admin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'admin'
                  ? 'bg-emerald-800 text-amber-300 border border-amber-400/40 shadow-xs'
                  : 'text-amber-300 hover:bg-emerald-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>إدارة</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Left side: Role Switcher & User Account */}
          <div className="flex items-center space-x-2.5 space-x-reverse">
            {/* Role Switcher (For Evaluation and Quick Preview) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 bg-emerald-900/80 hover:bg-emerald-800 px-2.5 py-1.5 rounded-lg border border-emerald-700 text-xs transition-colors"
                title="تبديل الدور للمعاينة"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-emerald-200 hidden lg:inline">الدور:</span>
                <span className="font-bold text-amber-300">
                  {roles.find((r) => r.role === activeRole)?.label || activeRole}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">تخصيص الواجهة حسب الدور</p>
                    <p className="text-[11px] text-slate-500">
                      اختر الحساب لعرض الواجهة المخصصة له
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setActiveRole(r.role);
                        if (r.role === 'admin') onNavigateRoute('admin');
                        else if (r.role === 'teacher') onNavigateRoute('teacher');
                        else if (r.role === 'parent' || r.role === 'student') onNavigateRoute('student');
                      }}
                      className={`w-full text-right px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        activeRole === r.role ? 'bg-emerald-50/80 font-bold text-emerald-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activeRole === r.role ? 'bg-amber-500' : 'bg-slate-300'
                            }`}
                          />
                          <span>{r.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block pr-3.5">
                          {r.desc}
                        </span>
                      </div>
                      {activeRole === r.role && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          نشط
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth User Info / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-emerald-800 transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="w-8 h-8 rounded-full border border-amber-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-emerald-950 font-bold flex items-center justify-center text-xs">
                      {currentUser.displayName ? currentUser.displayName[0] : 'ف'}
                    </div>
                  )}
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute left-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {currentUser.displayName || 'مستخدم النظام'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate" dir="ltr">
                        {currentUser.email}
                      </p>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full text-right px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold rounded-lg shadow transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-950" />
                <span>دخول</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-emerald-900 text-xs">
          <button
            onClick={() => onNavigateRoute('home')}
            className={`px-2 py-1 rounded-md font-bold ${
              currentRoute === 'home' ? 'text-amber-300 bg-emerald-900' : 'text-emerald-200'
            }`}
          >
            التسجيل
          </button>
          <button
            onClick={() => onNavigateRoute('student')}
            className={`px-2 py-1 rounded-md font-bold ${
              currentRoute === 'student' ? 'text-amber-300 bg-emerald-900' : 'text-emerald-200'
            }`}
          >
            بوابة الطالب
          </button>
          <button
            onClick={() => onNavigateRoute('teacher')}
            className={`px-2 py-1 rounded-md font-bold ${
              currentRoute === 'teacher' ? 'text-amber-300 bg-emerald-900' : 'text-emerald-200'
            }`}
          >
            بوابة المعلم
          </button>
          <button
            onClick={() => onNavigateRoute('admin')}
            className={`px-2 py-1 rounded-md font-bold flex items-center gap-1 ${
              currentRoute === 'admin' ? 'text-amber-300 bg-emerald-900' : 'text-emerald-200'
            }`}
          >
            <span>إدارة</span>
            {pendingCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
