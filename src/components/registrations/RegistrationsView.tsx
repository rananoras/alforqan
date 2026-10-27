import React, { useState } from 'react';
import { Registration, Circle } from '../../types';
import {
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  Phone,
  Sparkles,
  KeyRound,
  Copy,
  GraduationCap,
} from 'lucide-react';

interface RegistrationsViewProps {
  registrations: Registration[];
  circles: Circle[];
  onReviewRegistration: (
    regId: string,
    status: 'approved' | 'rejected' | 'waitlist',
    decisionNotes: string,
    circleId?: string,
    circleName?: string
  ) => Promise<void>;
  onOpenNewRegistration: () => void;
}

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({
  registrations,
  circles,
  onReviewRegistration,
  onOpenNewRegistration,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const filteredRegistrations = registrations.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleOpenReview = (reg: Registration) => {
    setSelectedReg(reg);
    setSelectedCircleId(reg.preferredCircleId || circles[0]?.id || '');
    setDecisionNotes('');
    setReviewModalOpen(true);
  };

  const handleDecision = async (status: 'approved' | 'rejected' | 'waitlist') => {
    if (!selectedReg) return;
    try {
      setSubmitting(true);
      const chosenCircle = circles.find((c) => c.id === selectedCircleId);
      await onReviewRegistration(
        selectedReg.id,
        status,
        decisionNotes,
        selectedCircleId,
        chosenCircle?.name
      );
      setReviewModalOpen(false);
      setSelectedReg(null);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ القرار');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-800" />
            <span>طلبات التسجيل وقبول الطلاب وتوليد الأكواد</span>
          </h2>
          <p className="text-xs text-slate-500">
            مراجعة طلبات الطلاب المسجلة بالاسم والعمر والرقم التعريفي، واعتماد القبول مع توليد كود خاص بكل طالب
          </p>
        </div>

        <button
          onClick={onOpenNewRegistration}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>تقديم طلب تسجيل جديد</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs">
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            filterStatus === 'pending'
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>طلبات قيد المراجعة والقبول ({registrations.filter((r) => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            filterStatus === 'approved'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>الطلاب المقبولون والأكواد المولدّة ({registrations.filter((r) => r.status === 'approved').length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            filterStatus === 'rejected'
              ? 'bg-rose-100 text-rose-900 border border-rose-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>المرفوضة ({registrations.filter((r) => r.status === 'rejected').length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          الكل ({registrations.length})
        </button>
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا توجد طلبات تسجيل في هذه الفئة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">تاريخ التقديم</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">العمر</th>
                  <th className="p-3.5">الرقم التعريفي المستخدم</th>
                  <th className="p-3.5">كود الطالب المولد</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراء الإدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((reg) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-100 text-amber-800 border-amber-200',
                    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    rejected: 'bg-rose-100 text-rose-800 border-rose-200',
                    waitlist: 'bg-blue-100 text-blue-800 border-blue-200',
                  };
                  const statusLabels: Record<string, string> = {
                    pending: '⏳ قيد المراجعة',
                    approved: '✓ مقبول (تم توليد الكود)',
                    rejected: 'مرفوض',
                    waitlist: 'قائمة الانتظار',
                  };

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(reg.submittedAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {reg.studentFullName}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {reg.studentAge ? `${reg.studentAge} سنة` : reg.academicGrade || '-'}
                      </td>
                      <td className="p-3.5 font-mono text-emerald-800 font-bold">
                        {reg.adminRegistrationCode || 'JABY-2026'}
                      </td>
                      <td className="p-3.5">
                        {reg.generatedStudentCode ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-950 border border-emerald-300 rounded font-mono font-bold text-xs">
                            <span>{reg.generatedStudentCode}</span>
                            <button
                              onClick={() => copyCode(reg.generatedStudentCode!, reg.id)}
                              title="نسخ كود الطالب"
                              className="text-emerald-700 hover:text-emerald-950"
                            >
                              {copiedCodeId === reg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">يتم التوليد عند القبول</span>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                            statusColors[reg.status] || 'bg-slate-100'
                          }`}
                        >
                          {statusLabels[reg.status] || reg.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleOpenReview(reg)}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors inline-flex items-center gap-1 ${
                            reg.status === 'pending'
                              ? 'bg-amber-500 hover:bg-amber-400 text-emerald-950 shadow-xs'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{reg.status === 'pending' ? 'مراجعة وقبول الطالب' : 'عرض التفاصيل'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Decision Modal */}
      {reviewModalOpen && selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">مراجعة واعتماد طلب الطالب: {selectedReg.studentFullName}</h3>
                <span className="text-[11px] text-emerald-200">
                  تاريخ التقديم: {new Date(selectedReg.submittedAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Applicant Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">اسم الطالب الكامل:</span>
                  <strong className="text-slate-900 text-sm">{selectedReg.studentFullName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">العمر:</span>
                  <strong className="text-slate-900 text-sm">
                    {selectedReg.studentAge ? `${selectedReg.studentAge} سنة` : selectedReg.academicGrade || 'غير محدد'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">الرقم التعريفي المخصص من الإدارة:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {selectedReg.adminRegistrationCode || 'JABY-2026'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">رقم التواصل / الجوال:</span>
                  <span className="font-mono text-slate-700">
                    {selectedReg.phone || selectedReg.guardianPhone || 'لم يحدد'}
                  </span>
                </div>
              </div>

              {/* Generated Code if already approved */}
              {selectedReg.status === 'approved' && selectedReg.generatedStudentCode && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-emerald-800 font-bold block">
                    ✓ تم قبول الطالب وتوليد الكود الأكاديمي الخاص به:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-bold text-emerald-950">
                      {selectedReg.generatedStudentCode}
                    </span>
                    <button
                      onClick={() => copyCode(selectedReg.generatedStudentCode!, selectedReg.id)}
                      className="px-3 py-1 bg-white border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      {copiedCodeId === selectedReg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCodeId === selectedReg.id ? 'تم النسخ' : 'نسخ الكود'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Assignment Circle */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>تخصيص الحلقة القرآنية للطالب عند القبول:</span>
                </label>
                <select
                  value={selectedCircleId}
                  onChange={(e) => setSelectedCircleId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {circles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — المعلم: {c.teacherName} ({c.timing})
                    </option>
                  ))}
                </select>
              </div>

              {/* Decision Notes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  توجيهات أو ملاحظات الإدارة (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="ملاحظات القبول، أو توجيه الطالب لمستوى معين..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Decision Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إغلاق
                </button>

                {selectedReg.status !== 'approved' && (
                  <>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleDecision('rejected')}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>رفض الطلب</span>
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleDecision('approved')}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{submitting ? 'جارٍ توليد الكود...' : 'قبول الطالب وتوليد كود خاص به فوراً'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
