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
  BookOpen,
  User,
  CalendarCheck,
  Receipt,
  Award,
  FolderOpen,
  Printer,
  Sparkles,
  Phone,
  Clock,
  Download,
  Star,
  CheckCircle,
} from 'lucide-react';

interface StudentPortalViewProps {
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

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    activeStudents[0]?.id || students[0]?.id || ''
  );

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  const studentMems = memorizationRecords.filter((m) => m.studentId === student?.id);
  const studentAtts = attendanceRecords.filter((a) => a.studentId === student?.id);
  const studentPays = payments.filter((p) => p.studentId === student?.id);
  const studentPts = pointsLedger.filter((pt) => pt.studentId === student?.id);
  const files = studentFiles.filter((f) => f.studentId === student?.id);

  // Latest memorization session & assignment
  const latestSession = studentMems[0];

  // Attendance stats
  const presentCount = studentAtts.filter((a) => a.status === 'present').length;
  const attTotal = studentAtts.length;
  const attRate = attTotal > 0 ? Math.round((presentCount / attTotal) * 100) : 100;

  if (!student) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
        لم يتم العثور على سجلات للطلاب بعد. يرجى تقديم طلب تسجيل أو مراجعة إدارة الجامع.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Switcher (If multiple siblings/students) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-500 font-semibold block">بوابة الطالب وولي الأمر</span>
          <h2 className="text-base sm:text-lg font-bold font-quran text-slate-800">
            ملف متابعة الطالب: {student.fullName}
          </h2>
        </div>

        {students.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium whitespace-nowrap">تبديل الطالب:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-emerald-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Student Profile Identity Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-lg border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 font-bold text-2xl flex items-center justify-center shadow-md border-2 border-white">
            {student.fullName ? student.fullName[0] : 'ط'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold font-quran text-amber-300">
                {student.fullName}
              </h3>
              <span className="text-[10px] bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-600">
                {student.program}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-emerald-200">
              <span className="font-mono bg-emerald-950/70 text-amber-300 px-2 py-0.5 rounded border border-emerald-700">
                الرقم الأكاديمي: {student.studentNumber}
              </span>
              <span>• الحلقة: {student.circleName || 'حلقة الحفظ العام'}</span>
              <span>• {student.academicGrade}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onPrintCard(student)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة بطاقة الطالب</span>
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">الأجزاء المنجزة</span>
          <span className="text-2xl font-bold text-amber-600">{student.completedJuz} / 30</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">جزء قرآني محفوظ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">نسبة الالتزام والحضور</span>
          <span className="text-2xl font-bold text-emerald-700">{attRate}%</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">مواظبة ممتازة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">نقاط التميز المكتسبة</span>
          <span className="text-2xl font-bold text-purple-700">{student.totalPoints}</span>
          <span className="text-[10px] text-purple-600 block mt-0.5">نقطة تميز سلوكية وحفظية</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">الرصيد المالي المتبقي</span>
          <span
            className={`text-2xl font-bold ${
              student.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {student.feeBalance} <span className="text-xs font-normal">{currency}</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {student.feeBalance > 0 ? 'مستحق السداد' : 'لا توجد مستحقات'}
          </span>
        </div>
      </div>

      {/* Tomorrow's Plan & Latest Recitation */}
      {latestSession && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-700" />
            <h4 className="font-bold text-sm text-amber-950 font-quran">
              واجب الغد وخطة الحفظ القادمة
            </h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200 text-xs text-slate-800 space-y-2">
            <p className="font-bold text-emerald-900">
              {latestSession.nextAssignment || 'مواصلة حفظ السورة المقررة والمراجعة اليومية المنتظمة.'}
            </p>
            {latestSession.teacherNotes && (
              <p className="text-slate-600 text-[11px]">
                <strong>توجيه المعلم:</strong> {latestSession.teacherNotes}
              </p>
            )}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
              <span>آخر تسميع: سورة {latestSession.surahName} (الآيات {latestSession.fromAyah}-{latestSession.toAyah})</span>
              <span>• التاريخ: {latestSession.date}</span>
              <span>• الإتقان: ★ {latestSession.masteryScore}/5</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Memorization History & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memorization History */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2 font-quran">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>سجل جلسات التسميع والمراجعة ({studentMems.length})</span>
            </h4>
          </div>

          {studentMems.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-xs">لا توجد جلسات مسجلة بعد.</p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {studentMems.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">
                      سورة {m.surahName} (الآيات {m.fromAyah} إلى {m.toAyah})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {m.date} • {m.type === 'new_memorization' ? 'حفظ جديد' : 'مراجعة'}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-amber-500 font-bold block">★ {m.masteryScore}/5</span>
                    <span className="text-[10px] text-emerald-800 font-semibold">{m.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance Log */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2 font-quran">
              <CalendarCheck className="w-4 h-4 text-blue-800" />
              <span>سجل الحضور والغياب والانضباط ({studentAtts.length})</span>
            </h4>
          </div>

          {studentAtts.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-xs">لا توجد سجلات حضور مسجلة بعد.</p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {studentAtts.map((a) => {
                const statusBadges: Record<string, { label: string; style: string }> = {
                  present: { label: 'حاضر', style: 'bg-emerald-100 text-emerald-800' },
                  absent: { label: 'غائب', style: 'bg-rose-100 text-rose-800' },
                  late: { label: `متأخر (${a.lateMinutes || 0} دقيقة)`, style: 'bg-amber-100 text-amber-800' },
                  excused: { label: `معذور (${a.excuseReason || 'عذر'})`, style: 'bg-blue-100 text-blue-800' },
                };
                const badge = statusBadges[a.status] || { label: a.status, style: 'bg-slate-100' };

                return (
                  <div
                    key={a.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-slate-700 font-medium block">{a.date}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.style}`}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Payments & Files */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tuition & Receipts */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2 font-quran">
              <Receipt className="w-4 h-4 text-emerald-800" />
              <span>إيصالات وسندات القبض المسددة ({studentPays.length})</span>
            </h4>
          </div>

          {studentPays.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-xs">لا توجد إيصالات سداد مسجلة.</p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {studentPays.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-emerald-900 block">{p.receiptNumber}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString('ar-SA')} • {p.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {p.paidAmount} {currency}
                    </span>
                    <button
                      onClick={() => onPrintReceipt(p)}
                      className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold"
                      title="طباعة السند"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificates & Files */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2 font-quran">
              <FolderOpen className="w-4 h-4 text-purple-800" />
              <span>الشهادات والمستندات الخاصة بالطالب ({files.length})</span>
            </h4>
          </div>

          {files.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-xs">لا توجد ملفات أو شهادات مرفوعة بعد.</p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-800 block truncate">{f.fileName}</span>
                    <span className="text-[10px] text-slate-400">
                      {f.category} • {(f.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <a
                    href={f.downloadUrl}
                    download={f.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg"
                    title="تنزيل الشهادة أو المستند"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
