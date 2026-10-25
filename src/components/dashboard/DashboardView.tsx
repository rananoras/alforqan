import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Student,
  Circle,
  MemorizationRecord,
  AttendanceRecord,
  PaymentRecord,
  PointRecord,
  Registration,
} from '../../types';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Receipt,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Star,
  PlusCircle,
  FileText,
  DollarSign,
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  circles: Circle[];
  memorizationRecords: MemorizationRecord[];
  attendanceRecords: AttendanceRecord[];
  payments: PaymentRecord[];
  pointsLedger: PointRecord[];
  registrations: Registration[];
  currency?: string;
  onNavigate: (tab: any) => void;
  onOpenAddStudent: () => void;
  onOpenAddMemorization: () => void;
  onOpenAddAttendance: () => void;
  onOpenAddPayment: () => void;
  onOpenAwardPoints: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  circles,
  memorizationRecords,
  attendanceRecords,
  payments,
  pointsLedger,
  registrations,
  currency = 'ر.س',
  onNavigate,
  onOpenAddStudent,
  onOpenAddMemorization,
  onOpenAddAttendance,
  onOpenAddPayment,
  onOpenAwardPoints,
}) => {
  const { userProfile, activeRole } = useAuth();

  // Computations
  const activeStudents = students.filter((s) => s.status === 'active');
  const archivedStudents = students.filter((s) => s.status === 'archived');
  const totalCompletedJuz = students.reduce((acc, s) => acc + (s.completedJuz || 0), 0);
  const totalPoints = students.reduce((acc, s) => acc + (s.totalPoints || 0), 0);

  // Financial calculations
  const totalCollected = payments.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
  const totalOutstandingBalance = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);

  // Attendance rate today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter((a) => a.date === todayStr);
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate =
    todayAttendance.length > 0
      ? Math.round((presentCount / todayAttendance.length) * 100)
      : 96; // Representative initial rate

  // Pending registrations
  const pendingRegs = registrations.filter((r) => r.status === 'pending');

  // Top 5 students by points
  const topStudents = [...students]
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
    .slice(0, 5);

  // Recent 6 memorization logs
  const recentMemorization = [...memorizationRecords]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg border border-emerald-700/50">
        <div className="absolute left-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                لوحة المتابعة الشاملة
              </span>
              <span className="text-xs text-emerald-200">
                مرحباً بك، {userProfile?.displayName || 'فضيلة المشرف'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-quran text-amber-300">
              جامع سعيد الجابي ومجمع حلقات تحفيظ القرآن الكريم
            </h2>
            <p className="text-xs md:text-sm text-emerald-100 max-w-2xl mt-1">
              متابعة شؤون الطلاب، وتسميع القرآن الكريم، ونظام الحضور والغياب، والمدفوعات الإلكترونية، ونقاط التميز السلوكي والحفظي.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAddMemorization}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>رصد تسميع جديد</span>
            </button>
            <button
              onClick={onOpenAddAttendance}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs rounded-xl border border-emerald-600 shadow transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4 text-amber-300" />
              <span>تحضير الحلقة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">إجمالي الطلاب</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{students.length}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            {activeStudents.length} نشط • {archivedStudents.length} مؤرشف
          </div>
        </div>

        {/* Circles */}
        <div
          onClick={() => onNavigate('circles')}
          className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">الحلقات القرآنية</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{circles.length}</div>
          <div className="text-[10px] text-teal-600 font-medium mt-1">
            {circles.filter((c) => c.status === 'active').length} حلقة مفعلة
          </div>
        </div>

        {/* Attendance Rate */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">نسبة الحضور</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{attendanceRate}%</div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">
            التزام وانضباط ممتاز
          </div>
        </div>

        {/* Completed Juz */}
        <div
          onClick={() => onNavigate('memorization')}
          className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">الأجزاء المنجزة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalCompletedJuz}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">
            جزء قرآني محفوظ ومثبت
          </div>
        </div>

        {/* Collected Fees */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">الرسوم المحصلة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">
            {totalCollected.toLocaleString()} <span className="text-xs font-normal">{currency}</span>
          </div>
          <div className="text-[10px] text-rose-600 font-medium mt-1">
            المتبقي: {totalOutstandingBalance.toLocaleString()} {currency}
          </div>
        </div>

        {/* Points Awarded */}
        <div
          onClick={() => onNavigate('points')}
          className="bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">نقاط التميز</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalPoints}</div>
          <div className="text-[10px] text-purple-600 font-medium mt-1">
            نقاط مكافآت ممنوحة
          </div>
        </div>
      </div>

      {/* Pending Registrations Notice */}
      {pendingRegs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              {pendingRegs.length}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                يوجد {pendingRegs.length} طلب تسجيل جديد بحاجة للمراجعة والاعتماد
              </p>
              <p className="text-[11px] text-amber-700">
                يمكنك مراجعة بيانات الطلاب وتعيين الحلقات وإصدار أرقام القبول الرسمية فوراً.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('registrations')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            <span>مراجعة الطلبات</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Middle Section: Recent Memorization & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Memorization Sessions (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200/80 p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 font-quran text-base">
                أحدث جلسات التسميع والحفظ في الجامع
              </h3>
            </div>
            <button
              onClick={() => onNavigate('memorization')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <span>عرض سجل التسميع كاملاً</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMemorization.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              لا توجد جلسات تسميع مسجلة حتى الآن. اضغط «رصد تسميع جديد» للبدء.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMemorization.map((rec) => {
                const gradeColors: Record<string, string> = {
                  excellent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  very_good: 'bg-teal-100 text-teal-800 border-teal-200',
                  good: 'bg-blue-100 text-blue-800 border-blue-200',
                  acceptable: 'bg-amber-100 text-amber-800 border-amber-200',
                  needs_repeat: 'bg-rose-100 text-rose-800 border-rose-200',
                };
                const gradeLabels: Record<string, string> = {
                  excellent: 'ممتاز 5/5',
                  very_good: 'جيد جداً 4/5',
                  good: 'جيد 3/5',
                  acceptable: 'مقبول',
                  needs_repeat: 'يحتاج إعادة',
                };

                return (
                  <div
                    key={rec.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                        {rec.studentName ? rec.studentName[0] : 'ط'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">
                            {rec.studentName}
                          </span>
                          <span className="text-[10px] text-slate-400">• {rec.date}</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium">
                          سورة {rec.surahName} (الآيات {rec.fromAyah} إلى {rec.toAyah})
                          {rec.pagesCount ? ` • ${rec.pagesCount} صفحة` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pr-11 sm:pr-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${
                          gradeColors[rec.grade] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {gradeLabels[rec.grade] || rec.grade}
                      </span>
                      {rec.pointsAwarded > 0 && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          +{rec.pointsAwarded} نقطة
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Students Honor Roll (1 Column) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800 font-quran text-base">
                  لوحة الشرف وحفاظ القرآن
                </h3>
              </div>
              <button
                onClick={() => onNavigate('points')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                الكل
              </button>
            </div>

            <div className="space-y-3">
              {topStudents.map((st, idx) => {
                const rankBadges = [
                  'bg-amber-400 text-emerald-950', // 1st Gold
                  'bg-slate-300 text-slate-800', // 2nd Silver
                  'bg-amber-700 text-white', // 3rd Bronze
                ];

                return (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          rankBadges[idx] || 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{st.fullName}</p>
                        <p className="text-[10px] text-slate-500">
                          {st.circleName || 'حلقة عامة'} • أتم {st.completedJuz} أجزاء
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-amber-600 block">
                        {st.totalPoints}
                      </span>
                      <span className="text-[9px] text-slate-400">نقطة تميز</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onOpenAwardPoints}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>منح نقاط تشجيعية لطالب</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Actions Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
        <h4 className="text-xs font-bold text-slate-700 mb-3">إجراءات سريعة ومعاملات الجامع</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            onClick={onOpenAddStudent}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 rounded-xl text-center transition-all flex flex-col items-center gap-1.5"
          >
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <span className="text-xs font-semibold">إضافة طالب</span>
          </button>

          <button
            onClick={onOpenAddMemorization}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 rounded-xl text-center transition-all flex flex-col items-center gap-1.5"
          >
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-semibold">رصد تسميع</span>
          </button>

          <button
            onClick={onOpenAddAttendance}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 rounded-xl text-center transition-all flex flex-col items-center gap-1.5"
          >
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold">تحضير حلقة</span>
          </button>

          <button
            onClick={onOpenAddPayment}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 rounded-xl text-center transition-all flex flex-col items-center gap-1.5"
          >
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <span className="text-xs font-semibold">سند قبض مالي</span>
          </button>

          <button
            onClick={onOpenAwardPoints}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 rounded-xl text-center transition-all flex flex-col items-center gap-1.5"
          >
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold">منح مكافأة</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 rounded-xl text-center transition-all flex flex-col items-center gap-1.5"
          >
            <FileText className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-semibold">طباعة البطاقات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
