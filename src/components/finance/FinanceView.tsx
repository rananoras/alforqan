import React, { useState } from 'react';
import { PaymentRecord, Student } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  Printer,
  FileSpreadsheet,
  Calendar,
  CreditCard,
  Banknote,
  Sparkles,
} from 'lucide-react';

interface FinanceViewProps {
  payments: PaymentRecord[];
  students: Student[];
  currency?: string;
  onOpenAddPayment: () => void;
  onPrintReceipt: (payment: PaymentRecord) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  payments,
  students,
  currency = 'ر.س',
  onOpenAddPayment,
  onPrintReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || p.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Totals
  const totalCollected = payments.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
  const totalDiscounts = payments.reduce((acc, p) => acc + (p.discountAmount || 0), 0);
  const totalOutstanding = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'رقم الإيصال',
      'تاريخ السند',
      'الرقم الأكاديمي',
      'اسم الطالب',
      'نوع البند',
      'المبلغ الأصلي',
      'الخصم',
      'المبلغ المسدد',
      'طريقة الدفع',
      'المستلم',
    ];

    const rows = filteredPayments.map((p) => [
      p.receiptNumber,
      `"${new Date(p.createdAt).toLocaleDateString('ar-SA')}"`,
      p.studentNumber,
      `"${p.studentName}"`,
      `"${p.type}"`,
      p.totalAmount,
      p.discountAmount,
      p.paidAmount,
      `"${p.paymentMethod}"`,
      `"${p.collectedBy}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `التقرير_المالي_جامع_الفرقان_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paymentTypeLabels: Record<string, string> = {
    monthly_tuition: 'اشتراك شهري',
    semester_tuition: 'اشتراك فصلي',
    registration_fee: 'رسوم تسجيل',
    books_supplies: 'كتب ومقررات',
    activity_fee: 'أنشطة قرآنية',
    donation: 'تبرع ودعم',
    other: 'أخرى',
  };

  const paymentMethodLabels: Record<string, string> = {
    mada: 'مدى / بطاقة',
    cash: 'نقداً (كاش)',
    bank_transfer: 'تحويل بنكي',
    card: 'فيزا/ماستركارد',
    other: 'أخرى',
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-800" />
            <span>إدارة الرسوم والمالية وسندات القبض الإلكترونية</span>
          </h2>
          <p className="text-xs text-slate-500">
            متابعة الاشتراكات والدفعات والخصومات وإصدار إيصالات رسمية قابلة للطباعة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>تصدير تقرير مالي</span>
          </button>

          <button
            onClick={onOpenAddPayment}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>إصدار سند قبض جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">إجمالي الرسوم المحصلة</span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-800">
            {totalCollected.toLocaleString()} <span className="text-xs font-normal">{currency}</span>
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">محصلة بحساب الجامع</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">الأرصدة المتبقية المستحقة</span>
          <span className="text-xl sm:text-2xl font-bold text-rose-600">
            {totalOutstanding.toLocaleString()} <span className="text-xs font-normal">{currency}</span>
          </span>
          <span className="text-[10px] text-rose-500 block mt-0.5">مستحقات قيد التحصيل</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">إجمالي الخصومات والإعفاءات</span>
          <span className="text-xl sm:text-2xl font-bold text-amber-600">
            {totalDiscounts.toLocaleString()} <span className="text-xs font-normal">{currency}</span>
          </span>
          <span className="text-[10px] text-amber-700 block mt-0.5">أيتام وحفظة وإخوة</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">عدد السندات المصدرة</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-800">{payments.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">إيصال قبض رسمي</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الإيصال (REC-XXXX)، اسم الطالب، أو الرقم الأكاديمي..."
            className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">جميع بنود الرسوم</option>
            <option value="monthly_tuition">الاشتراك الشهري</option>
            <option value="semester_tuition">اشتراك الفصل</option>
            <option value="registration_fee">رسوم التسجيل</option>
            <option value="books_supplies">الكتب والمصاحف</option>
            <option value="donation">تبرعات ودعم</option>
          </select>
        </div>
      </div>

      {/* Payments History Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا توجد سندات قبض مسجلة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">رقم السند</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">بند الرسوم</th>
                  <th className="p-3.5">المبلغ المسدد</th>
                  <th className="p-3.5">الخصم</th>
                  <th className="p-3.5">طريقة الدفع</th>
                  <th className="p-3.5">المستلم</th>
                  <th className="p-3.5 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-900 whitespace-nowrap">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {p.receiptNumber}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{p.studentName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{p.studentNumber}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {paymentTypeLabels[p.type] || p.type}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-800 whitespace-nowrap">
                      {p.paidAmount} {currency}
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {p.discountAmount > 0 ? (
                        <span className="text-rose-600 font-bold">-{p.discountAmount} {currency}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">
                      {paymentMethodLabels[p.paymentMethod] || p.paymentMethod}
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">{p.collectedBy}</td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => onPrintReceipt(p)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold transition-colors inline-flex items-center gap-1 border border-amber-200"
                        title="طباعة سند القبض"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-700" />
                        <span>طباعة السند</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
