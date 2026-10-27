import React, { useState } from 'react';
import { Registration, Student, Circle, StudentFile } from '../../types';
import {
  Users,
  UserPlus,
  ClipboardCheck,
  FolderOpen,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Upload,
  Edit,
  Eye,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface StaffPortalViewProps {
  registrations: Registration[];
  students: Student[];
  circles: Circle[];
  studentFiles: StudentFile[];
  onReviewRegistration: (
    regId: string,
    status: 'approved' | 'rejected' | 'waitlist',
    decisionNotes: string,
    circleId?: string,
    circleName?: string
  ) => Promise<void>;
  onOpenNewRegistration: () => void;
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onOpenUploadModal: (student?: Student) => void;
  onPrintCard: (student: Student) => void;
}

export const StaffPortalView: React.FC<StaffPortalViewProps> = ({
  registrations,
  students,
  circles,
  studentFiles,
  onReviewRegistration,
  onOpenNewRegistration,
  onOpenAddStudent,
  onOpenEditStudent,
  onViewStudent,
  onOpenUploadModal,
  onPrintCard,
}) => {
  const [activeTab, setActiveTab] = useState<'registrations' | 'students' | 'files'>('registrations');
  const [regFilter, setRegFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingReg, setReviewingReg] = useState<Registration | null>(null);
  const [assignedCircleId, setAssignedCircleId] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  // Filtered registrations
  const filteredRegs = registrations.filter((r) => {
    const matchesFilter = regFilter === 'all' || r.status === regFilter;
    const matchesSearch =
      r.studentFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.guardianName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.guardianPhone || '').includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Filtered students
  const filteredStudents = students.filter(
    (s) =>
      s.status !== 'archived' &&
      (s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.guardianPhone.includes(searchTerm))
  );

  const handleApprove = async () => {
    if (!reviewingReg) return;
    try {
      setSubmittingReview(true);
      const circleObj = circles.find((c) => c.id === assignedCircleId);
      await onReviewRegistration(
        reviewingReg.id,
        'approved',
        reviewNotes,
        assignedCircleId,
        circleObj?.name
      );
      setReviewingReg(null);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReject = async () => {
    if (!reviewingReg) return;
    try {
      setSubmittingReview(true);
      await onReviewRegistration(reviewingReg.id, 'rejected', reviewNotes);
      setReviewingReg(null);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-teal-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-teal-800/70 border border-teal-700 text-amber-300">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <span className="text-xs bg-teal-800/80 text-teal-200 px-3 py-1 rounded-full font-bold">
              بوابة شؤون الطلاب والقبول والتسجيل
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-quran text-amber-300">
            إدارة قبول الطلاب، السجلات الأكاديمية والمستندات
          </h1>
          <p className="text-xs text-teal-100 mt-1 max-w-xl">
            مراجعة واعتماد طلبات التسجيل الجديدة، إصدار الأرقام الأكاديمية الموحدة، وتحديث بيانات
            الطلاب ورفع ملفاتهم ومستنداتهم الثبوتية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewRegistration}
            className="px-4 py-2 bg-teal-800/80 hover:bg-teal-700 border border-teal-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>تسجيل طالب جديد</span>
          </button>

          <button
            onClick={() => onOpenUploadModal()}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-emerald-950" />
            <span>رفع مستند لطالب</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">طلبات التسجيل المعلقة</span>
            <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">
              {pendingCount}
            </span>
            <span className="text-[10px] text-amber-700 font-medium">بانتظار المراجعة والاعتماد</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">الطلاب المسجلون النشطون</span>
            <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
              {students.filter((s) => s.status === 'active').length}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">بحلقات جامع سعيد الجابي</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">الملفات والمستندات المرفوعة</span>
            <span className="text-2xl font-bold font-mono text-teal-700 mt-1 block">
              {studentFiles.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">شهادات، هويات، وتقارير</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs text-xs">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`py-3 px-4 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'registrations'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-teal-700" />
          <span>طلبات التسجيل الجديدة</span>
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`py-3 px-4 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'students'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-700" />
          <span>سجل الطلاب والبطاقات ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`py-3 px-4 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'files'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-teal-700" />
          <span>أرشيف المستندات والملفات ({studentFiles.length})</span>
        </button>
      </div>

      {/* TAB 1: REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم المتقدم، ولي الأمر، الهاتف..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRegFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    regFilter === st
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st === 'pending'
                    ? `بانتظار المراجعة (${pendingCount})`
                    : st === 'approved'
                    ? 'المقبولة'
                    : st === 'rejected'
                    ? 'المرفوضة'
                    : 'الكل'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">اسم المتقدم</th>
                  <th className="p-3.5">تاريخ التقديم</th>
                  <th className="p-3.5">المرحلة الدراسية</th>
                  <th className="p-3.5">البرنامج المطلوب</th>
                  <th className="p-3.5">ولي الأمر</th>
                  <th className="p-3.5">رقم الجوال</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegs.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{reg.studentFullName}</td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {new Date(reg.submittedAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-3.5 text-slate-700">{reg.academicGrade}</td>
                    <td className="p-3.5">
                      <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {reg.program}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700">{reg.guardianName}</td>
                    <td className="p-3.5 font-mono text-emerald-800">{reg.guardianPhone}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reg.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : reg.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {reg.status === 'pending'
                          ? 'قيد الانتظار'
                          : reg.status === 'approved'
                          ? 'معتمد ومقبول'
                          : 'مرفوض'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {reg.status === 'pending' ? (
                        <button
                          onClick={() => {
                            setReviewingReg(reg);
                            setAssignedCircleId(reg.preferredCircleId || circles[0]?.id || '');
                            setReviewNotes('');
                          }}
                          className="px-3 py-1 bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                        >
                          مراجعة واعتماد
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">تم الإجراء</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم الطالب، رقمه الأكاديمي، جوال ولي أمره..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              onClick={onOpenAddStudent}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة طالب مباشر</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الرقم الأكاديمي</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">المرحلة</th>
                  <th className="p-3.5">الحلقة القرآنية</th>
                  <th className="p-3.5">ولي الأمر</th>
                  <th className="p-3.5">رقم التواصل</th>
                  <th className="p-3.5 text-center">إجراءات شؤون الطلاب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-700">{st.studentNumber}</td>
                    <td className="p-3.5 font-bold text-slate-900">{st.fullName}</td>
                    <td className="p-3.5 text-slate-600">{st.academicGrade}</td>
                    <td className="p-3.5 text-slate-700">{st.circleName || 'غير مسند'}</td>
                    <td className="p-3.5 text-slate-700">{st.guardianName}</td>
                    <td className="p-3.5 font-mono text-emerald-800">{st.guardianPhone}</td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewStudent(st)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="الملف الشامل"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-800" />
                        </button>
                        <button
                          onClick={() => onOpenEditStudent(st)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="تعديل البيانات"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-700" />
                        </button>
                        <button
                          onClick={() => onOpenUploadModal(st)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="رفع مستند"
                        >
                          <Upload className="w-3.5 h-3.5 text-teal-700" />
                        </button>
                        <button
                          onClick={() => onPrintCard(st)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="طباعة البطاقة"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FILES ARCHIVE */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-teal-700" />
              <span>أرشيف الوثائق والمستندات الثبوتية</span>
            </h3>

            <button
              onClick={() => onOpenUploadModal()}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع مستند جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {studentFiles.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50/60 transition-all flex items-start justify-between"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-800 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{f.fileName}</h4>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      طالب: {f.studentName}
                    </span>
                    <span className="text-[10px] text-teal-700 block">
                      التصنيف: {f.category}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono mt-0.5">
                      {new Date(f.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>

                <a
                  href={f.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg"
                >
                  معاينة
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review & Approve Registration Modal */}
      {reviewingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 p-6 text-right animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-slate-900 mb-2 font-quran flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-teal-700" />
              <span>مراجعة طلب التسجيل: {reviewingReg.studentFullName}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              عند قبول الطلب سيتم تلقائياً إصدار رقم أكاديمي فريد وثابت للطالب وإضافته لقائمة طلاب الجامع.
            </p>

            <div className="space-y-3 text-xs mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">ولي الأمر:</span>
                <span className="font-bold text-slate-800">{reviewingReg.guardianName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الجوال:</span>
                <span className="font-mono text-emerald-800">{reviewingReg.guardianPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المرحلة والبرنامج:</span>
                <span className="font-semibold text-teal-900">
                  {reviewingReg.academicGrade} - {reviewingReg.program}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تسكين الطالب في الحلقة القرآنية:
                </label>
                <select
                  value={assignedCircleId}
                  onChange={(e) => setAssignedCircleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  {circles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.teacherName}) - {c.timing}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ملاحظات القبول / الرفض:
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="ملاحظات توجيهية خاصة بالطالب..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setReviewingReg(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={handleReject}
                disabled={submittingReview}
                className="px-4 py-2 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200"
              >
                رفض الطلب
              </button>
              <button
                onClick={handleApprove}
                disabled={submittingReview}
                className="px-4 py-2 text-xs bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm"
              >
                {submittingReview ? 'جاري الاعتماد...' : 'اعتماد وقبول الطالب'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
