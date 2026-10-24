import React, { useState } from 'react';
import { Registration, Circle } from '../../types';
import {
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  Home,
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

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-800" />
            <span>طلبات التسجيل في جامع الفرقان وحلقات القرآن</span>
          </h2>
          <p className="text-xs text-slate-500">
            مراجعة طلبات الانضمام للجامع، وتخصيص الحلقات، وإصدار أرقام القبول الثابتة
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
          <span>طلبات قيد المراجعة ({registrations.filter((r) => r.status === 'pending').length})</span>
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
          <span>المقبولة ({registrations.filter((r) => r.status === 'approved').length})</span>
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
                  <th className="p-3.5">تاريخ الطلب</th>
                  <th className="p-3.5">اسم المتقدم</th>
                  <th className="p-3.5">المرحلة الدراسية</th>
                  <th className="p-3.5">البرنامج المطلوب</th>
                  <th className="p-3.5">ولي الأمر</th>
                  <th className="p-3.5">جوال التواصل</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراء</th>
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
                    pending: 'قيد المراجعة',
                    approved: 'تم القبول والاعتماد',
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
                      <td className="p-3.5 text-slate-600">{reg.academicGrade}</td>
                      <td className="p-3.5 font-medium text-emerald-900">{reg.program}</td>
                      <td className="p-3.5 text-slate-700">{reg.guardianName} ({reg.guardianRelation})</td>
                      <td className="p-3.5 font-mono text-emerald-700">
                        <a href={`tel:${reg.guardianPhone}`} className="hover:underline">
                          {reg.guardianPhone}
                        </a>
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
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{reg.status === 'pending' ? 'مراجعة واعتماد' : 'عرض التفاصيل'}</span>
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
                <h3 className="font-bold text-sm">مراجعة طلب تسجيل: {selectedReg.studentFullName}</h3>
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
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">المرحلة الدراسية:</span>
                  <span className="font-bold text-slate-800">{selectedReg.academicGrade}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">البرنامج المطلوب:</span>
                  <span className="font-bold text-emerald-800">{selectedReg.program}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ولي الأمر:</span>
                  <span className="font-bold text-slate-800">
                    {selectedReg.guardianName} ({selectedReg.guardianRelation})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">جوال التواصل:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedReg.guardianPhone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">العنوان:</span>
                  <span className="text-slate-700">{selectedReg.address || 'حي الفرقان'}</span>
                </div>
              </div>

              {/* Assignment Circle */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  تخصيص الحلقة القرآنية عند القبول:
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
                  ملاحظات وتوجيهات لجنة القبول:
                </label>
                <textarea
                  rows={2}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="سبب القبول، أو توجيه الطالب لمستوى معين..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {selectedReg.status === 'approved' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-medium">
                  ✓ تم قبول الطالب وإصدار رقمه الأكاديمي الثابت بنجاح.
                </div>
              )}

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
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>رفض الطلب</span>
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleDecision('approved')}
                      className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      <span>{submitting ? 'جارٍ الاعتماد...' : 'قبول وإصدار رقم الطالب فوراً'}</span>
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
