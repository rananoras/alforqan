import React, { useState } from 'react';
import { MemorizationRecord, Student } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Star,
  Sparkles,
  Calendar,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface MemorizationViewProps {
  memorizationRecords: MemorizationRecord[];
  students: Student[];
  onOpenAddModal: () => void;
}

export const MemorizationView: React.FC<MemorizationViewProps> = ({
  memorizationRecords,
  students,
  onOpenAddModal,
}) => {
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Filter records
  const filteredRecords = memorizationRecords.filter((rec) => {
    const matchesStudent =
      rec.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      rec.surahName.toLowerCase().includes(searchStudent.toLowerCase());

    const matchesType = selectedType === 'all' || rec.type === selectedType;
    const matchesGrade = selectedGrade === 'all' || rec.grade === selectedGrade;

    return matchesStudent && matchesType && matchesGrade;
  });

  const totalPagesRecited = memorizationRecords.reduce((acc, r) => acc + (r.pagesCount || 0), 0);
  const excellentCount = memorizationRecords.filter((r) => r.grade === 'excellent').length;
  const newMemorizationCount = memorizationRecords.filter((r) => r.type === 'new_memorization').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span>متابعة حلقات تحفيظ القرآن الكريم والتسميع اليومي</span>
          </h2>
          <p className="text-xs text-slate-500">
            رصد السور والآيات، تقييم درجات الإتقان والتجويد، ومتابعة الخطط اليومية للطلاب
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>رصد تسميع / مراجعة جديدة</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">إجمالي جلسات التسميع</span>
          <span className="text-2xl font-bold text-slate-800">{memorizationRecords.length}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">جلسة موثقة بالنظام</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">إجمالي الصفحات المسمعة</span>
          <span className="text-2xl font-bold text-amber-600">{totalPagesRecited.toFixed(1)}</span>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">وجه / صفحة مصحف</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">الحفظ الجديد (الدروس)</span>
          <span className="text-2xl font-bold text-emerald-800">{newMemorizationCount}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">درس حفظ جديد</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">نسبة الإتقان (ممتاز)</span>
          <span className="text-2xl font-bold text-teal-700">
            {memorizationRecords.length > 0
              ? Math.round((excellentCount / memorizationRecords.length) * 100)
              : 100}
            %
          </span>
          <span className="text-[10px] text-teal-600 block mt-0.5 font-medium">حفظ متقن ومثبت</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="بحث باسم الطالب أو السورة..."
            className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">جميع أنواع التسميع</option>
            <option value="new_memorization">حفظ جديد</option>
            <option value="near_review">مراجعة قريبة</option>
            <option value="far_review">مراجعة بعيدة</option>
            <option value="recitation">تلقين وتصحيح</option>
          </select>
        </div>

        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">جميع التقديرات</option>
            <option value="excellent">ممتاز (5/5)</option>
            <option value="very_good">جيد جداً (4/5)</option>
            <option value="good">جيد (3/5)</option>
            <option value="acceptable">مقبول</option>
            <option value="needs_repeat">يحتاج إعادة</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا توجد سجلات تسميع مسجلة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">نوع الجلسة</th>
                  <th className="p-3.5">السورة والمقدار</th>
                  <th className="p-3.5">الإتقان والتجويد</th>
                  <th className="p-3.5">التقدير</th>
                  <th className="p-3.5">ملاحظات المعلم وخطة الغد</th>
                  <th className="p-3.5">النقاط</th>
                  <th className="p-3.5">المعلم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => {
                  const typeLabels: Record<string, string> = {
                    new_memorization: 'حفظ جديد',
                    near_review: 'مراجعة قريبة',
                    far_review: 'مراجعة بعيدة',
                    recitation: 'تلقين',
                  };

                  const gradeColors: Record<string, string> = {
                    excellent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    very_good: 'bg-teal-100 text-teal-800 border-teal-200',
                    good: 'bg-blue-100 text-blue-800 border-blue-200',
                    acceptable: 'bg-amber-100 text-amber-800 border-amber-200',
                    needs_repeat: 'bg-rose-100 text-rose-800 border-rose-200',
                  };

                  const gradeLabels: Record<string, string> = {
                    excellent: 'ممتاز',
                    very_good: 'جيد جداً',
                    good: 'جيد',
                    acceptable: 'مقبول',
                    needs_repeat: 'يحتاج إعادة',
                  };

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono text-slate-600 whitespace-nowrap">{r.date}</td>
                      <td className="p-3.5 font-bold text-slate-800">{r.studentName}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {typeLabels[r.type] || r.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-emerald-950">
                        سورة {r.surahName} (الآيات {r.fromAyah} إلى {r.toAyah})
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {r.pagesCount} صفحة
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <span>★ {r.masteryScore}/5</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-emerald-700 text-[11px]">تجويد: {r.tajweedScore}/5</span>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                            gradeColors[r.grade] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {gradeLabels[r.grade] || r.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-xs">
                        {r.teacherNotes && <p className="truncate">{r.teacherNotes}</p>}
                        {r.nextAssignment && (
                          <p className="text-[10px] text-emerald-800 font-semibold truncate">
                            خطة الغد: {r.nextAssignment}
                          </p>
                        )}
                        {!r.teacherNotes && !r.nextAssignment && <span className="text-slate-400">—</span>}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {r.pointsAwarded > 0 ? (
                          <span className="text-amber-600 font-bold flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            +{r.pointsAwarded}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">{r.teacherName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
