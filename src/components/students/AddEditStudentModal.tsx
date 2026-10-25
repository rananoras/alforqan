import React, { useState, useEffect } from 'react';
import { Student, Circle, StudentStatus } from '../../types';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  studentToEdit?: Student | null;
  circles: Circle[];
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentToEdit,
  circles,
}) => {
  const isEditing = Boolean(studentToEdit);

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    academicGrade: 'الصف الرابع الابتدائي',
    nationalId: '',
    phone: '',
    address: '',
    circleId: '',
    circleName: '',
    program: 'حفظ عام وتجويد',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'أب',
    guardianEmail: '',
    guardianJob: '',
    feeBalance: 100,
    totalPoints: 20,
    completedJuz: 0,
    notes: '',
    status: 'active' as StudentStatus,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        fullName: studentToEdit.fullName || '',
        gender: studentToEdit.gender || 'male',
        birthDate: studentToEdit.birthDate || '',
        academicGrade: studentToEdit.academicGrade || 'الصف الرابع الابتدائي',
        nationalId: studentToEdit.nationalId || '',
        phone: studentToEdit.phone || '',
        address: studentToEdit.address || '',
        circleId: studentToEdit.circleId || '',
        circleName: studentToEdit.circleName || '',
        program: studentToEdit.program || 'حفظ عام وتجويد',
        guardianName: studentToEdit.guardianName || '',
        guardianPhone: studentToEdit.guardianPhone || '',
        guardianRelation: studentToEdit.guardianRelation || 'أب',
        guardianEmail: studentToEdit.guardianEmail || '',
        guardianJob: studentToEdit.guardianJob || '',
        feeBalance: studentToEdit.feeBalance ?? 100,
        totalPoints: studentToEdit.totalPoints ?? 20,
        completedJuz: studentToEdit.completedJuz ?? 0,
        notes: studentToEdit.notes || '',
        status: studentToEdit.status || 'active',
      });
    } else {
      setFormData({
        fullName: '',
        gender: 'male',
        birthDate: '',
        academicGrade: 'الصف الرابع الابتدائي',
        nationalId: '',
        phone: '',
        address: '',
        circleId: circles[0]?.id || '',
        circleName: circles[0]?.name || '',
        program: 'حفظ عام وتجويد',
        guardianName: '',
        guardianPhone: '',
        guardianRelation: 'أب',
        guardianEmail: '',
        guardianJob: '',
        feeBalance: 100,
        totalPoints: 20,
        completedJuz: 0,
        notes: '',
        status: 'active',
      });
    }
    setErrorMsg('');
  }, [studentToEdit, isOpen, circles]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.guardianName.trim() || !formData.guardianPhone.trim()) {
      setErrorMsg('يرجى تعبئة الحقول الإلزامية (اسم الطالب، اسم ولي الأمر، رقم الهاتف)');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      // Find circle name if circleId is selected
      const selectedCircle = circles.find((c) => c.id === formData.circleId);
      const submissionData = {
        ...formData,
        circleName: selectedCircle ? selectedCircle.name : formData.circleName,
      };

      await onSubmit(submissionData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ بيانات الطالب');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">
                {isEditing ? `تعديل بيانات الطالب: ${studentToEdit?.fullName}` : 'إضافة طالب جديد في الحلقات'}
              </h3>
              {studentToEdit && (
                <span className="text-xs text-amber-300 font-mono">
                  الرقم الثابت: {studentToEdit.studentNumber}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="m-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Student info */}
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-emerald-800 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              بيانات الطالب الأساسية
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  الاسم الرباعي للطالب <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: عبد الله أحمد السالم"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  المرحلة الدراسية
                </label>
                <select
                  value={formData.academicGrade}
                  onChange={(e) => setFormData({ ...formData, academicGrade: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="الروضة والتمهيدي">الروضة والتمهيدي (براعم)</option>
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
                  <option value="المرحلة الجامعية فما فوق">المرحلة الجامعية فما فوق</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  رقم الهوية الوطنية / الإقامة
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  placeholder="10 أرقام"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  رقم جوال الطالب (إن وجد)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  عنوان السكن والحي
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="اسم الحي، الشارع"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Circle & Program */}
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-emerald-800 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              الحلقة القرآنية والبرنامج
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  الحلقة المسند إليها
                </label>
                <select
                  value={formData.circleId}
                  onChange={(e) => setFormData({ ...formData, circleId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="">بدون حلقة حالياً</option>
                  {circles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.teacherName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  البرنامج القرآني
                </label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="حفظ عام وتجويد">حفظ عام وتجويد</option>
                  <option value="المسار المكثف للحفاظ">المسار المكثف للحفاظ</option>
                  <option value="برنامج الإتقان والمراجعة">برنامج الإتقان والمراجعة</option>
                  <option value="براعم القرآن للتلقين">براعم القرآن للتلقين</option>
                  <option value="تأهيل المسابقات القرآنية">تأهيل المسابقات القرآنية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  الأجزاء المحفوظة سابقاً (من 0 إلى 30)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.completedJuz}
                  onChange={(e) => setFormData({ ...formData, completedJuz: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  حالة القيد
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="active">طالب منتظم ونشط</option>
                  <option value="archived">مؤرشف / منقطع</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Guardian Details */}
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-emerald-800 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              بيانات ولي الأمر والتواصل
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  اسم ولي الأمر <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="الاسم الثلاثي لولي الأمر"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  صلة القرابة
                </label>
                <select
                  value={formData.guardianRelation}
                  onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="أب">أب</option>
                  <option value="أم">أم</option>
                  <option value="أخ">أخ</option>
                  <option value="عم">عم</option>
                  <option value="خال">خال</option>
                  <option value="ولي أمر">ولي أمر شرعي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  رقم جوال ولي الأمر (واتساب) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  البريد الإلكتروني لولي الأمر
                </label>
                <input
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  placeholder="guardian@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  مهنة ولي الأمر
                </label>
                <input
                  type="text"
                  value={formData.guardianJob}
                  onChange={(e) => setFormData({ ...formData, guardianJob: e.target.value })}
                  placeholder="مثال: معلم، مهندس، موظف"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  الرصيد المالي المتبقي (ر.س)
                </label>
                <input
                  type="number"
                  value={formData.feeBalance}
                  onChange={(e) => setFormData({ ...formData, feeBalance: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ملاحظات وتوجيهات خاصة بالطالب
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات صحية أو توصيات خاصة بالمعلم..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'جارٍ الحفظ...' : isEditing ? 'حفظ التعديلات' : 'إصدار رقم الطالب وإضافته'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
