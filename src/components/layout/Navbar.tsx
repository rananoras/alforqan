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
  Bell,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenRegisterModal?: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenRegisterModal,
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
    <header className="bg-emerald-900 text-white sticky top-0 z-40 shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Right side: Mobile Menu + Mosque Brand */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
              title="القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md border border-amber-300">
                <BookOpen className="w-6 h-6 text-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg tracking-wide text-amber-300 font-quran">
                    نظام الفرقان القرآني
                  </h1>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    جامع الفرقان
                  </span>
                </div>
                <p className="text-xs text-emerald-200 hidden sm:block">
                  إدارة شؤون الحلقات والطلاب والتحفيظ
                </p>
              </div>
            </div>
          </div>

          {/* Middle: Date Indicator */}
          <div className="hidden md:flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/80 text-xs text-emerald-200">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{gregorianDate}</span>
          </div>

          {/* Left side: Role Switcher & User Account */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Quick Registration Button */}
            {onOpenRegisterModal && (
              <button
                onClick={onOpenRegisterModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-semibold rounded-lg shadow transition-all duration-200 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>تسجيل طالب</span>
              </button>
            )}

            {/* Role Switcher (For Evaluation and Multi-Role Access) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700/80 px-2.5 py-1.5 rounded-lg border border-emerald-700 text-xs transition-colors"
                title="تبديل الدور للمعاينة"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-emerald-100 hidden sm:inline">الدور:</span>
                <span className="font-bold text-amber-300">
                  {roles.find((r) => r.role === activeRole)?.label || activeRole}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-700">تبديل دور المعاينة</p>
                    <p className="text-[11px] text-slate-500">
                      اختر الدور لاختبار صلاحيات النظام وشاشاته
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => setActiveRole(r.role)}
                      className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
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
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
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
                    className="absolute left-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {currentUser.displayName || 'مستخدم النظام'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate" dir="ltr">
                        {currentUser.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                          {roles.find((r) => r.role === (userProfile?.role || 'admin'))?.label}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full text-right px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors mt-1"
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-semibold rounded-lg shadow transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span>دخول بجوجل</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
