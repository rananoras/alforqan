import React, { useState } from 'react';
import { PaymentRecord, Student } from '../../types';
import {
  DollarSign,
  Receipt,
  Plus,
  Search,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  CreditCard,
  User,
  Calendar,
} from 'lucide-react';

interface AccountantPortalViewProps {
  payments: PaymentRecord[];
  students: Student[];
  currency?: string;
  onOpenAddPayment: (student?: Student) => void;
  onPrintReceipt: (payment: PaymentRecord) => void;
}

export const AccountantPortalView: React.FC<AccountantPortalViewProps> = ({
  payments,
  students,
  currency = 'ر.س',
  onOpenAddPayment,
  onPrintReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'receipts' | 'debtors'>('receipts');

  // Stats
  const totalRevenue = payments.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
  const totalDiscounts = payments.reduce((acc, p) => acc + (p.discountAmount || 0), 0);
  const totalRemaining = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);
  const debtors = students.filter((s) => (s.feeBalance || 0) > 0);

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = paymentTypeFilter === 'all' || p.type === paymentTypeFilter;
    return matchesSearch && matchesType;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'رقم السند',
      'التاريخ',
      'الرقم الأكاديمي',
      'اسم الطالب',
      'بند الرسوم',
      'المبلغ الأصلي',
      'الخصم',
      'المبلغ المحصل',
      'طريقة الدفع',
      'المحاسب المستلم',
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
    link.setAttribute(
      'download',
      `التقرير_المالي_جامع_سعيد_الجابي_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-yellow-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-amber-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-amber-800/70 border border-amber-700 text-amber-300">
              <DollarSign className="w-5 h-5" />
            </span>
            <span className="text-xs bg-amber-800/80 text-amber-200 px-3 py-1 rounded-full font-bold">
              بوابة المحاسب المالي الرسمية
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-quran text-amber-300">
            إدارة الشؤون المالية وسندات القبض الإلكترونية
          </h1>
          <p className="text-xs text-amber-100 mt-1 max-w-xl">
            إصدار سندات القبض المعتمدة لجامع سعيد الجابي، تحصيل الاشتراكات والرسوم الدراسية،
            ومتابعة الأرصدة المتبقية وتصدير التقارير المالية المحاسبية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-200 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>تصدير تقرير مالي CSV</span>
          </button>

          <button
            onClick={() => onOpenAddPayment()}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-950" />
            <span>إصدار سند قبض جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">إجمالي الإيرادات المحصلة</span>
            <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
              {totalRevenue.toLocaleString()} {currency}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">سندات قبض مقبوضة</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">المبالغ والأرصدة المتبقية</span>
            <span className="text-2xl font-bold font-mono text-rose-600 mt-1 block">
              {totalRemaining.toLocaleString()} {currency}
            </span>
            <span className="text-[10px] text-rose-600 font-medium">
              على {debtors.length} طالب مسجل
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">الخصومات والإعفاءات المعتمدة</span>
            <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block">
              {totalDiscounts.toLocaleString()} {currency}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">منح وكفالات قرآنية</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">عدد السندات المصدرة</span>
            <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
              {payments.length}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">سند إلكتروني موثق</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs text-xs">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`py-3 px-4 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'receipts'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-700" />
          <span>سجل سندات القبض المعتمدة ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('debtors')}
          className={`py-3 px-4 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'debtors'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>كشف الطلاب المستحق عليهم رسوم ({debtors.length})</span>
        </button>
      </div>

      {activeTab === 'receipts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث برقم السند، اسم الطالب، الرقم الأكاديمي..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-700"
            >
              <option value="all">جميع بنود الرسوم</option>
              <option value="اشتراك شهري">اشتراك شهري</option>
              <option value="رسوم تسجيل">رسوم تسجيل</option>
              <option value="كتب ومقررات">كتب ومقررات</option>
              <option value="أنشطة قرآنية">أنشطة قرآنية</option>
              <option value="تبرع ودعم">تبرع ودعم</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">رقم السند</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">بند الرسوم</th>
                  <th className="p-3.5">المبلغ المحصل</th>
                  <th className="p-3.5">طريقة الدفع</th>
                  <th className="p-3.5">المحاسب المستلم</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-800">{p.receiptNumber}</td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>
                        {p.studentName}
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {p.studentNumber}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {p.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-800 text-sm">
                      {p.paidAmount} {currency}
                    </td>
                    <td className="p-3.5 text-slate-600">{p.paymentMethod}</td>
                    <td className="p-3.5 text-slate-600">{p.collectedBy}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onPrintReceipt(p)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-[11px]"
                      >
                        <Printer className="w-3 h-3 text-emerald-700" />
                        <span>طباعة السند</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'debtors' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">
              قائمة الطلاب المستحق عليهم مبالغ ورسوم متأخرة
            </h3>
            <span className="text-[11px] text-rose-600 font-bold">
              إجمالي المستحقات: {totalRemaining} {currency}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الرقم الأكاديمي</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">الحلقة</th>
                  <th className="p-3.5">ولي الأمر</th>
                  <th className="p-3.5">رقم الجوال</th>
                  <th className="p-3.5">المبلغ المتبقي</th>
                  <th className="p-3.5 text-center">إجراء السداد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {debtors.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-700">{st.studentNumber}</td>
                    <td className="p-3.5 font-bold text-slate-900">{st.fullName}</td>
                    <td className="p-3.5 text-slate-600">{st.circleName || 'غير مسند'}</td>
                    <td className="p-3.5 text-slate-600">{st.guardianName}</td>
                    <td className="p-3.5 font-mono text-emerald-800">{st.guardianPhone}</td>
                    <td className="p-3.5 font-mono font-bold text-rose-600 text-sm">
                      {st.feeBalance} {currency}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onOpenAddPayment(st)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-[11px]"
                      >
                        <Plus className="w-3 h-3" />
                        <span>تحصيل الرسوم</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
