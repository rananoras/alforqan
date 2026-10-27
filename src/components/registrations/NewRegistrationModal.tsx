import React, { useState } from 'react';
import { Circle } from '../../types';
import { X, Send, UserPlus, CheckCircle2, KeyRound } from 'lucide-react';

interface NewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  circles: Circle[];
  defaultAdminCode?: string;
}

export const NewRegistrationModal: React.FC<NewRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  circles,
  defaultAdminCode = 'JABY-2026',
}) => {
  const [formData, setFormData] = useState({
    studentFullName: '',
    studentAge: '',
    adminRegistrationCode: defaultAdminCode,
    phone: '',
    preferredCircleId: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.studentFullName.trim();
    const trimmedAge = formData.studentAge.trim();
    const trimmedCode = formData.adminRegistrationCode.trim().toUpperCase();

    if (!trimmedName || !trimmedAge) {
      setErrorMsg('يرجى إدخال اسم الطالب وعمره');
      return;
    }

    if (!trimmedCode) {
      setErrorMsg('يرجى إدخال الرقم التعريفي المخصص من الإدارة');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await onSubmit({
        studentFullName: trimmedName,
        studentAge: trimmedAge,
        adminRegistrationCode: trimmedCode,
        phone: formData.phone.trim(),
        preferredCircleId: formData.preferredCircleId,
        guardianName: `ولي أمر ${trimmedName}`,
        guardianPhone: formData.phone.trim() || 'غير محدد',
        program: 'حفظ عام وتجويد',
        academicGrade: `${trimmedAge} سنوات`,
        address: 'حي جامع سعيد الجابي',
      });
      setSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تقديم الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setFormData({
      studentFullName: '',
      studentAge: '',
      adminRegistrationCode: defaultAdminCode,
      phone: '',
      preferredCircleId: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base font-quran">
              تسجيل طالب جديد بالاسم والعمر والرقم التعريفي
            </h3>
          </div>
          <button onClick={handleResetAndClose} className="p-1 rounded-lg text-emerald-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">تم تسجيل الطلب بنجاح!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              تم إرسال طلب الطالب <strong className="text-emerald-950 font-bold">{formData.studentFullName}</strong>. الطلب الآن مسجل كطلب قيد المراجعة، ويمكن للإدارة اعتماده وتوليد كود الطالب الخاص به مباشرة من لوحة الطلبات.
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                حسناً، إغلاق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  اسم الطالب الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentFullName}
                  onChange={(e) => setFormData({ ...formData, studentFullName: e.target.value })}
                  placeholder="مثال: يوسف إبراهيم السالم"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  عمر الطالب (بالسنوات) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="4"
                  max="40"
                  required
                  value={formData.studentAge}
                  onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
                  placeholder="مثال: 10"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold flex items-center justify-between">
                  <span>الرقم التعريفي المخصص من الإدارة <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-mono">كود التسجيل المعتمد</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.adminRegistrationCode}
                  onChange={(e) => setFormData({ ...formData, adminRegistrationCode: e.target.value })}
                  placeholder="مثل JABY-2026"
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono font-bold uppercase tracking-wider text-emerald-950"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">
                  رقم الهاتف أو الواتساب (اختياري)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">الحلقة المقترحة (اختياري)</label>
                <select
                  value={formData.preferredCircleId}
                  onChange={(e) => setFormData({ ...formData, preferredCircleId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">تحديد الحلقة تلقائياً عند قبول الإدارة</option>
                  {circles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.timing})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>{submitting ? 'جارٍ الإرسال...' : 'تسجيل وإرسال الطلب للإدارة'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
