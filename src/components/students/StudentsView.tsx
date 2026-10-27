import React, { useState } from 'react';
import { Student, Circle } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Printer,
  Eye,
  Edit2,
  Archive,
  CheckCircle,
  Phone,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  circles: Circle[];
  currency?: string;
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onToggleArchive: (studentId: string, isArchived: boolean) => Promise<void>;
  onPrintCard: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  circles,
  currency = 'ر.س',
  onOpenAddStudent,
  onOpenEditStudent,
  onViewStudent,
  onToggleArchive,
  onPrintCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nationalId && s.nationalId.includes(searchQuery)) ||
      (s.guardianPhone && s.guardianPhone.includes(searchQuery));

    const matchesCircle = selectedCircle === 'all' || s.circleId === selectedCircle;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesCircle && matchesStatus;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'الرقم الأكاديمي',
      'اسم الطالب',
      'المرحلة الدراسية',
      'الحلقة',
      'هاتف التواصل',
      'الأجزاء المحفوظة',
      'النقاط',
      'الحالة',
    ];

    const rows = filteredStudents.map((s) => [
      s.studentNumber,
      `"${s.fullName}"`,
      `"${s.academicGrade}"`,
      `"${s.circleName || 'غير مسند'}"`,
      s.phone || s.guardianPhone || '',
      s.completedJuz,
      s.totalPoints,
      s.status === 'active' ? 'منتظم' : 'مؤرشف',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `طلاب_جامع_سعيد_الجابي_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>سجلات طلاب جامع سعيد الجابي وحلقات التحفيظ</span>
          </h2>
          <p className="text-xs text-slate-500">
            إدارة أرقام الطلاب الثابتة، السجلات الشاملة، الحلقات، والمدفوعات والنقاط
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>تصدير Excel/CSV</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>إضافة طالب جديد</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، الرقم الأكاديمي، أو جوال ولي الأمر..."
            className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Circle Filter */}
        <div>
          <select
            value={selectedCircle}
            onChange={(e) => setSelectedCircle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="all">جميع الحلقات القرآنية</option>
            {circles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.teacherName})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors ${
              statusFilter === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            الكل ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors ${
              statusFilter === 'active' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
            }`}
          >
            نشط ({students.filter((s) => s.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors ${
              statusFilter === 'archived' ? 'bg-white shadow-xs text-slate-800 font-bold' : 'text-slate-600'
            }`}
          >
            مؤرشف ({students.filter((s) => s.status === 'archived').length})
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400 text-xs">
            لا توجد سجلات تطابق معايير البحث. اضغط «إضافة طالب جديد» لإدخال بيانات أول طالب.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الرقم الأكاديمي</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">الحلقة والبرنامج</th>
                  <th className="p-3.5">هاتف التواصل</th>
                  <th className="p-3.5">الأجزاء</th>
                  <th className="p-3.5">النقاط</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-emerald-50/40 transition-colors">
                    {/* Student Number */}
                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-emerald-900">
                      <span className="bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {st.studentNumber}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <span>{st.fullName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{st.academicGrade}</span>
                    </td>

                    {/* Circle */}
                    <td className="p-3.5">
                      <span className="font-medium text-emerald-900 block">{st.circleName || 'غير مسند'}</span>
                      <span className="text-[10px] text-slate-500">{st.program}</span>
                    </td>

                    {/* Phone */}
                    <td className="p-3.5">
                      <a
                        href={`tel:${st.phone || st.guardianPhone}`}
                        className="text-xs text-emerald-700 font-mono hover:underline flex items-center gap-1 font-bold"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{st.phone || st.guardianPhone || 'غير مسجل'}</span>
                      </a>
                    </td>

                    {/* Completed Juz */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-bold text-slate-800">{st.completedJuz}</span>
                        <span className="text-[10px] text-slate-400">جزء</span>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{st.totalPoints}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          st.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {st.status === 'active' ? 'منتظم' : 'مؤرشف'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewStudent(st)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                          title="عرض الملف الشامل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenEditStudent(st)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          title="تعديل البيانات"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrintCard(st)}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
                          title="طباعة بطاقة الطالب"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onToggleArchive(st.id, st.status === 'active')}
                          className={`p-1.5 rounded-lg transition-colors ${
                            st.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title={st.status === 'active' ? 'أرشفة الطالب' : 'تفعيل الطالب'}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
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
