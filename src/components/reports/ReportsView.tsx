import React, { useState } from 'react';
import { Student, Circle, PaymentRecord, MemorizationRecord, AttendanceRecord } from '../../types';
import {
  Printer,
  FileSpreadsheet,
  Award,
  BookOpen,
  CalendarCheck,
  Receipt,
  Search,
  Users,
  Eye,
} from 'lucide-react';

interface ReportsViewProps {
  students: Student[];
  circles: Circle[];
  payments: PaymentRecord[];
  memorizationRecords: MemorizationRecord[];
  attendanceRecords: AttendanceRecord[];
  currency?: string;
  onPrintCard: (student: Student) => void;
  onPrintCertificate: (student: Student, details: { surahOrJuz: string; grade: string; date: string }) => void;
  onPrintReceipt: (payment: PaymentRecord) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  circles,
  payments,
  memorizationRecords,
  attendanceRecords,
  currency = 'ر.س',
  onPrintCard,
  onPrintCertificate,
  onPrintReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('all');
  const [activeReportTab, setActiveReportTab] = useState<'cards' | 'certificates' | 'receipts' | 'stats'>('cards');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCircle = selectedCircle === 'all' || s.circleId === selectedCircle;
    return matchesSearch && matchesCircle;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-800" />
            <span>مركز التقارير والطباعة والشهادات الرسمية</span>
          </h2>
          <p className="text-xs text-slate-500">
            إصدار وطباعة بطاقات الطلاب، شهادات إتمام الحفظ، إيصالات السداد، والتقارير الإحصائية
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>طباعة الصفحة الحالية</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs text-xs">
        <button
          onClick={() => setActiveReportTab('cards')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeReportTab === 'cards'
              ? 'border-emerald-700 text-emerald-900 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-700" />
          <span>بطاقات الطلاب الأكاديمية</span>
        </button>

        <button
          onClick={() => setActiveReportTab('certificates')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeReportTab === 'certificates'
              ? 'border-emerald-700 text-emerald-900 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>شهادات التفوق القرآني</span>
        </button>

        <button
          onClick={() => setActiveReportTab('receipts')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeReportTab === 'receipts'
              ? 'border-emerald-700 text-emerald-900 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-700" />
          <span>إيصالات وسندات القبض</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الطالب أو رقمه الأكاديمي..."
            className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCircle}
            onChange={(e) => setSelectedCircle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">جميع الحلقات</option>
            {circles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: STUDENT CARDS */}
      {activeReportTab === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                  {st.fullName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{st.fullName}</h4>
                  <span className="font-mono text-[10px] text-amber-700 block">{st.studentNumber}</span>
                  <span className="text-[10px] text-slate-500">{st.circleName || 'حلقة عامة'}</span>
                </div>
              </div>

              <button
                onClick={() => onPrintCard(st)}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>طباعة</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CERTIFICATES */}
      {activeReportTab === 'certificates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-amber-500 transition-colors"
            >
              <div>
                <h4 className="font-bold text-xs text-slate-800">{st.fullName}</h4>
                <p className="text-[10px] text-slate-500">
                  الأجزاء المنجزة: <strong className="text-amber-700">{st.completedJuz} أجزاء</strong>
                </p>
                <span className="text-[10px] font-mono text-emerald-800">{st.studentNumber}</span>
              </div>

              <button
                onClick={() =>
                  onPrintCertificate(st, {
                    surahOrJuz: `${st.completedJuz} أجزاء من القرآن الكريم`,
                    grade: 'ممتاز مع مرتبة الشرف',
                    date: new Date().toLocaleDateString('ar-SA'),
                  })
                }
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-200" />
                <span>شهادة تفوق</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RECEIPTS */}
      {activeReportTab === 'receipts' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">رقم السند</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">اسم الطالب</th>
                <th className="p-3.5">المبلغ المسدد</th>
                <th className="p-3.5">طريقة الدفع</th>
                <th className="p-3.5 text-center">الطباعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-emerald-900">{p.receiptNumber}</td>
                  <td className="p-3.5 text-slate-600">{new Date(p.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td className="p-3.5 font-bold text-slate-800">{p.studentName}</td>
                  <td className="p-3.5 font-bold text-emerald-800">
                    {p.paidAmount} {currency}
                  </td>
                  <td className="p-3.5 text-slate-600">{p.paymentMethod}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onPrintReceipt(p)}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold text-xs inline-flex items-center gap-1"
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
  );
};
