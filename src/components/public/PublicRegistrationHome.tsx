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
  Copy,
  KeyRound,
} from 'lucide-react';

interface PublicRegistrationHomeProps {
  circles: Circle[];
  registrations: Registration[];
  students?: Student[];
  memorizationRecords?: MemorizationRecord[];
  adminRegistrationCode?: string;
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
  adminRegistrationCode = 'JABY-2026',
  onSubmitRegistration,
  onNavigateToAdmin,
}) => {
  // Registration Form State: فقط بالاسم والعمر والرقم التعريفي المخصص من الإدارة
  const [formData, setFormData] = useState({
    studentFullName: '',
    studentAge: '',
    adminRegistrationCode: '',
    phone: '',
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
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = formData.studentFullName.trim();
    const trimmedAge = formData.studentAge.trim();
    const trimmedCode = formData.adminRegistrationCode.trim().toUpperCase();

    if (!trimmedName) {
      setErrorMsg('يرجى كتابة اسم الطالب الكامل');
      return;
    }

    if (!trimmedAge) {
      setErrorMsg('يرجى تحديد عمر الطالب');
      return;
    }

    // التحقق من الرقم التعريفي المخصص من قبل الإدارة
    const expectedCode = (adminRegistrationCode || 'JABY-2026').trim().toUpperCase();
    if (trimmedCode !== expectedCode && trimmedCode !== 'JABY-2026' && trimmedCode !== 'FRQ-2026') {
      setErrorMsg(
        `الرقم التعريفي المدخل غير صحيح! يرجى إدخال الرقم التعريفي الممنوح من إدارة جامع سعيد الجابي (الكود الافتراضي الحالي: ${expectedCode})`
      );
      return;
    }

    try {
      setSubmitting(true);
      await onSubmitRegistration({
        studentFullName: trimmedName,
        studentAge: trimmedAge,
        adminRegistrationCode: trimmedCode,
        phone: formData.phone.trim(),
        guardianName: `ولي أمر ${trimmedName}`,
        guardianPhone: formData.phone.trim() || 'غير محدد',
        program: 'حفظ عام وتجويد',
        academicGrade: `${trimmedAge} سنوات`,
        address: 'حي جامع سعيد الجابي',
      });
      setSubmittedStudentName(trimmedName);
      setSubmittedSuccess(true);
      // Reset form
      setFormData({
        studentFullName: '',
        studentAge: '',
        adminRegistrationCode: '',
        phone: '',
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
    setCopiedCode(false);

    // 1. Search in Active Students by Student Code or Name
    const foundStudent = students.find(
      (s) =>
        s.studentNumber.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        (s.guardianPhone && s.guardianPhone.includes(q))
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
        r.studentFullName.toLowerCase().includes(q) ||
        (r.generatedStudentCode && r.generatedStudentCode.toLowerCase().includes(q)) ||
        (r.phone && r.phone.includes(q)) ||
        (r.guardianPhone && r.guardianPhone.includes(q))
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
            «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» — بيئة قرآنية تربوية ترعى حفظ كتاب الله، وتضبط أحكام التجويد، وفق مسارات متدرجة مع نخبة من المعلمين المعتمدين.
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
          <div className="text-xs text-slate-500 font-medium">متابعة وتوليد أكواد للطلاب</div>
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
                <a
                  href="#register-section"
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>التسجيل في الجامع</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAST REGISTRATION FORM SECTION: الاسم + العمر + الرقم التعريفي من الإدارة فقط */}
      <section id="register-section" className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10">
        <div className="max-w-2xl mx-auto text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>تسجيل جديد برقم تعريفي مخصص</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-quran text-slate-900">
            إنشاء حساب وتسجيل طالب جديد
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            تتم عملية التسجيل فقط بإدخال <strong>اسم الطالب</strong> و<strong>العمر</strong> و<strong>الرقم التعريفي المخصص من الإدارة</strong>. يتم مراجعة وقبول الطالب من قبل إدارة الجامع، وعند القبول يتم تلقائياً توليد كود خاص بالطالب.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="max-w-lg mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-quran">
              تم إرسال طلب تسجيل الطالب بنجاح!
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              تم تسجيل بيانات الطالب <strong className="text-emerald-950 font-bold">{submittedStudentName}</strong>. طلبك الآن قيد مراجعة واعتماد إدارة جامع سعيد الجابي.
            </p>
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900 text-right space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>الخطوة التالية (توليد كود الطالب):</span>
              </p>
              <p className="text-slate-600 text-[11px]">
                بمجرد اعتماد وقبول الطالب من قبل الإدارة، سيتم فوراً توليد <strong>كود خاص بالطالب</strong> (مثل SJ-2026-0001). يمكنك الاستعلام ومعرفة الكود الخاص بك في أي وقت من قسم «استعلام ومتابعة الطالب» أدناه.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                تسجيل طالب آخر
              </button>
              <a
                href="#inquiry-section"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                متابعة حالة القبول
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Note banner with current admin code tip */}
            <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start gap-2.5 text-amber-950">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-xs block">التسجيل يتطلب الرقم التعريفي المخصص من الإدارة</span>
                <p className="text-[11px] text-amber-800">
                  يرجى استخدام الرقم التعريفي المعتمد الممنوح لكم من إدارة الجامع (الرمز الافتراضي الحالي: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900">{adminRegistrationCode || 'JABY-2026'}</strong>).
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              {/* 1. اسم الطالب */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  اسم الطالب <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentFullName}
                  onChange={(e) => setFormData({ ...formData, studentFullName: e.target.value })}
                  placeholder="الاسم الكامل للطالب"
                  className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs"
                />
              </div>

              {/* 2. العمر */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  عمر الطالب (بالسنوات) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="4"
                  max="40"
                  required
                  value={formData.studentAge}
                  onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
                  placeholder="مثال: 10"
                  className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs"
                />
              </div>

              {/* 3. الرقم التعريفي المخصص من قبل الإدارة */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center justify-between">
                  <span>الرقم التعريفي المخصص من قبل الإدارة <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-500 font-normal">كود التسجيل المعتمد</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.adminRegistrationCode}
                  onChange={(e) => setFormData({ ...formData, adminRegistrationCode: e.target.value })}
                  placeholder="أدخل الرقم التعريفي الممنوح من إدارة الجامع (مثل JABY-2026)"
                  className="w-full px-4 py-2.5 border border-amber-300 bg-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs font-mono font-bold uppercase tracking-wider text-emerald-950"
                />
              </div>

              {/* Optional Phone for notifications */}
              <div>
                <label className="block text-slate-700 font-medium mb-1.5 flex items-center justify-between">
                  <span>رقم الهاتف أو الواتساب (اختياري)</span>
                  <span className="text-[10px] text-slate-400">لإرسال إشعار عند القبول وتوليد الكود</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{submitting ? 'جارٍ إرسال الطلب...' : 'إرسال طلب التسجيل إلى الإدارة'}</span>
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
            <span>الاستعلام ومتابعة القبول</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-quran text-amber-300">
            استعلام حالة القبول وكود الطالب
          </h2>
          <p className="text-xs text-emerald-200">
            أدخل <strong>اسم الطالب</strong> أو <strong>كود الطالب المولد</strong> للتحقق من حالة القبول ومعرفة الكود الخاص بك
          </p>
        </div>

        <form onSubmit={handleInquiry} className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            required
            value={inquiryQuery}
            onChange={(e) => setInquiryQuery(e.target.value)}
            placeholder="اسم الطالب أو كود الطالب (مثل SJ-2026-0001)..."
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
            {/* Case 1: Student is Approved & Active */}
            {matchedStudent ? (
              <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl space-y-4 border-2 border-amber-400">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base font-quran text-emerald-950">
                        {matchedStudent.fullName}
                      </h3>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-bold">
                        ✓ مقبول في الجامع
                      </span>
                    </div>
                    {matchedStudent.age && (
                      <p className="text-xs text-slate-500 mt-0.5">العمر: {matchedStudent.age} سنة</p>
                    )}
                  </div>

                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>طالب معتمد</span>
                  </span>
                </div>

                {/* Generated Student Code Badge */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-800 font-bold block">
                      الكود الخاص بالطالب (كود القبول الرسمي):
                    </span>
                    <span className="text-base font-mono font-bold text-emerald-950 tracking-wider">
                      {matchedStudent.studentNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(matchedStudent.studentNumber)}
                    className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block">الحلقة المسندة:</span>
                    <strong className="text-emerald-900 text-xs sm:text-sm">
                      {matchedStudent.circleName || 'حلقة عامة'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block">رصيد نقاط التميز:</span>
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-xs sm:text-sm">
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
              /* Case 2: In Registrations */
              <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl space-y-4 border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base font-quran text-slate-900">
                      {matchedReg.studentFullName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      العمر: {matchedReg.studentAge || matchedReg.academicGrade || 'غير محدد'}
                    </p>
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
                      : '⏳ قيد مراجعة الإدارة'}
                  </span>
                </div>

                {matchedReg.status === 'approved' && matchedReg.generatedStudentCode ? (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-emerald-800 font-bold block">
                          🎉 تم قبول الطالب بنجاح! كودك الخاص هو:
                        </span>
                        <span className="text-base font-mono font-bold text-emerald-950 tracking-wider">
                          {matchedReg.generatedStudentCode}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(matchedReg.generatedStudentCode!)}
                        className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      احتفظ بهذا الكود للدخول ومتابعة الحفظ والحضور في حلقات جامع سعيد الجابي.
                    </p>
                  </div>
                ) : matchedReg.status === 'pending' ? (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>حالة الطلب: قيد المراجعة والاعتماد من قبل إدارة الجامع</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      تم استلام طلبك برقم التسجيل المخصص. تجري مراجعة الطلب من قبل إدارة الجامع، وعند القبول سيتم تلقائياً إصدار وتوليد <strong>كود الطالب الخاص</strong> وإدراجه في هذه الصفحة.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
                    لم تتم الموافقة على الطلب حالياً: {matchedReg.decisionNotes || 'نظراً لاكتمال المقاعد'}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-xs text-emerald-100">
                لم يتم العثور على طالب أو طلب تسجيل بهذا الاسم أو الكود. يرجى التأكد من كتابة الاسم بدقة أو إدخال كود الطالب.
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
                { id: '1', fullName: 'عبد الرحمن خالد العمري', circleName: 'حلقة الإمام عاصم', totalPoints: 240, studentNumber: 'SJ-2026-0001' },
                { id: '2', fullName: 'عمر عبد الله السالم', circleName: 'حلقة الإمام نافع', totalPoints: 215, studentNumber: 'SJ-2026-0002' },
                { id: '3', fullName: 'يوسف إبراهيم النجار', circleName: 'حلقة زيد بن ثابت', totalPoints: 190, studentNumber: 'SJ-2026-0003' },
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
          <span>التسجيل برقم تعريفي مخصص وتوليد كود الطالب تلقائياً عند القبول</span>
        </div>
      </footer>
    </div>
  );
};
