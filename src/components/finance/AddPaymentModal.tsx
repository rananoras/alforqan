import React, { useState, useEffect } from 'react';
import { Student, PaymentType, PaymentMethod } from '../../types';
import { X, Receipt, DollarSign, Save, AlertCircle } from 'lucide-react';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
  students: Student[];
  preselectedStudent?: Student | null;
  currency?: string;
  onReceiptIssued?: (payment: any) => void;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  preselectedStudent,
  currency = 'ر.س',
  onReceiptIssued,
}) => {
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState<PaymentType>('monthly_tuition');
  const [totalAmount, setTotalAmount] = useState<number>(150);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<number>(150);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mada');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedStudent = students.find((s) => s.id === studentId);

  useEffect(() => {
    if (preselectedStudent) {
      setStudentId(preselectedStudent.id);
      if (preselectedStudent.feeBalance > 0) {
        setTotalAmount(preselectedStudent.feeBalance);
        setPaidAmount(preselectedStudent.feeBalance);
      }
    } else if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [preselectedStudent, students]);

  useEffect(() => {
    const net = Math.max(0, totalAmount - discountAmount);
    setPaidAmount(net);
  }, [totalAmount, discountAmount]);

  if (!isOpen) return null;

  const handleTypeChange = (t: PaymentType) => {
    setType(t);
    if (t === 'registration_fee') setTotalAmount(100);
    else if (t === 'monthly_tuition') setTotalAmount(150);
    else if (t === 'semester_tuition') setTotalAmount(400);
    else if (t === 'books_supplies') setTotalAmount(50);
    else if (t === 'activity_fee') setTotalAmount(30);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedStudent) {
      setErrorMsg('يرجى اختيار الطالب');
      return;
    }
    if (paidAmount <= 0) {
      setErrorMsg('المبلغ المسدد يجب أن يكون أكبر من صفر');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const paymentData = {
        studentId,
        studentNumber: selectedStudent.studentNumber,
        studentName: selectedStudent.fullName,
        type,
        totalAmount: Number(totalAmount),
        discountAmount: Number(discountAmount),
        discountReason,
        paidAmount: Number(paidAmount),
        remainingBalance: Math.max(0, (selectedStudent.feeBalance || 0) - Number(paidAmount)),
        paymentMethod,
        notes,
        collectedBy: 'المحاسب المالي للجامع',
      };

      const issuedPayment = await onSubmit(paymentData);
      onClose();
      if (onReceiptIssued && issuedPayment) {
        onReceiptIssued(issuedPayment);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إصدار سند القبض');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base font-quran">
              إصدار سند قبض ورسوم مالية جديدة
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white">
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentNumber}) - الرصيد المتبقي: {st.feeBalance} {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Student Balance Notice */}
          {selectedStudent && (
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">الرصيد المتبقي على الطالب حالياً:</span>
              <span
                className={`font-bold ${
                  selectedStudent.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {selectedStudent.feeBalance} {currency}
              </span>
            </div>
          )}

          {/* Fee Type */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">نوع الرسوم / البند</label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as PaymentType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="monthly_tuition">الاشتراك الشهري لحلقات التحفيظ</option>
              <option value="semester_tuition">اشتراك الفصل الدراسي الكامل</option>
              <option value="registration_fee">رسوم التسجيل الأولي</option>
              <option value="books_supplies">حقيبة المصحف والمقررات</option>
              <option value="activity_fee">رسوم الأنشطة والرحلات القرآنية</option>
              <option value="donation">تبرع ودعم للحلقات</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          {/* Amounts & Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">المبلغ الإجمالي ({currency})</label>
              <input
                type="number"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">الخصم / الإعفاء ({currency})</label>
              <input
                type="number"
                min="0"
                max={totalAmount}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-rose-600 font-bold"
              />
            </div>
          </div>

          {discountAmount > 0 && (
            <div>
              <label className="block text-slate-700 font-medium mb-1">سبب الخصم أو الإعفاء</label>
              <input
                type="text"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                placeholder="مثال: إعفاء أيتام، خصم إخوة، تفوق حفظ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          )}

          {/* Paid Amount & Payment Method */}
          <div className="grid grid-cols-2 gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
            <div>
              <label className="block text-emerald-950 font-bold mb-1">المبلغ المسدد فعلياً</label>
              <input
                type="number"
                min="1"
                required
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-emerald-300 rounded-lg font-bold text-emerald-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-emerald-950 font-bold mb-1">طريقة الدفع</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-emerald-300 rounded-lg font-bold text-emerald-900 bg-white"
              >
                <option value="mada">مدى / بطاقة بنكية</option>
                <option value="cash">نقداً (كاش)</option>
                <option value="bank_transfer">تحويل بنكي</option>
                <option value="card">فيزا / ماستركارد</option>
                <option value="other">أخرى</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">ملاحظات الإيصال</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="رقم الحوالة البنكية أو ملاحظات إضافية..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
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
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'جارٍ الإصدار...' : 'إصدار سند القبض فوراً'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
