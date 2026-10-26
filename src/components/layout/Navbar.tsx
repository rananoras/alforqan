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
  const [linksModalOpen, setLinksModalOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; route: MainRoute; color: string }[] = [
    { role: 'admin', label: 'المدير العام', desc: 'لوحة تحكم كاملة والإعدادات وسجل التدقيق', route: 'admin', color: 'bg-emerald-700 text-white' },
    { role: 'teacher', label: 'معلم الحلقة', desc: 'التسميع والمراجعة والتحضير والنقاط', route: 'teacher', color: 'bg-blue-700 text-white' },
    { role: 'student', label: 'الطالب', desc: 'بطاقة الطالب والواجب وسجل الحفظ والنقاط', route: 'student', color: 'bg-teal-700 text-white' },
    { role: 'parent', label: 'ولي الأمر', desc: 'متابعة الأبناء والحفظ والرسوم وسندات القبض', route: 'parent', color: 'bg-purple-700 text-white' },
    { role: 'accountant', label: 'المحاسب المالي', desc: 'الرسوم وسندات القبض والتقارير المالية', route: 'accountant', color: 'bg-amber-700 text-white' },
    { role: 'staff', label: 'شؤون الطلاب', desc: 'طلبات التسجيل واعتماد الطلاب والملفات', route: 'staff', color: 'bg-indigo-700 text-white' },
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

          {/* Center Navigation Links: Home/Registration, Student, Teacher, Parent, Accountant, Staff, Admin */}
          <nav className="hidden xl:flex items-center gap-1 bg-emerald-900/60 p-1 rounded-xl border border-emerald-800/80 text-xs">
            <button
              onClick={() => onNavigateRoute('home')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                currentRoute === 'home'
                  ? 'bg-amber-400 text-emerald-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              الرئيسية
            </button>

            <button
              onClick={() => onNavigateRoute('student')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'student'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>الطالب</span>
            </button>

            <button
              onClick={() => onNavigateRoute('teacher')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'teacher'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-300" />
              <span>المعلم</span>
            </button>

            <button
              onClick={() => onNavigateRoute('parent')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'parent'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>ولي الأمر</span>
            </button>

            <button
              onClick={() => onNavigateRoute('accountant')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'accountant'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              <span className="text-amber-300 font-bold">$</span>
              <span>المحاسب</span>
            </button>

            <button
              onClick={() => onNavigateRoute('staff')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'staff'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-300" />
              <span>شؤون الطلاب</span>
            </button>

            <button
              onClick={() => onNavigateRoute('admin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentRoute === 'admin'
                  ? 'bg-emerald-800 text-amber-300 border border-amber-400/50 shadow-xs ring-1 ring-amber-400/30'
                  : 'text-amber-300 hover:bg-emerald-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>إدارة (/admin)</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Links Menu for Smaller Screens */}
          <div className="hidden md:flex xl:hidden items-center gap-1.5">
            <button
              onClick={() => onNavigateRoute('home')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                currentRoute === 'home' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-100'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigateRoute('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                currentRoute === 'admin' ? 'bg-emerald-800 text-amber-300' : 'text-amber-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>إدارة</span>
            </button>
          </div>

          {/* Left side: Links Directory Button, Role Switcher & User Account */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Guide to Direct Links */}
            <button
              onClick={() => setLinksModalOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-emerald-700/80 rounded-xl text-xs font-semibold transition-colors"
              title="دليل روابط الصلاحيات المباشرة"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>دليل الروابط</span>
            </button>

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
                  className="absolute left-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">الانتقال لواجهة الدور المحددة</p>
                    <p className="text-[11px] text-slate-500">
                      كل صلاحية لها واجهة ورابط مباشر مخصص
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setActiveRole(r.role);
                        onNavigateRoute(r.route);
                      }}
                      className={`w-full text-right px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
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
                          <span className="font-bold">{r.label}</span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded" dir="ltr">
                            /{r.route}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block pr-3.5 mt-0.5">
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
            <span>إدارة (/admin)</span>
            {pendingCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setLinksModalOpen(true)}
            className="px-2 py-1 rounded-md text-[11px] font-semibold text-amber-300 bg-emerald-900/60"
          >
            الروابط
          </button>
        </div>
      </div>

      {/* Direct Links Directory Modal */}
      {linksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 p-6 text-slate-900 text-right animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-quran">
                    دليل الروابط المباشرة حسب الصلاحيات والأدوار
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    روابط مستقلة ومخصصة لكل حساب وصلاحية في نظام جامع سعيد الجابي
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLinksModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 my-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Home */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    الصفحة الرئيسية (بوابة التسجيل والاستعلام)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    تسجيل الطلاب الجدد، متابعة حالة الطلب، والتعريف بمجمع الحلقات
                  </span>
                </div>
                <button
                  onClick={() => {
                    onNavigateRoute('home');
                    setLinksModalOpen(false);
                  }}
                  className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-mono text-xs rounded-xl font-bold"
                  dir="ltr"
                >
                  #/
                </button>
              </div>

              {/* Admin */}
              <div className="p-3 rounded-2xl border-2 border-emerald-700 bg-emerald-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-950 block">
                      لوحة تحكم المدير العام (إدارة)
                    </span>
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                      صلاحية المدير
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800">
                    الإحصائيات، شؤون الطلاب، الحلقات، التحفيظ، المالية، وإعدادات النظام الحصرية
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveRole('admin');
                    onNavigateRoute('admin');
                    setLinksModalOpen(false);
                  }}
                  className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-mono text-xs rounded-xl font-bold border border-amber-400/40"
                  dir="ltr"
                >
                  #/admin
                </button>
              </div>

              {/* Teacher */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    بوابة المعلم والمشرف القرآني
                  </span>
                  <span className="text-[10px] text-slate-500">
                    جدول الحلقة، رصد التسميع اليومي والمراجعة، التحضير ومنح المكافآت
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveRole('teacher');
                    onNavigateRoute('teacher');
                    setLinksModalOpen(false);
                  }}
                  className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs rounded-xl font-bold"
                  dir="ltr"
                >
                  #/teacher
                </button>
              </div>

              {/* Student */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    بوابة الطالب
                  </span>
                  <span className="text-[10px] text-slate-500">
                    بطاقة الطالب بالباركود، خطة الغد، سجل الحفظ، نقاط التميز والشهادات
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveRole('student');
                    onNavigateRoute('student');
                    setLinksModalOpen(false);
                  }}
                  className="px-3 py-1 bg-teal-700 hover:bg-teal-600 text-white font-mono text-xs rounded-xl font-bold"
                  dir="ltr"
                >
                  #/student
                </button>
              </div>

              {/* Parent */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    بوابة ولي الأمر
                  </span>
                  <span className="text-[10px] text-slate-500">
                    متابعة الأبناء، سجل الحضور، كشف الرسوم والاشتراكات، وسندات القبض
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveRole('parent');
                    onNavigateRoute('parent');
                    setLinksModalOpen(false);
                  }}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs rounded-xl font-bold"
                  dir="ltr"
                >
                  #/parent
                </button>
              </div>

              {/* Accountant */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    بوابة المحاسب المالي
                  </span>
                  <span className="text-[10px] text-slate-500">
                    إصدار سندات القبض، تحصيل الاشتراكات، متابعة المتأخرات، والتقارير
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveRole('accountant');
                    onNavigateRoute('accountant');
                    setLinksModalOpen(false);
                  }}
                  className="px-3 py-1 bg-amber-700 hover:bg-amber-600 text-white font-mono text-xs rounded-xl font-bold"
                  dir="ltr"
                >
                  #/accountant
                </button>
              </div>

              {/* Staff */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    بوابة شؤون الطلاب والتسجيل
                  </span>
                  <span className="text-[10px] text-slate-500">
                    مراجعة واعتماد طلبات القبول، الأرقام الأكاديمية، والملفات الثبوتية
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveRole('staff');
                    onNavigateRoute('staff');
                    setLinksModalOpen(false);
                  }}
                  className="px-3 py-1 bg-indigo-700 hover:bg-indigo-600 text-white font-mono text-xs rounded-xl font-bold"
                  dir="ltr"
                >
                  #/staff
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>جميع الروابط تدعم المسار المباشر أو الـ Hash دون أخطاء 404</span>
              <button
                onClick={() => setLinksModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
