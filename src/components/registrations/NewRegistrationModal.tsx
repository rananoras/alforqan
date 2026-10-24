import React, { useState } from 'react';
import { Circle } from '../../types';
import { X, Send, UserPlus, CheckCircle2 } from 'lucide-react';

interface NewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  circles: Circle[];
}

export const NewRegistrationModal: React.FC<NewRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  circles,
}) => {
  const [formData, setFormData] = useState({
    studentFullName: '',
    birthDate: '',
    academicGrade: 'الصف الرابع الابتدائي',
    nationalId: '',
    phone: '',
    address: 'حي الفرقان',
    program: 'حفظ عام وتجويد',
    preferredCircleId: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'أب',
    guardianEmail: '',
    guardianJob: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentFullName.trim() || !formData.guardianName.trim() || !formData.guardianPhone.trim()) {
      setErrorMsg('يرجى تعبئة الحقول الإلزامية');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await onSubmit(formData);
      setSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تقديم الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base font-quran">
              استمارة الالتحاق بحلقات تحفيظ جامع الفرقان
            </h3>
          </div>
          <button onClick={handleResetAndClose} className="p-1 rounded-lg text-emerald-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">تم استلام طلب التسجيل بنجاح!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              تم إرسال طلب الطالب <span className="font-bold text-emerald-800">{formData.studentFullName}</span> إلى إدارة جامع الفرقان. سيتم مراجعة الطلب وتعيين الحلقة وإصدار الرقم الأكاديمي والتواصل معكم عبر واتساب.
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                حسناً، تم
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                {errorMsg}
              </div>
            )}

            <div>
              <h4 className="font-bold text-emerald-900 mb-2">1. بيانات الطالب المتقدم</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 mb-1 font-medium">
                    اسم الطالب الرباعي <span className="text-rose-500">*</span>
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
                  <label className="block text-slate-700 mb-1 font-medium">المرحلة الدراسية</label>
                  <select
                    value={formData.academicGrade}
                    onChange={(e) => setFormData({ ...formData, academicGrade: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="الروضة والتمهيدي (براعم)">الروضة والتمهيدي (براعم)</option>
                    <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
                    <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
                    <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
                    <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                    <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                    <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
                    <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
                    <option value="الصف الثاني المتوسط">الصف الثاني المتوسط</option>
                    <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
                    <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">تاريخ الميلاد</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">البرنامج القرآني المفضل</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="حفظ عام وتجويد">حفظ عام وتجويد</option>
                    <option value="المسار المكثف للحفاظ">المسار المكثف للحفاظ</option>
                    <option value="برنامج الإتقان والمراجعة">برنامج الإتقان والمراجعة</option>
                    <option value="براعم الفرقان للتلقين">براعم الفرقان للتلقين</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">الحلقة المفضلة (اختياري)</label>
                  <select
                    value={formData.preferredCircleId}
                    onChange={(e) => setFormData({ ...formData, preferredCircleId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">أي حلقة مناسبة للمرحلة</option>
                    {circles.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.timing})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h4 className="font-bold text-emerald-900 mb-2">2. بيانات ولي الأمر والتواصل</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">
                    اسم ولي الأمر <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="الاسم الثلاثي"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">صلة القرابة</label>
                  <select
                    value={formData.guardianRelation}
                    onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="أب">أب</option>
                    <option value="أم">أم</option>
                    <option value="أخ">أخ</option>
                    <option value="ولي أمر">ولي أمر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">
                    رقم جوال ولي الأمر (واتساب) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">عنوان السكن والحي</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="اسم الحي"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
                <span>{submitting ? 'جارٍ الإرسال...' : 'إرسال طلب التسجيل للجامع'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
