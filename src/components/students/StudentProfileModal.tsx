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
  X,
  User,
  BookOpen,
  CalendarCheck,
  Receipt,
  Award,
  FolderOpen,
  Printer,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Sparkles,
  Download,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  memorizationRecords: MemorizationRecord[];
  attendanceRecords: AttendanceRecord[];
  payments: PaymentRecord[];
  pointsLedger: PointRecord[];
  studentFiles: StudentFile[];
  currency?: string;
  onPrintCard: (student: Student) => void;
  onOpenAddPayment?: (student: Student) => void;
  onOpenAwardPoints?: (student: Student) => void;
  onOpenAddMemorization?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  memorizationRecords,
  attendanceRecords,
  payments,
  pointsLedger,
  studentFiles,
  currency = 'ر.س',
  onPrintCard,
  onOpenAddPayment,
  onOpenAwardPoints,
  onOpenAddMemorization,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'memorization' | 'attendance' | 'finance' | 'points' | 'files'
  >('overview');

  if (!isOpen || !student) return null;

  // Filter records specifically for this student
  const studentMems = memorizationRecords.filter((m) => m.studentId === student.id);
  const studentAtts = attendanceRecords.filter((a) => a.studentId === student.id);
  const studentPays = payments.filter((p) => p.studentId === student.id);
  const studentPts = pointsLedger.filter((pt) => pt.studentId === student.id);
  const files = studentFiles.filter((f) => f.studentId === student.id);

  // Compute attendance stats
  const presentCount = studentAtts.filter((a) => a.status === 'present').length;
  const lateCount = studentAtts.filter((a) => a.status === 'late').length;
  const absentCount = studentAtts.filter((a) => a.status === 'absent').length;
  const excusedCount = studentAtts.filter((a) => a.status === 'excused').length;
  const attTotal = studentAtts.length;
  const attRate = attTotal > 0 ? Math.round((presentCount / attTotal) * 100) : 100;

  // Total paid
  const totalPaid = studentPays.reduce((acc, p) => acc + (p.paidAmount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Dossier Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 font-bold flex items-center justify-center text-xl shadow-md border-2 border-amber-300">
                {student.fullName ? student.fullName[0] : 'ط'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-quran text-amber-300">
                    {student.fullName}
                  </h2>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      student.status === 'active'
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-slate-400/20 text-slate-300 border border-slate-400/30'
                    }`}
                  >
                    {student.status === 'active' ? 'طالب منتظم' : 'مؤرشف'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-emerald-200 font-mono">
                  <span className="bg-emerald-950/70 px-2 py-0.5 rounded text-amber-300 border border-emerald-700">
                    الرقم الأكاديمي: {student.studentNumber}
                  </span>
                  <span>• {student.circleName || 'غير مسند لحلقة'}</span>
                  <span>• {student.academicGrade}</span>
                </div>
              </div>
            </div>

            {/* Quick Action in Header */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => onPrintCard(student)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>طباعة بطاقة الطالب</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-emerald-700/60 text-center">
            <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800">
              <span className="text-[10px] text-emerald-300 block">الأجزاء المنجزة</span>
              <span className="text-sm font-bold text-amber-300">{student.completedJuz} / 30</span>
            </div>
            <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800">
              <span className="text-[10px] text-emerald-300 block">نسبة الحضور</span>
              <span className="text-sm font-bold text-amber-300">{attRate}%</span>
            </div>
            <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800">
              <span className="text-[10px] text-emerald-300 block">نقاط التميز</span>
              <span className="text-sm font-bold text-amber-300">{student.totalPoints}</span>
            </div>
            <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800">
              <span className="text-[10px] text-emerald-300 block">الرصيد المالي</span>
              <span className={`text-sm font-bold ${student.feeBalance > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {student.feeBalance} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Dossier Tabs Navigation */}
        <div className="flex items-center gap-1 px-4 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>البيانات وولي الأمر</span>
          </button>

          <button
            onClick={() => setActiveTab('memorization')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'memorization'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>سجل الحفظ ({studentMems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>الحضور والغياب ({studentAtts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'finance'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>المدفوعات والرسوم ({studentPays.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('points')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'points'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>النقاط والمكافآت ({studentPts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'files'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>المستندات والملفات ({files.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Details Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-emerald-900 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    البيانات الشخصية والدراسية
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">الاسم الكامل:</span>
                      <span className="font-semibold text-slate-800">{student.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">الرقم الأكاديمي الثابت:</span>
                      <span className="font-mono font-bold text-amber-700">{student.studentNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">الهوية الوطنية / الإقامة:</span>
                      <span className="font-mono text-slate-800">{student.nationalId || 'غير مسجل'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">المرحلة الدراسية:</span>
                      <span className="text-slate-800 font-medium">{student.academicGrade}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">تاريخ الميلاد:</span>
                      <span className="text-slate-800">{student.birthDate || 'غير مسجل'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">الحلقة المسندة:</span>
                      <span className="text-emerald-800 font-semibold">{student.circleName || 'عامة'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">البرنامج القرآني:</span>
                      <span className="text-slate-800">{student.program}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">تاريخ التسجيل بالجامع:</span>
                      <span className="text-slate-800">{new Date(student.registeredAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>

                {/* Guardian Details Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-emerald-900 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    بيانات ولي الأمر والاتصال في الطوارئ
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">اسم ولي الأمر:</span>
                      <span className="font-semibold text-slate-800">{student.guardianName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">صلة القرابة:</span>
                      <span className="text-slate-800">{student.guardianRelation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">جوال ولي الأمر (واتساب):</span>
                      <a
                        href={`https://wa.me/${student.guardianPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-emerald-700 hover:underline font-bold"
                      >
                        {student.guardianPhone}
                      </a>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">البريد الإلكتروني:</span>
                      <span className="text-slate-800 font-mono">{student.guardianEmail || 'غير مسجل'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">المهنة:</span>
                      <span className="text-slate-800">{student.guardianJob || 'غير مسجل'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">عنوان السكن:</span>
                      <span className="text-slate-800">{student.address || 'حي الفرقان'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs">
                <span className="font-bold text-amber-900 block mb-1">ملاحظات وتوجيهات خاصة:</span>
                <p className="text-slate-700 leading-relaxed">
                  {student.notes || 'لا توجد ملاحظات إضافية مسجلة.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MEMORIZATION */}
          {activeTab === 'memorization' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  سجل تسميع القرآن الكريم والمراجعة ({studentMems.length} جلسة)
                </h4>
                {onOpenAddMemorization && (
                  <button
                    onClick={() => onOpenAddMemorization(student)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-300" />
                    <span>رصد تسميع جديد</span>
                  </button>
                )}
              </div>

              {studentMems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  لم يتم تسجيل جلسات تسميع لهذا الطالب حتى الآن.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">النوع</th>
                        <th className="p-3">السورة والمقدار</th>
                        <th className="p-3">الإتقان</th>
                        <th className="p-3">التقدير</th>
                        <th className="p-3">ملاحظات المعلم والواجب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentMems.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-3 whitespace-nowrap text-slate-600 font-mono">{m.date}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                              {m.type === 'new_memorization' ? 'حفظ جديد' : 'مراجعة'}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-900">
                            سورة {m.surahName} (الآيات {m.fromAyah} إلى {m.toAyah})
                          </td>
                          <td className="p-3">
                            <span className="text-amber-500 font-bold">★ {m.masteryScore}/5</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-emerald-800">{m.grade}</span>
                          </td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">
                            {m.teacherNotes || m.nextAssignment || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              {/* Summary Badges */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-800 font-bold">
                  <span>حاضر: {presentCount}</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-800 font-bold">
                  <span>متأخر: {lateCount}</span>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-800 font-bold">
                  <span>غائب: {absentCount}</span>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-blue-800 font-bold">
                  <span>معذور: {excusedCount}</span>
                </div>
              </div>

              {studentAtts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  لا توجد سجلات حضور مسجلة لهذا الطالب حتى الآن.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3">التفاصيل / العذر</th>
                        <th className="p-3">المحضر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentAtts.map((a) => {
                        const statusColors: Record<string, string> = {
                          present: 'bg-emerald-100 text-emerald-800',
                          absent: 'bg-rose-100 text-rose-800',
                          late: 'bg-amber-100 text-amber-800',
                          excused: 'bg-blue-100 text-blue-800',
                        };
                        const statusLabels: Record<string, string> = {
                          present: 'حاضر',
                          absent: 'غائب',
                          late: 'متأخر',
                          excused: 'معذور',
                        };
                        return (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-slate-700">{a.date}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  statusColors[a.status] || 'bg-slate-100'
                                }`}
                              >
                                {statusLabels[a.status] || a.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">
                              {a.status === 'late'
                                ? `تأخر ${a.lateMinutes || 0} دقيقة`
                                : a.excuseReason || '—'}
                            </td>
                            <td className="p-3 text-slate-400">{a.markedBy || 'معلم الحلقة'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    السجل المالي وإيصالات القبض (المسدد: {totalPaid} {currency})
                  </h4>
                  <p className="text-[11px] text-rose-600 font-semibold">
                    الرصيد المتبقي المستحق: {student.feeBalance} {currency}
                  </p>
                </div>
                {onOpenAddPayment && (
                  <button
                    onClick={() => onOpenAddPayment(student)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-300" />
                    <span>سند قبض / سداد</span>
                  </button>
                )}
              </div>

              {studentPays.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  لا توجد حركات سداد مسجلة.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">رقم الإيصال</th>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">النوع</th>
                        <th className="p-3">المبلغ المسدد</th>
                        <th className="p-3">طريقة الدفع</th>
                        <th className="p-3">المستلم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentPays.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-emerald-800">{p.receiptNumber}</td>
                          <td className="p-3 text-slate-600">{new Date(p.createdAt).toLocaleDateString('ar-SA')}</td>
                          <td className="p-3">{p.type}</td>
                          <td className="p-3 font-bold text-slate-800">
                            {p.paidAmount} {currency}
                          </td>
                          <td className="p-3 text-slate-600">{p.paymentMethod}</td>
                          <td className="p-3 text-slate-400">{p.collectedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: POINTS */}
          {activeTab === 'points' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    رصيد نقاط التميز: <span className="text-amber-600 text-base">{student.totalPoints}</span> نقطة
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    سجل تاريخي بكل عمليات المنح والخصم لمنع التكرار
                  </p>
                </div>
                {onOpenAwardPoints && (
                  <button
                    onClick={() => onOpenAwardPoints(student)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>منح نقاط تشجيعية</span>
                  </button>
                )}
              </div>

              {studentPts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  لا توجد حركات نقاط مسجلة حتى الآن.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3">النوع</th>
                        <th className="p-3">النقاط</th>
                        <th className="p-3">السبب والتفاصيل</th>
                        <th className="p-3">المانح</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentPts.map((pt) => (
                        <tr key={pt.id} className="hover:bg-slate-50">
                          <td className="p-3 text-slate-600">{new Date(pt.createdAt).toLocaleDateString('ar-SA')}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pt.type === 'add'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {pt.type === 'add' ? 'إضافة' : 'خصم'}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            <span className={pt.type === 'add' ? 'text-emerald-700' : 'text-rose-700'}>
                              {pt.type === 'add' ? `+${pt.points}` : `-${pt.points}`}
                            </span>
                          </td>
                          <td className="p-3 text-slate-800">{pt.reason}</td>
                          <td className="p-3 text-slate-400">{pt.awardedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FILES */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  الملفات والمستندات الرسمية والشهادات ({files.length} ملف)
                </h4>
              </div>

              {files.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  لم يتم رفع ملفات لهذا الطالب بعد. يمكنك رفع الشهادات ونماذج القبول من قسم «ملفات ومستندات الطلاب».
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <FolderOpen className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">{file.fileName}</p>
                          <p className="text-[10px] text-slate-500">
                            {file.category} • {(file.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <a
                          href={file.downloadUrl}
                          download={file.fileName}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="تنزيل / معاينة"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            تم تسجيل القيد بنظام الفرقان القرآني الموثق
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
