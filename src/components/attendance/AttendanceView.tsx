import React, { useState } from 'react';
import { Circle, Student, AttendanceRecord, AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  HelpCircle,
  Save,
  Users,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AttendanceViewProps {
  circles: Circle[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendanceEntry: (data: Omit<AttendanceRecord, 'id' | 'createdAt'>) => Promise<void>;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  circles,
  students,
  attendanceRecords,
  onSaveAttendanceEntry,
}) => {
  const [selectedCircleId, setSelectedCircleId] = useState(circles[0]?.id || 'all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Selected circle object
  const currentCircle = circles.find((c) => c.id === selectedCircleId);

  // Students belonging to selected circle
  const circleStudents = students.filter((s) => {
    if (s.status === 'archived') return false;
    if (selectedCircleId === 'all') return true;
    return s.circleId === selectedCircleId;
  });

  // Local state for today's statuses, initialized from existing attendanceRecords for this date
  const [attendanceState, setAttendanceState] = useState<
    Record<string, { status: AttendanceStatus; lateMinutes?: number; excuseReason?: string }>
  >({});

  // Sync attendance state when date or circle changes
  React.useEffect(() => {
    const existingForDate: Record<string, { status: AttendanceStatus; lateMinutes?: number; excuseReason?: string }> = {};
    attendanceRecords.forEach((rec) => {
      if (rec.date === selectedDate) {
        existingForDate[rec.studentId] = {
          status: rec.status,
          lateMinutes: rec.lateMinutes,
          excuseReason: rec.excuseReason,
        };
      }
    });
    setAttendanceState(existingForDate);
  }, [selectedDate, attendanceRecords]);

  const handleSetStatus = (
    studentId: string,
    status: AttendanceStatus,
    lateMinutes?: number,
    excuseReason?: string
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        status,
        lateMinutes: lateMinutes ?? (status === 'late' ? 10 : undefined),
        excuseReason: excuseReason ?? (status === 'excused' ? 'عذر مسبق من ولي الأمر' : undefined),
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = { ...attendanceState };
    circleStudents.forEach((st) => {
      updated[st.id] = { status: 'present' };
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = async () => {
    try {
      setSubmitting(true);
      setSuccessMessage('');

      for (const st of circleStudents) {
        const entry = attendanceState[st.id] || { status: 'present' };
        await onSaveAttendanceEntry({
          studentId: st.id,
          studentName: st.fullName,
          circleId: st.circleId || '',
          circleName: st.circleName || '',
          date: selectedDate,
          status: entry.status,
          lateMinutes: entry.lateMinutes,
          excuseReason: entry.excuseReason,
          markedBy: 'إدارة الجامع / المعلم',
        });
      }

      setSuccessMessage('تم حفظ سجل الحضور والغياب بنجاح وتحديث نقاط الالتزام!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ الحضور');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats for the chosen date
  const dateRecords = circleStudents.map((st) => attendanceState[st.id]?.status || 'unmarked');
  const presentCount = dateRecords.filter((s) => s === 'present').length;
  const lateCount = dateRecords.filter((s) => s === 'late').length;
  const absentCount = dateRecords.filter((s) => s === 'absent').length;
  const excusedCount = dateRecords.filter((s) => s === 'excused').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-800" />
            <span>سجل الحضور والغياب اليومي لحلقات الجامع</span>
          </h2>
          <p className="text-xs text-slate-500">
            تحضير الطلاب ومنع السجلات المكررة وضبط التأخر والأعذار مع احتساب نقاط الالتزام
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>تحضير الكل كـ حاضر</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            disabled={submitting || circleStudents.length === 0}
            className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>{submitting ? 'جارٍ الحفظ...' : 'حفظ سجل اليوم'}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Selectors & Date Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 text-xs">
        <div>
          <label className="block text-slate-700 font-bold mb-1">الحلقة القرآنية:</label>
          <select
            value={selectedCircleId}
            onChange={(e) => setSelectedCircleId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="all">جميع الحلقات ({students.length} طالب)</option>
            {circles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - المعلم: {c.teacherName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-bold mb-1">تاريخ التحضير:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Live Counters */}
        <div className="sm:col-span-2 flex items-center justify-around bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">حاضر</span>
            <span className="text-sm font-bold text-emerald-700">{presentCount}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">متأخر</span>
            <span className="text-sm font-bold text-amber-600">{lateCount}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">غائب</span>
            <span className="text-sm font-bold text-rose-600">{absentCount}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">معذور</span>
            <span className="text-sm font-bold text-blue-600">{excusedCount}</span>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {circleStudents.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا يوجد طلاب مسجلون في هذه الحلقة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الرقم الأكاديمي</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">الحلقة المسندة</th>
                  <th className="p-3.5 text-center">حالة الحضور</th>
                  <th className="p-3.5">تفاصيل التأخر / العذر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {circleStudents.map((st) => {
                  const entry = attendanceState[st.id] || { status: 'present' };
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-emerald-900 whitespace-nowrap">
                        {st.studentNumber}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">
                        {st.fullName}
                      </td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {st.circleName || 'حلقة عامة'}
                      </td>

                      {/* Status Toggle Buttons */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'present')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              entry.status === 'present'
                                ? 'bg-emerald-700 text-white shadow-xs scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                            }`}
                          >
                            حاضر
                          </button>

                          {/* Late */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'late')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              entry.status === 'late'
                                ? 'bg-amber-600 text-white shadow-xs scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-800'
                            }`}
                          >
                            متأخر
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'absent')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              entry.status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-800'
                            }`}
                          >
                            غائب
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(st.id, 'excused')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              entry.status === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-800'
                            }`}
                          >
                            معذور
                          </button>
                        </div>
                      </td>

                      {/* Detail inputs */}
                      <td className="p-3.5 min-w-[200px]">
                        {entry.status === 'late' && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 whitespace-nowrap">تأخر:</span>
                            <input
                              type="number"
                              min="1"
                              max="120"
                              value={entry.lateMinutes || 10}
                              onChange={(e) =>
                                handleSetStatus(st.id, 'late', Number(e.target.value), entry.excuseReason)
                              }
                              className="w-16 px-2 py-1 border border-amber-300 rounded text-center font-bold text-amber-800"
                            />
                            <span className="text-slate-500">دقيقة</span>
                          </div>
                        )}

                        {entry.status === 'excused' && (
                          <input
                            type="text"
                            value={entry.excuseReason || ''}
                            onChange={(e) =>
                              handleSetStatus(st.id, 'excused', entry.lateMinutes, e.target.value)
                            }
                            placeholder="سبب العذر (مرض، سفر، موعد...)"
                            className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
                          />
                        )}

                        {entry.status === 'absent' && (
                          <span className="text-rose-600 font-semibold text-[11px]">
                            غياب بدون عذر مسبق (خصم نقاط)
                          </span>
                        )}

                        {entry.status === 'present' && (
                          <span className="text-emerald-600 font-medium text-[11px]">
                            حضور منتظم ومبكر (+2 نقطة)
                          </span>
                        )}
                      </td>
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
