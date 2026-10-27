import React, { useState } from 'react';
import { Circle, Registration, Student, MemorizationRecord } from '../../types';
import {
  BookOpen,
  UserPlus,
  Send,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  GraduationCap,
  Calendar,
  Phone,
  MapPin,
  Award,
  ChevronLeft,
  AlertCircle,
  Star,
  Users,
  Check,
  ArrowDown,
  MessageCircle,
} from 'lucide-react';

interface PublicRegistrationHomeProps {
  circles: Circle[];
  registrations: Registration[];
  students?: Student[];
  memorizationRecords?: MemorizationRecord[];
  onSubmitRegistration: (data: any) => Promise<any>;
  onNavigateToAdmin: () => void;
  onNavigateToTeacher?: () => void;
  onNavigateToStudent?: () => void;
}

export const PublicRegistrationHome: React.FC<PublicRegistrationHomeProps> = ({
  circles,
  registrations,
  students = [],
  memorizationRecords = [],
  onSubmitRegistration,
  onNavigateToAdmin,
}) => {
  // Registration Form State
  const [formData, setFormData] = useState({
    studentFullName: '',
    birthDate: '',
    academicGrade: 'الصف الرابع الابتدائي',
    nationalId: '',
    phone: '',
    address: 'حي جامع سعيد الجابي',
    program: 'حفظ عام وتجويد',
    preferredCircleId: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'أب',
    guardianEmail: '',
    guardianJob: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submittedStudentName, setSubmittedStudentName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Inquiry Search State
  const [inquiryQuery, setInquiryQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [matchedReg, setMatchedReg] = useState<Registration | null>(null);
  const [studentLatestMem, setStudentLatestMem] = useState<MemorizationRecord | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentFullName.trim() || !formData.guardianName.trim() || !formData.guardianPhone.trim()) {
      setErrorMsg('يرجى تعبئة الحقول الأساسية: اسم الطالب، اسم ولي الأمر، ورقم الجوال');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await onSubmitRegistration(formData);
      setSubmittedStudentName(formData.studentFullName);
      setSubmittedSuccess(true);
      // Reset form
      setFormData({
        studentFullName: '',
        birthDate: '',
        academicGrade: 'الصف الرابع الابتدائي',
        nationalId: '',
        phone: '',
        address: 'حي جامع سعيد الجابي',
        program: 'حفظ عام وتجويد',
        preferredCircleId: '',
        guardianName: '',
        guardianPhone: '',
        guardianRelation: 'أب',
        guardianEmail: '',
        guardianJob: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إرسال طلب التسجيل');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inquiryQuery.trim().toLowerCase();
    if (!q) return;

    setSearched(true);

    // 1. Search in Active Students
    const foundStudent = students.find(
      (s) =>
        s.studentNumber.toLowerCase().includes(q) ||
        s.guardianPhone.includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        s.fullName.toLowerCase().includes(q) ||
        (s.nationalId && s.nationalId.includes(q))
    );

    if (foundStudent) {
      setMatchedStudent(foundStudent);
      setMatchedReg(null);

      // Find latest memorization record
      const studentMems = memorizationRecords
        .filter((m) => m.studentId === foundStudent.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setStudentLatestMem(studentMems[0] || null);
      return;
    }

    // 2. Search in Registrations
    const foundReg = registrations.find(
      (r) =>
        r.guardianPhone.includes(q) ||
        r.studentFullName.toLowerCase().includes(q) ||
        (r.nationalId && r.nationalId.includes(q))
    );

    if (foundReg) {
      setMatchedReg(foundReg);
      setMatchedStudent(null);
      setStudentLatestMem(null);
      return;
    }

    setMatchedStudent(null);
    setMatchedReg(null);
    setStudentLatestMem(null);
  };

  const handleSelectCircleForReg = (circleId: string) => {
    setFormData((prev) => ({ ...prev, preferredCircleId: circleId }));
    const regSection = document.getElementById('register-section');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Top students for Honor Roll
  const honorStudents = [...students]
    .filter((s) => s.status === 'active')
    .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300">
      {/* 1. HERO BANNER: Classic Clean Halaqat Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-12 text-white shadow-xl border border-emerald-700/60 text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-quran text-amber-300 leading-tight">
            جامع سعيد الجابي
          </h1>

          <p className="text-xl sm:text-2xl text-white font-quran">
            مجمع حلقات تحفيظ القرآن الكريم والتعليم الإيماني
          </p>

          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-sans max-w-xl mx-auto pt-2">
            «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» — بيئة قرآنية تربوية متكاملة ترعى حفظ كتاب الله، وتضبط أحكام التجويد، وتغرس الأخلاق الفاضلة في نفوس النشء.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <a
              href="#register-section"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>تسجيل طالب جديد</span>
            </a>

            <a
              href="#circles-section"
              className="px-5 py-3 bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>جدول الحلقات</span>
            </a>

            <a
              href="#inquiry-section"
              className="px-5 py-3 bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>استعلام ومتابعة الطالب</span>
            </a>

            <button
              onClick={onNavigateToAdmin}
              className="px-4 py-3 bg-emerald-950/90 hover:bg-emerald-900 text-amber-300 font-semibold text-xs sm:text-sm rounded-xl border border-amber-400/40 transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>لوحة الإدارة</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS & KEY FEATURES BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-quran text-slate-800">
            {circles.length || 4}
          </div>
          <div className="text-xs text-slate-500 font-medium">حلقات قرآنية معتمدة</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-quran text-slate-800">
            {students.length > 0 ? students.length : '120+'}
          </div>
          <div className="text-xs text-slate-500 font-medium">طالباً في الحلقات</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-quran text-slate-800">
            {circles.filter((c) => c.teacherName).length || 4}
          </div>
          <div className="text-xs text-slate-500 font-medium">مشايخ ومعلمون مجازون</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold font-quran text-slate-800">100%</div>
          <div className="text-xs text-slate-500 font-medium">متابعة إلكترونية دقيقة</div>
        </div>
      </section>

      {/* 3. CIRCLES SCHEDULE SECTION */}
      <section id="circles-section" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>الحلقات ومواعيدها</span>
          </div>
          <h2 className="text-2xl font-bold font-quran text-slate-900">
            جدول الحلقات القرآنية بجامع سعيد الجابي
          </h2>
          <p className="text-xs text-slate-500">
            حلقات متدرجة تناسب جميع الأعمار والمستويات تحت إشراف نخبة من المعلمين المعتمدين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {circles.map((circle) => (
            <div
              key={circle.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg">
                    {circle.program || 'حفظ عام'}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{circle.timing}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base font-quran text-slate-900 mb-1">
                  {circle.name}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>المعلم المشرف: <strong>{circle.teacherName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>الموقع بالجامع: {circle.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>عدد الطلاب الحالي: {circle.studentCount || 0} طالباً</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{circle.days || 'الأحد - الخميس'}</span>
                <button
                  onClick={() => handleSelectCircleForReg(circle.id)}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>سجل بهذه الحلقة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAST REGISTRATION FORM SECTION */}
      <section id="register-section" className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10">
        <div className="max-w-2xl mx-auto text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold">
            <UserPlus className="w-3.5 h-3.5" />
            <span>الالتحاق بالحلقات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-quran text-slate-900">
            استمارة التسجيل في حلقات جامع سعيد الجابي
          </h2>
          <p className="text-xs text-slate-500">
            سجل بيانات الطالب للتسجيل المباشر وسيتواصل معكم مشرف الحلقة لتحديد موعد البدء.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="max-w-lg mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-quran">
              تم إرسال طلب التسجيل بنجاح!
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              تم استلام طلب تسجيل الطالب <strong className="text-emerald-950 font-bold">{submittedStudentName}</strong> في حلقات جامع سعيد الجابي. يجري اعتماد التسجيل من المشرفين وتعيين الحلقة المناسبة.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                تسجيل طالب آخر
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  اسم الطالب الرباعي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentFullName}
                  onChange={(e) => setFormData({ ...formData, studentFullName: e.target.value })}
                  placeholder="مثال: عبد الله أحمد صالح المحمد"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  المرحلة الدراسية أو العمر <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.academicGrade}
                  onChange={(e) => setFormData({ ...formData, academicGrade: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                >
                  <option value="الروضة وبراعم القرآن (4-6 سنوات)">الروضة وبراعم القرآن (4-6 سنوات)</option>
                  <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
                  <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
                  <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
                  <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                  <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                  <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
                  <option value="المرحلة المتوسطة">المرحلة المتوسطة</option>
                  <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                  <option value="المرحلة الجامعية والكبار">المرحلة الجامعية والكبار</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الحلقة المرغوبة</label>
                <select
                  value={formData.preferredCircleId}
                  onChange={(e) => setFormData({ ...formData, preferredCircleId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                >
                  <option value="">-- ترشيح الحلقة المناسبة تلقائياً --</option>
                  {circles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.timing})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  اسم ولي الأمر <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="اسم الأب أو ولي الأمر"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  رقم جوال ولي الأمر (واتساب) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">مسار التحفيظ</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'حفظ عام وتجويد', label: 'حفظ عام وتجويد', desc: 'مقرر يومي مع أحكام التلاوة' },
                    { id: 'المسار المكثف للحفاظ', label: 'المسار المكثف', desc: 'لختم القرآن وتثبيته' },
                    { id: 'براعم القرآن للتلقين', label: 'براعم القرآن', desc: 'تأسيس وحفظ جزء عم' },
                  ].map((p) => (
                    <label
                      key={p.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.program === p.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{p.label}</span>
                        <input
                          type="radio"
                          name="programRadio"
                          checked={formData.program === p.id}
                          onChange={() => setFormData({ ...formData, program: p.id })}
                          className="accent-emerald-600"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal mt-1">{p.desc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-3 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{submitting ? 'جارٍ إرسال الطلب...' : 'إرسال طلب التسجيل في الحلقات'}</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 5. STUDENT LIVE INQUIRY & TRACKING SECTION */}
      <section id="inquiry-section" className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-800">
        <div className="max-w-2xl mx-auto text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>المتابعة السريعة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-quran text-amber-300">
            استعلام ومتابعة الطالب إلكترونياً
          </h2>
          <p className="text-xs text-emerald-200">
            أدخل رقم الطالب الأكاديمي (مثال: FRQ-2026-0001) أو رقم جوال ولي الأمر للاطلاع على آخر حفظ ونقاط التميز
          </p>
        </div>

        <form onSubmit={handleInquiry} className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            required
            value={inquiryQuery}
            onChange={(e) => setInquiryQuery(e.target.value)}
            placeholder="رقم الطالب أو رقم الجوال..."
            className="flex-1 px-4 py-3 bg-white/10 text-white placeholder-emerald-200/50 rounded-xl border border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-xs"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>بحث</span>
          </button>
        </form>

        {/* Search Results Display */}
        {searched && (
          <div className="max-w-xl mx-auto mt-6 animate-in fade-in slide-in-from-top-2">
            {matchedStudent ? (
              <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl space-y-4 border border-amber-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base font-quran text-emerald-950">
                      {matchedStudent.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      رقم القيد: {matchedStudent.studentNumber}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
                    طالب منتظم
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block">الحلقة المسندة</span>
                    <strong className="text-emerald-900 text-sm">
                      {matchedStudent.circleName || 'حلقة عامة'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block">رصيد نقاط التميز</span>
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{matchedStudent.totalPoints || 0} نقطة</span>
                    </div>
                  </div>
                </div>

                {studentLatestMem && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>آخر إنجاز تسميع مسجل:</span>
                    </div>
                    <p className="text-emerald-900">
                      سورة {studentLatestMem.surahName} (الآيات {studentLatestMem.fromAyah} إلى {studentLatestMem.toAyah})
                    </p>
                    <div className="text-[11px] text-emerald-700 flex items-center justify-between pt-1">
                      <span>إتقان التسميع: {studentLatestMem.grade === 'excellent' ? 'ممتاز' : 'جيد جداً'}</span>
                      <span>التاريخ: {studentLatestMem.date}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : matchedReg ? (
              <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl space-y-3 border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base font-quran text-slate-900">
                      {matchedReg.studentFullName}
                    </h3>
                    <p className="text-xs text-slate-500">طلب تسجيل جديد</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      matchedReg.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-900'
                        : matchedReg.status === 'rejected'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {matchedReg.status === 'approved'
                      ? '✓ تم القبول والاعتماد'
                      : matchedReg.status === 'rejected'
                      ? 'مرفوض'
                      : '⏳ قيد المراجعة والاعتماد'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  البرنامج المطلوب: <strong>{matchedReg.program}</strong>
                </p>
                {matchedReg.decisionNotes && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                    ملاحظات الإدارة: {matchedReg.decisionNotes}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-xs text-emerald-100">
                لم يتم العثور على طالب أو طلب تسجيل بهذا الرقم. يرجى التأكد من الرقم أو تقديم طلب تسجيل جديد.
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. HONOR BOARD (لوحة الشرف) */}
      <section id="honor-section" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>أوائل الحفاظ</span>
          </div>
          <h2 className="text-2xl font-bold font-quran text-slate-900">
            لوحة الشرف والمتميزين بجامع سعيد الجابي
          </h2>
          <p className="text-xs text-slate-500">
            تكريم الطلاب الأكثر تميزاً وإتقاناً في حفظ القرآن الكريم ونقاط التميز السلوكي
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(honorStudents.length > 0
            ? honorStudents
            : [
                { id: '1', fullName: 'عبد الرحمن خالد العمري', circleName: 'حلقة الإمام عاصم', totalPoints: 240, studentNumber: 'FRQ-2026-0001' },
                { id: '2', fullName: 'عمر عبد الله السالم', circleName: 'حلقة الإمام نافع', totalPoints: 215, studentNumber: 'FRQ-2026-0002' },
                { id: '3', fullName: 'يوسف إبراهيم النجار', circleName: 'حلقة زيد بن ثابت', totalPoints: 190, studentNumber: 'FRQ-2026-0003' },
              ]
          ).map((st, idx) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between hover:border-amber-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-quran text-sm shadow-xs ${
                    idx === 0
                      ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-300'
                      : idx === 1
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-quran">
                    {st.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-500">{st.circleName || 'حلقات الجامع'}</p>
                </div>
              </div>

              <div className="text-left">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{st.totalPoints} نقطة</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. MOSQUE FOOTER & CONTACT */}
      <footer className="bg-emerald-950 text-white rounded-3xl p-8 border border-emerald-800 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-emerald-800/80 pb-6 text-center md:text-right">
          <div>
            <h3 className="font-bold text-lg font-quran text-amber-300">
              جامع سعيد الجابي - مجمع حلقات تحفيظ القرآن الكريم
            </h3>
            <p className="text-xs text-emerald-200 mt-1">
              أوقات الحلقات: يومياً من بعد صلاة العصر وحتى بعد صلاة العشاء
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#register-section"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-xl transition-colors"
            >
              التسجيل في الحلقات
            </a>
            <button
              onClick={onNavigateToAdmin}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl border border-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>دخول الإدارة</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/80 gap-2">
          <span>© جميع الحقوق محفوظة لجامع سعيد الجابي 1447هـ</span>
          <span>تطبيق ويب متكامل متوافق مع الحواسيب والهواتف الذكية</span>
        </div>
      </footer>
    </div>
  );
};
