import React from 'react';
import { Student, PaymentRecord } from '../../types';
import { X, Printer, Award, BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';

interface PrintableModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'card' | 'receipt' | 'certificate';
  student?: Student | null;
  payment?: PaymentRecord | null;
  certificateData?: {
    surahOrJuz: string;
    grade: string;
    date: string;
  };
  mosqueName?: string;
  currency?: string;
}

export const PrintableModal: React.FC<PrintableModalProps> = ({
  isOpen,
  onClose,
  mode,
  student,
  payment,
  certificateData,
  mosqueName = 'جامع الفرقان الكبير ومجمع الحلقات القرآنية',
  currency = 'ر.س',
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs sm:text-sm">
              معاينة الطباعة:{' '}
              {mode === 'card'
                ? 'بطاقة الطالب الرسمية'
                : mode === 'receipt'
                ? 'سند قبض مالي'
                : 'شهادة تفوق وإنجاز قرآني'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة المستند</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex items-center justify-center bg-slate-50 min-h-[420px]">
          {/* MODE 1: STUDENT ID CARD */}
          {mode === 'card' && student && (
            <div className="w-[360px] sm:w-[400px] bg-white rounded-2xl shadow-md border-2 border-emerald-800 overflow-hidden text-right p-5 relative">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b-2 border-amber-400 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-bold shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-emerald-950 font-quran">
                      جامع الفرقان المبارك
                    </h3>
                    <p className="text-[10px] text-emerald-700">مجمع حلقات تحفيظ القرآن الكريم</p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  بطاقة طالب
                </span>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-24 rounded-xl bg-emerald-50 border-2 border-emerald-800/40 flex flex-col items-center justify-center text-emerald-800 font-bold shrink-0">
                  <span className="text-2xl font-quran">{student.fullName[0]}</span>
                  <span className="text-[9px] text-slate-400 mt-1">صورة الطالب</span>
                </div>

                <div className="space-y-1.5 text-xs flex-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">اسم الطالب:</span>
                    <span className="font-bold text-slate-900 font-quran text-sm">
                      {student.fullName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">الرقم الأكاديمي:</span>
                    <span className="font-mono font-bold text-amber-700 text-sm">
                      {student.studentNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">الحلقة المسندة:</span>
                    <span className="font-semibold text-emerald-900">
                      {student.circleName || 'حلقة الحفظ العام'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact & Barcode Simulation */}
              <div className="pt-3 border-t border-slate-200 text-[10px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">ولي الأمر: {student.guardianName}</span>
                  <span className="font-mono text-emerald-800 font-bold">{student.guardianPhone}</span>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-2 text-center">
                  <div className="h-7 w-48 mx-auto flex items-center justify-center gap-1">
                    {[1, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4].map(
                      (width, i) => (
                        <div
                          key={i}
                          className="h-full bg-slate-900"
                          style={{ width: `${width * 1.5}px` }}
                        />
                      )
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 tracking-widest mt-0.5 block">
                    {student.studentNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: PAYMENT RECEIPT */}
          {mode === 'receipt' && payment && (
            <div className="w-[420px] sm:w-[480px] bg-white rounded-2xl shadow-md border-2 border-emerald-900 p-6 text-right">
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-emerald-950 font-quran">
                    جامع الفرقان ومجمع الحلقات
                  </h3>
                  <p className="text-[10px] text-emerald-700">قسم الشؤون المالية والإيرادات</p>
                </div>
                <div className="text-left font-mono">
                  <span className="text-xs font-bold text-emerald-900 block">سند قبض إلكتروني</span>
                  <span className="text-[11px] text-amber-700 font-bold">
                    {payment.receiptNumber}
                  </span>
                </div>
              </div>

              {/* Details Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">تاريخ السند:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {new Date(payment.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">اسم الطالب:</span>
                  <span className="font-bold text-slate-900">{payment.studentName}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">الرقم الأكاديمي:</span>
                  <span className="font-mono text-emerald-900 font-bold">
                    {payment.studentNumber}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">بند الرسوم:</span>
                  <span className="font-semibold text-slate-800">{payment.type}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">طريقة الدفع:</span>
                  <span className="font-medium text-slate-800">{payment.paymentMethod}</span>
                </div>

                {/* Amount Highlight */}
                <div className="my-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-950">المبلغ المسدد:</span>
                  <span className="text-lg font-bold text-emerald-900 font-mono">
                    {payment.paidAmount} {currency}
                  </span>
                </div>

                {payment.discountAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-rose-600">
                    <span>خصم / إعفاء معتمد:</span>
                    <span>
                      -{payment.discountAmount} {currency} ({payment.discountReason || 'معتمد'})
                    </span>
                  </div>
                )}

                {payment.notes && (
                  <p className="text-[11px] text-slate-500 pt-1">
                    <strong>ملاحظات:</strong> {payment.notes}
                  </p>
                )}
              </div>

              {/* Signatures & Mosque Stamp */}
              <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-3">توقيع المحاسب</span>
                  <span className="font-bold text-slate-800">{payment.collectedBy}</span>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-emerald-800 flex items-center justify-center text-emerald-900 font-bold text-[9px] transform -rotate-12">
                  ختم الجامع المعتمد
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-3">توقيع ولي الأمر</span>
                  <span className="text-slate-400">.......................</span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: ACHIEVEMENT CERTIFICATE */}
          {mode === 'certificate' && student && (
            <div className="w-[520px] sm:w-[580px] bg-white rounded-2xl shadow-lg border-8 border-double border-emerald-900 p-8 text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-900/10 rounded-full" />

              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-emerald-800" />
                <h4 className="font-quran text-emerald-950 font-bold text-sm">
                  المملكة العربية السعودية • جامع الفرقان الكبير
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">مجمع حلقات تحفيظ القرآن الكريم والتربية الإيمانية</p>

              <h2 className="text-2xl font-bold font-quran text-amber-700 my-3">
                شهادة إتمام وتفوق قرآني
              </h2>

              <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto my-3">
                يسر إدارة مجمع حلقات جامع الفرقان أن تشهد بأن الطالب النجيب:
              </p>

              <div className="my-2 py-1.5 px-6 bg-emerald-50 rounded-xl border border-emerald-200 inline-block">
                <span className="text-lg font-bold font-quran text-emerald-950">
                  {student.fullName}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  الرقم الأكاديمي: {student.studentNumber}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto my-3">
                قد أتم بنجاح وتفوق حفظ وإتقان{' '}
                <strong className="text-emerald-900">
                  {certificateData?.surahOrJuz || `الأجزاء المقررة (${student.completedJuz} أجزاء)`}
                </strong>{' '}
                برواية حفص عن عاصم، بتقدير عام{' '}
                <strong className="text-amber-700">{certificateData?.grade || 'ممتاز (5/5)'}</strong>.
              </p>

              <p className="text-[11px] text-slate-500 italic my-2">
                سائلين الله تعالى أن يجعله من أهل القرآن الذين هم أهل الله وخاصته، وأن ينفع به والديه وأمته.
              </p>

              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">معلم الحلقة</span>
                  <span className="font-bold text-slate-800">
                    {student.circleName || 'فضيلة المعلم'}
                  </span>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex items-center justify-center text-amber-800 font-bold text-[9px] transform rotate-6">
                  ختم التميز القرآني
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">إمام وخطيب الجامع</span>
                  <span className="font-bold text-slate-800">فضيلة المشرف العام</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
