import React, { useState, useEffect } from 'react';
import { Student, PointRule } from '../../types';
import { DEFAULT_POINT_RULES } from '../../data/quranData';
import { X, Award, Sparkles, Save, AlertCircle } from 'lucide-react';

interface AwardPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  students: Student[];
  preselectedStudent?: Student | null;
  customRules?: PointRule[];
}

export const AwardPointsModal: React.FC<AwardPointsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  preselectedStudent,
  customRules,
}) => {
  const rules = customRules || DEFAULT_POINT_RULES;

  const [studentId, setStudentId] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState(rules[0]?.id || '');
  const [type, setType] = useState<'add' | 'deduct'>('add');
  const [points, setPoints] = useState<number>(10);
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedStudent = students.find((s) => s.id === studentId);

  useEffect(() => {
    if (preselectedStudent) {
      setStudentId(preselectedStudent.id);
    } else if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [preselectedStudent, students]);

  useEffect(() => {
    const r = rules.find((item) => item.id === selectedRuleId);
    if (r) {
      setType(r.type);
      setPoints(r.defaultPoints);
      setReason(r.name);
    }
  }, [selectedRuleId, rules]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedStudent) {
      setErrorMsg('يرجى اختيار الطالب');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('يرجى كتابة سبب منح أو خصم النقاط');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      // Unique eventKey to prevent duplicate awarding: studentId + ruleId + timestamp (per minute)
      const dateMinute = new Date().toISOString().slice(0, 16);
      const eventKey = `manual-${studentId}-${selectedRuleId}-${dateMinute}-${Math.floor(Math.random() * 1000)}`;

      await onSubmit({
        studentId,
        studentName: selectedStudent.fullName,
        type,
        points: Number(points),
        reason,
        eventKey,
        ruleId: selectedRuleId,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء رصد النقاط');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-sm sm:text-base font-quran">
              منح أو خصم نقاط التميز والمكافآت
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-amber-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="m-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Student Picker */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              اسم الطالب <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentNumber}) - الرصيد الحالي: {st.totalPoints} نقطة
                </option>
              ))}
            </select>
          </div>

          {/* Rule Preset */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              اختيار من قواعد النقاط المعتمدة:
            </label>
            <select
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              {rules.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.type === 'add' ? 'إضافة +' : 'خصم -'}{r.defaultPoints}] {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type & Points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">نوع الحركة</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              >
                <option value="add">منح نقاط مكافأة (+)</option>
                <option value="deduct">خصم نقاط (-)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">عدد النقاط</label>
              <input
                type="number"
                min="1"
                max="100"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg font-bold text-center ${
                  type === 'add' ? 'text-emerald-700 border-emerald-300' : 'text-rose-700 border-rose-300'
                }`}
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">السبب والتفاصيل</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: حفظ متميز لسورة البقرة، خلق رفيع..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Notice about duplicate prevention */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              النظام يمنع التكرار تلقائياً ويوثق اسم المشرف وتاريخ المنح في السجل التراكمي للطالب.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'جارٍ الرصد...' : 'تأكيد وحفظ النقاط'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
