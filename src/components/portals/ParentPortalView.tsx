import React, { useState } from 'react';
import {
  Student,
  MemorizationRecord,
  AttendanceRecord,
  PaymentRecord,
  PointRecord,
  StudentFile,
} from '../../types';
import {
  Users,
  BookOpen,
  CalendarCheck,
  Receipt,
  Award,
  Phone,
  Printer,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle,
  Star,
  Search,
  MessageCircle,
} from 'lucide-react';

interface ParentPortalViewProps {
  students: Student[];
  memorizationRecords: MemorizationRecord[];
  attendanceRecords: AttendanceRecord[];
  payments: PaymentRecord[];
  pointsLedger: PointRecord[];
  studentFiles: StudentFile[];
  currency?: string;
  onPrintCard: (student: Student) => void;
  onPrintReceipt: (payment: PaymentRecord) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  memorizationRecords,
  attendanceRecords,
  payments,
  pointsLedger,
  studentFiles,
  currency = 'ر.س',
  onPrintCard,
  onPrintReceipt,
}) => {
  const activeStudents = students.filter((s) => s.status === 'active');
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    activeStudents[0]?.id || students[0]?.id || ''
  );

  // Filter students if parent entered their mobile number
  const matchingStudents = searchPhone.trim()
    ? students.filter(
        (s) =>
          s.guardianPhone.includes(searchPhone.trim()) ||
          s.phone?.includes(searchPhone.trim()) ||
          s.nationalId?.includes(searchPhone.trim())
      )
    : students;

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) ||
    matchingStudents[0] ||
    students[0];

  const studentMems = memorizationRecords.filter((m) => m.studentId === currentStudent?.id);
  const studentAtts = attendanceRecords.filter((a) => a.studentId === currentStudent?.id);
  const studentPays = payments.filter((p) => p.studentId === currentStudent?.id);
  const studentPts = pointsLedger.filter((pt) => pt.studentId === currentStudent?.id);
  const files = studentFiles.filter((f) => f.studentId === currentStudent?.id);

  // Attendance rate
  const presentCount = studentAtts.filter((a) => a.status === 'present').length;
  const attTotal = studentAtts.length;
  const attRate = attTotal > 0 ? Math.round((presentCount / attTotal) * 100) : 100;

  // Latest recitation
  const latestRecitation = studentMems[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-purple-800/70 border border-purple-700 text-amber-300">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs bg-purple-800/80 text-purple-200 px-3 py-1 rounded-full font-bold">
              بوابة ولي الأمر الرسمية
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-quran text-amber-300">
            متابعة الأبناء في مجمع حلقات جامع سعيد الجابي
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            نافذة مخصصة لأولياء الأمور الكرام لمتابعة الحفظ اليومي، سجلات الحضور والانضباط،
            والسندات المالية ونقاط التميز السلوكي لأبنائهم المسجلين.
          </p>
        </div>

        {/* Quick Phone Filter for Parent */}
        <div className="bg-purple-900/50 backdrop-blur-xs p-3 rounded-2xl border border-purple-700/60 flex flex-col gap-2 min-w-[260px]">
          <span className="text-[11px] text-purple-200 font-medium">بحث بأرقام الأبناء:</span>
          <div className="relative">
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="أدخل جوال ولي الأمر أو الهوية..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-purple-950/80 border border-purple-700 rounded-xl text-white placeholder-purple-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-2.5" />
          </div>
          {searchPhone && (
            <span className="text-[10px] text-amber-300 font-semibold">
              تم العثور على {matchingStudents.length} ابن/ابنة
            </span>
          )}
        </div>
      </div>

      {/* Children Selector Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-xs text-slate-800 mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-purple-700" />
          <span>اختر الابن / الطالب المراد استعراض تقريره:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {matchingStudents.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStudentId(st.id)}
              className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                currentStudent?.id === st.id
                  ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                  : 'border-slate-200 hover:border-purple-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-quran text-base ${
                    currentStudent?.id === st.id
                      ? 'bg-purple-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {st.fullName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{st.fullName}</h4>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {st.studentNumber} • {st.circleName || 'الحلقة'}
                  </span>
                </div>
              </div>
              {currentStudent?.id === st.id && (
                <span className="w-2 h-2 rounded-full bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {currentStudent && (
        <>
          {/* Student Status Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">الحفظ المتقن</span>
              <span className="text-xl font-bold font-quran text-emerald-800 mt-1 block">
                {currentStudent.completedJuz} أجزاء
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                السورة الحالية: {currentStudent.currentSurah || 'جزء عم'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">نسبة الالتزام بالحضور</span>
              <span className="text-xl font-bold font-mono text-slate-800 mt-1 block">
                %{attRate}
              </span>
              <span className="text-[10px] text-slate-500">
                حضر {presentCount} من إجمالي {attTotal} جلسة
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">رصيد نقاط التميز</span>
              <span className="text-xl font-bold font-mono text-amber-600 mt-1 block flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {currentStudent.totalPoints} نقطة
              </span>
              <span className="text-[10px] text-amber-700">مكافآت السلوك والحفظ</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">الرصيد المالي المتبقي</span>
              <span
                className={`text-xl font-bold font-mono mt-1 block ${
                  currentStudent.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {currentStudent.feeBalance} {currency}
              </span>
              <span className="text-[10px] text-slate-500">
                {currentStudent.feeBalance > 0 ? 'يرجى سداد الاشتراك' : 'كافة الرسوم مسددة'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50/70 p-4 rounded-2xl border border-purple-200 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-purple-950">
                معلم حلقة الابن: {currentStudent.circleName || 'حلقة الحفظ'}
              </span>
              <span className="text-purple-700 text-[11px]">
                ولي الأمر المسجل: {currentStudent.guardianName} ({currentStudent.guardianPhone})
              </span>
            </div>

            <button
              onClick={() => onPrintCard(currentStudent)}
              className="px-3.5 py-1.5 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة بطاقة الطالب الرسمية</span>
            </button>
          </div>

          {/* Split Sections: Memorization & Financials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Daily Recitation Log */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-xs text-slate-800">
                    سجل التسميع والمراجعة اليومي الأخير
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {studentMems.length} جلسة
                </span>
              </div>

              {studentMems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  لم يتم رصد جلسات تسميع حتى الآن
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {studentMems.slice(0, 5).map((mem) => (
                    <div key={mem.id} className="p-4 text-xs hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-emerald-950">
                          سورة {mem.surahName} (الآيات {mem.fromAyah} - {mem.toAyah})
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(mem.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                          إتقان: {mem.masteryScore}/5
                        </span>
                        <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium">
                          تجويد: {mem.tajweedScore}/5
                        </span>
                        <span className="text-slate-500">
                          {mem.type === 'new_memorization' ? 'حفظ جديد' : 'مراجعة وتثبيت'} ({mem.pagesCount} صفحات)
                        </span>
                      </div>
                      {mem.teacherNotes && (
                        <p className="text-[11px] text-slate-600 bg-slate-100/70 p-2 rounded-lg mt-2">
                          <strong>ملاحظة المعلم:</strong> {mem.teacherNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Receipts & Payments */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-xs text-slate-800">
                    سندات القبض والمدفوعات المسددة
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {studentPays.length} سند
                </span>
              </div>

              {studentPays.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  لا توجد سندات قبض مسجلة حتى الآن
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {studentPays.map((pay) => (
                    <div
                      key={pay.id}
                      className="p-4 text-xs flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-900 text-xs">
                            {pay.receiptNumber}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {pay.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(pay.createdAt).toLocaleDateString('ar-SA')} • طريقة الدفع:{' '}
                          {pay.paymentMethod}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">
                          {pay.paidAmount} {currency}
                        </span>
                        <button
                          onClick={() => onPrintReceipt(pay)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="طباعة السند"
                        >
                          <Printer className="w-4 h-4 text-emerald-800" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
