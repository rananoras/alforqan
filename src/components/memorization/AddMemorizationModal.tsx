import React, { useState, useEffect } from 'react';
import { Student, Circle, MemorizationRecord, RecitationType, PerformanceGrade } from '../../types';
import { QURAN_SURAHS } from '../../data/quranData';
import { useAuth } from '../../context/AuthContext';
import { X, BookOpen, Star, Sparkles, Save, Check } from 'lucide-react';

interface AddMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  students: Student[];
  preselectedStudent?: Student | null;
}

export const AddMemorizationModal: React.FC<AddMemorizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  preselectedStudent,
}) => {
  const { userProfile } = useAuth();

  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<RecitationType>('new_memorization');
  const [surahNumber, setSurahNumber] = useState<number>(78); // Default to An-Naba
  const [fromAyah, setFromAyah] = useState<number>(1);
  const [toAyah, setToAyah] = useState<number>(15);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const [masteryScore, setMasteryScore] = useState<number>(5);
  const [tajweedScore, setTajweedScore] = useState<number>(5);
  const [grade, setGrade] = useState<PerformanceGrade>('excellent');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [nextAssignment, setNextAssignment] = useState('');
  const [pointsAwarded, setPointsAwarded] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Current selected Surah details
  const currentSurah = QURAN_SURAHS.find((s) => s.number === surahNumber) || QURAN_SURAHS[77];

  useEffect(() => {
    if (preselectedStudent) {
      setStudentId(preselectedStudent.id);
    } else if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [preselectedStudent, students]);

  // Adjust default points when type and mastery change
  useEffect(() => {
    if (type === 'new_memorization') {
      setPointsAwarded(masteryScore >= 4 ? 10 * pagesCount : 5);
    } else if (type === 'near_review') {
      setPointsAwarded(masteryScore >= 4 ? 5 * pagesCount : 3);
    } else if (type === 'far_review') {
      setPointsAwarded(masteryScore >= 4 ? 15 : 8);
    } else {
      setPointsAwarded(4);
    }
  }, [type, pagesCount, masteryScore]);

  if (!isOpen) return null;

  const handleSurahChange = (sNum: number) => {
    setSurahNumber(sNum);
    const surah = QURAN_SURAHS.find((s) => s.number === sNum);
    setFromAyah(1);
    setToAyah(Math.min(10, surah?.numberOfAyahs || 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      setErrorMsg('يرجى اختيار الطالب');
      return;
    }

    const studentObj = students.find((s) => s.id === studentId);
    if (!studentObj) return;

    try {
      setSubmitting(true);
      setErrorMsg('');

      const recordData = {
        studentId,
        studentName: studentObj.fullName,
        circleId: studentObj.circleId || '',
        date,
        type,
        surahName: currentSurah.name,
        surahNumber: currentSurah.number,
        fromAyah: Number(fromAyah),
        toAyah: Number(toAyah),
        pagesCount: Number(pagesCount),
        masteryScore: Number(masteryScore),
        tajweedScore: Number(tajweedScore),
        grade,
        teacherName: userProfile?.displayName || 'معلم الحلقة',
        teacherNotes,
        nextAssignment,
        pointsAwarded: Number(pointsAwarded),
      };

      await onSubmit(recordData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء رصد التسميع');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base font-quran">
              رصد جلسة تسميع وحفظ القرآن الكريم
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Row 1: Student & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                اختيار الطالب <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.fullName} ({st.studentNumber}) - {st.circleName || 'عامة'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">تاريخ الجلسة</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Row 2: Type & Surah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">نوع التسميع</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RecitationType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="new_memorization">حفظ جديد (درس اليوم)</option>
                <option value="near_review">مراجعة قريبة (آخر 5 أجزاء)</option>
                <option value="far_review">مراجعة بعيدة (جزء كامل/سابق)</option>
                <option value="recitation">تلقين وتصحيح تلاوة</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                سورة القرآن الكريم ({QURAN_SURAHS.length} سورة)
              </label>
              <select
                value={surahNumber}
                onChange={(e) => handleSurahChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-quran text-sm"
              >
                {QURAN_SURAHS.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. سورة {s.name} ({s.numberOfAyahs} آية - {s.revelationType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Ayahs & Pages */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-medium mb-1">من الآية</label>
              <input
                type="number"
                min="1"
                max={currentSurah.numberOfAyahs}
                value={fromAyah}
                onChange={(e) => setFromAyah(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">إلى الآية</label>
              <input
                type="number"
                min={fromAyah}
                max={currentSurah.numberOfAyahs}
                value={toAyah}
                onChange={(e) => setToAyah(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">عدد الأوجه/الصفحات</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={pagesCount}
                onChange={(e) => setPagesCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center font-bold"
              />
            </div>
          </div>

          {/* Row 4: Mastery & Tajweed Star Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
            <div>
              <label className="block text-emerald-950 font-bold mb-1">
                تقييم الحفظ والإتقان (1 إلى 5)
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMasteryScore(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= masteryScore ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-800 mr-2">{masteryScore} من 5</span>
              </div>
            </div>

            <div>
              <label className="block text-emerald-950 font-bold mb-1">
                أحكام التجويد ومخارج الحروف (1 إلى 5)
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTajweedScore(star)}
                    className="p-1 text-emerald-600 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= tajweedScore ? 'fill-emerald-500 text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-emerald-800 mr-2">{tajweedScore} من 5</span>
              </div>
            </div>
          </div>

          {/* Row 5: Grade & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">التقدير العام</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as PerformanceGrade)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              >
                <option value="excellent">ممتاز (5/5)</option>
                <option value="very_good">جيد جداً (4/5)</option>
                <option value="good">جيد (3/5)</option>
                <option value="acceptable">مقبول (2/5)</option>
                <option value="needs_repeat">يحتاج إعادة وتثبيت (1/5)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                <span>النقاط التشجيعية الممنوحة</span>
                <span className="text-amber-600 font-normal text-[10px]">تضاف تلقائياً لرصيد الطالب</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={pointsAwarded}
                  onChange={(e) => setPointsAwarded(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-amber-700"
                />
                <span className="text-xs font-bold text-slate-600 shrink-0">نقطة تميز</span>
              </div>
            </div>
          </div>

          {/* Row 6: Teacher Notes & Next Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">ملاحظات المعلم والتوجيه</label>
              <textarea
                rows={2}
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                placeholder="توجيه خاص بالمدود، الغنن، تثبيت الآيات..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                الواجب القادم / خطة الغد
              </label>
              <textarea
                rows={2}
                value={nextAssignment}
                onChange={(e) => setNextAssignment(e.target.value)}
                placeholder="مثال: سورة النبأ من آية 16 إلى 30 + مراجعة وجهين..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              <span>{submitting ? 'جارٍ الرصد...' : 'اعتماد التسميع ومنح النقاط'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
