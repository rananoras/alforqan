import React, { useState } from 'react';
import { Circle, Student, MemorizationRecord, AttendanceRecord } from '../../types';
import {
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  Plus,
  Users,
  Clock,
  MapPin,
  Star,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TeacherPortalViewProps {
  circles: Circle[];
  students: Student[];
  memorizationRecords: MemorizationRecord[];
  attendanceRecords: AttendanceRecord[];
  onOpenAddMemorization: (student?: Student) => void;
  onOpenAttendance: () => void;
  onOpenAwardPoints: (student?: Student) => void;
  onViewStudent: (student: Student) => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  circles,
  students,
  memorizationRecords,
  attendanceRecords,
  onOpenAddMemorization,
  onOpenAttendance,
  onOpenAwardPoints,
  onViewStudent,
}) => {
  const { userProfile } = useAuth();
  const [selectedCircleId, setSelectedCircleId] = useState<string>(circles[0]?.id || 'all');

  const currentCircle = circles.find((c) => c.id === selectedCircleId);

  // Filter students for the teacher's selected circle
  const circleStudents = students.filter((s) => {
    if (s.status === 'archived') return false;
    if (selectedCircleId === 'all') return true;
    return s.circleId === selectedCircleId;
  });

  // Recent recitation records for this circle's students
  const circleStudentIds = new Set(circleStudents.map((s) => s.id));
  const recentRecitations = memorizationRecords
    .filter((m) => circleStudentIds.has(m.studentId))
    .slice(0, 8);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Teacher Welcome Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-emerald-950 rounded-3xl p-6 text-white shadow-lg border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 text-xs font-semibold mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>بوابة المعلم والمشرف القرآني</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-quran text-amber-300">
            مرحباً بك فضيلة المعلم: {userProfile?.displayName || 'معلم الحلقة'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            متابعة طلاب حلقتك، رصد التسميع اليومي ودرجات الإتقان، تحضير الحلقات، ومنح نقاط التميز التشجيعية.
          </p>
        </div>

        {/* Quick Teacher Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => onOpenAddMemorization()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>رصد تسميع طالب</span>
          </button>

          <button
            onClick={onOpenAttendance}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl border border-emerald-600 shadow transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4 text-amber-300" />
            <span>تحضير الحلقة</span>
          </button>
        </div>
      </div>

      {/* Circle Selector & Info Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">الحلقة المعروضة:</span>
          <select
            value={selectedCircleId}
            onChange={(e) => setSelectedCircleId(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-emerald-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">جميع الحلقات المكلف بها ({students.length} طالب)</option>
            {circles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.timing})
              </option>
            ))}
          </select>
        </div>

        {currentCircle && (
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{currentCircle.timing}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{currentCircle.location}</span>
            </span>
            <span className="flex items-center gap-1 font-bold text-emerald-800">
              <Users className="w-3.5 h-3.5" />
              <span>{circleStudents.length} طالب منتظم</span>
            </span>
          </div>
        )}
      </div>

      {/* Student Roster Table for Teacher */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-xs sm:text-sm text-slate-800 font-quran flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-800" />
            <span>كشف طلاب الحلقة ({circleStudents.length} طالب)</span>
          </h3>
          <span className="text-xs text-slate-500">
            انقر على اسم الطالب لعرض ملفه أو الإجراء السريع لرصد التسميع
          </span>
        </div>

        {circleStudents.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا يوجد طلاب في هذه الحلقة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الرقم الأكاديمي</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">المرحلة الدراسية</th>
                  <th className="p-3.5">الأجزاء المنجزة</th>
                  <th className="p-3.5">نقاط التميز</th>
                  <th className="p-3.5 text-center">إجراءات المعلم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {circleStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-900">{st.studentNumber}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{st.fullName}</span>
                      <span className="text-[10px] text-slate-500">ولي الأمر: {st.guardianName} ({st.guardianPhone})</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{st.academicGrade}</td>
                    <td className="p-3.5 font-bold text-amber-700">{st.completedJuz} جزء</td>
                    <td className="p-3.5 font-bold text-purple-700">{st.totalPoints} نقطة</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenAddMemorization(st)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg font-bold text-xs flex items-center gap-1"
                          title="رصد تسميع"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          <span>رصد تسميع</span>
                        </button>

                        <button
                          onClick={() => onOpenAwardPoints(st)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold text-xs flex items-center gap-1"
                          title="منح نقاط مكافأة"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>مكافأة</span>
                        </button>

                        <button
                          onClick={() => onViewStudent(st)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                          title="عرض الملف الشامل"
                        >
                          الملف
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

      {/* Recent Recitation Activity in Teacher's Circles */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
        <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-3 font-quran flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-800" />
          <span>أحدث جلسات التسميع لطلابك ({recentRecitations.length})</span>
        </h4>

        {recentRecitations.length === 0 ? (
          <p className="text-center py-8 text-slate-400 text-xs">لم يتم تسجيل جلسات تسميع اليوم بعد.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentRecitations.map((r) => (
              <div
                key={r.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{r.studentName}</span>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    سورة {r.surahName} ({r.fromAyah}-{r.toAyah})
                  </span>
                  <span className="text-[10px] text-slate-400 block">{r.date}</span>
                </div>
                <div className="text-left">
                  <span className="text-amber-500 font-bold block">★ {r.masteryScore}/5</span>
                  <span className="text-[10px] text-emerald-800 font-semibold">{r.grade}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
