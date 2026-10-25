import React, { useState } from 'react';
import { Circle, Registration } from '../../types';
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
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PublicRegistrationHomeProps {
  circles: Circle[];
  registrations: Registration[];
  onSubmitRegistration: (data: any) => Promise<any>;
  onNavigateToAdmin: () => void;
  onNavigateToTeacher: () => void;
  onNavigateToStudent: () => void;
}

export const PublicRegistrationHome: React.FC<PublicRegistrationHomeProps> = ({
  circles,
  registrations,
  onSubmitRegistration,
  onNavigateToAdmin,
  onNavigateToTeacher,
  onNavigateToStudent,
}) => {
  const { currentUser, signInWithGoogle } = useAuth();

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

  // Search Application Status State
  const [inquiryQuery, setInquiryQuery] = useState('');
  const [inquiryResult, setInquiryResult] = useState<Registration | null | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentFullName.trim() || !formData.guardianName.trim() || !formData.guardianPhone.trim()) {
      setErrorMsg('يرجى تعبئة الحقول الأساسية (اسم الطالب، اسم ولي الأمر، رقم الهاتف)');
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
    if (!inquiryQuery.trim()) return;

    const queryClean = inquiryQuery.trim().toLowerCase();
    const found = registrations.find(
      (r) =>
        r.guardianPhone.includes(queryClean) ||
        r.studentFullName.toLowerCase().includes(queryClean) ||
        (r.nationalId && r.nationalId.includes(queryClean))
    );

    setInquiryResult(found || null);
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-12 text-white shadow-xl border border-emerald-700/60 text-right">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>باب التسجيل والقبول مفتوح للعام الدراسي 1447-1448هـ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-quran text-amber-300 leading-tight">
            جامع سعيد الجابي
            <br />
            <span className="text-white text-xl sm:text-3xl font-normal block mt-1">
              مجمع حلقات تحفيظ القرآن الكريم والتعليم الإيماني
            </span>
          </h1>

          <p className="text-xs sm:text-base text-emerald-100 leading-relaxed mt-4 max-w-2xl">
            نظام قرآني متكامل يعنى بتحفيظ كتاب الله الكريم، وضبط أحكام التجويد، وتربية النشء على أخلاق القرآن، وفق مناهج متدرجة ومعلمين معتمدين ذوي إسناد وخبرة.
          </p>

          {/* Quick Portals Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href="#register-section"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>تسجيل طالب جديد الآن</span>
            </a>

            <button
              onClick={onNavigateToAdmin}
              className="px-5 py-3 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-600 shadow transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>بوابة الإدارة (إدارة)</span>
            </button>

            <button
              onClick={onNavigateToTeacher}
              className="px-4 py-3 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 text-xs sm:text-sm rounded-xl border border-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-teal-300" />
              <span>بوابة المعلم</span>
            </button>

            <button
              onClick={onNavigateToStudent}
              className="px-4 py-3 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 text-xs sm:text-sm rounded-xl border border-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>بوابة الطالب وولي الأمر</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mosque Highlights & Quranic Programs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">حفظ عام وإتقان</h3>
          <p className="text-xs text-slate-500 mt-1">
            منهج يومي لحفظ ومراجعة أجزاء القرآن الكريم مع أحكام التجويد ومخارج الحروف.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">المسار المكثف للحفاظ</h3>
          <p className="text-xs text-slate-500 mt-1">
            برنامج مكثف للراغبين في ختم القرآن وتثبيته ونيل الإجازة بالسند المتصل.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">براعم القرآن للتلقين</h3>
          <p className="text-xs text-slate-500 mt-1">
            تأسيس أطفال الروضة والمرحلة الابتدائية الأولى على حفظ جزء عم والأذكار والآداب.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">متابعة إلكترونية دقيقة</h3>
          <p className="text-xs text-slate-500 mt-1">
            سجل إلكتروني يومي للحفظ، الحضور، الإيصالات المالية، ونقاط التميز السلوكي.
          </p>
        </div>
      </div>

      {/* Main Feature: Public Registration Section */}
      <div id="register-section" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: The Registration Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <UserPlus className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-quran text-slate-800">
                استمارة التسجيل والالتحاق بحلقات جامع سعيد الجابي
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              يرجى تعبئة بيانات الطالب وولي الأمر بدقة، وسيتم إصدار رقم القيد والتواصل معكم لاعتماد التسجيل.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-quran">
                تم استلام طلب التسجيل بنجاح!
              </h3>
              <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                شكراً لكم. تم إرسال طلب تسجيل الطالب <strong className="text-emerald-900">{submittedStudentName}</strong> إلى إدارة جامع سعيد الجابي. يجري مراجعة الطلب من لجنة القبول وتعيين الحلقة المناسبة، وسيتم إشعاركم عبر واتساب.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                تسجيل طالب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Student Info */}
              <div>
                <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  1. بيانات الطالب المتقدم
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      اسم الطالب الرباعي <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentFullName}
                      onChange={(e) => setFormData({ ...formData, studentFullName: e.target.value })}
                      placeholder="مثال: عبد الله أحمد صالح السالم"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">المرحلة الدراسية</label>
                    <select
                      value={formData.academicGrade}
                      onChange={(e) => setFormData({ ...formData, academicGrade: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="الروضة والتمهيدي (براعم)">الروضة والتمهيدي (براعم)</option>
                      <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
                      <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
                      <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
                      <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                      <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                      <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
                      <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
                      <option value="الصف الثاني المتوسط">الصف الثاني المتوسط</option>
                      <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
                      <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                      <option value="المرحلة الجامعية">المرحلة الجامعية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">تاريخ الميلاد</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">رقم الهوية الوطنية / الإقامة</label>
                    <input
                      type="text"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      placeholder="اختياري - 10 أرقام"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">البرنامج القرآني المطلوب</label>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="حفظ عام وتجويد">حفظ عام وتجويد</option>
                      <option value="المسار المكثف للحفاظ">المسار المكثف للحفاظ</option>
                      <option value="برنامج الإتقان والمراجعة">برنامج الإتقان والمراجعة</option>
                      <option value="براعم القرآن للتلقين">براعم القرآن للتلقين</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  2. بيانات ولي الأمر والتواصل
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      اسم ولي الأمر <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="الاسم الثلاثي لولي الأمر"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">صلة القرابة</label>
                    <select
                      value={formData.guardianRelation}
                      onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="أب">أب</option>
                      <option value="أم">أم</option>
                      <option value="أخ">أخ</option>
                      <option value="ولي أمر">ولي أمر شرعي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      رقم جوال ولي الأمر (واتساب) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="05XXXXXXXX"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">عنوان السكن والحي</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="اسم الحي، الشارع"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{submitting ? 'جارٍ إرسال الطلب...' : 'إرسال طلب التسجيل في الحلقات'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 1 Col: Application Status Inquiry & Mosque Schedule */}
        <div className="space-y-6">
          {/* Inquiry Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-right">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-800 font-quran">
                الاستعلام عن حالة طلب التسجيل
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              أدخل رقم جوال ولي الأمر المسجل للتحقق من حالة القبول والحلقة المسندة.
            </p>

            <form onSubmit={handleInquiry} className="space-y-3">
              <input
                type="text"
                required
                value={inquiryQuery}
                onChange={(e) => setInquiryQuery(e.target.value)}
                placeholder="رقم الجوال أو اسم الطالب..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>فحص حالة الطلب</span>
              </button>
            </form>

            {inquiryResult !== undefined && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                {inquiryResult === null ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-center">
                    لم يتم العثور على طلب بهذا الرقم أو الاسم. يرجى التأكد من البيانات أو تقديم طلب جديد.
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{inquiryResult.studentFullName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          inquiryResult.status === 'approved'
                            ? 'bg-emerald-200 text-emerald-900'
                            : inquiryResult.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inquiryResult.status === 'approved'
                          ? '✓ تم القبول والاعتماد'
                          : inquiryResult.status === 'rejected'
                          ? 'مرفوض'
                          : '⏳ قيد المراجعة'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      البرنامج: {inquiryResult.program}
                    </p>
                    {inquiryResult.decisionNotes && (
                      <p className="text-[11px] text-emerald-900 bg-white/70 p-2 rounded">
                        ملاحظات الإدارة: {inquiryResult.decisionNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mosque Study Circles Schedule */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-amber-300 font-quran mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>مواعيد الحلقات القرآنية بالجامع</span>
            </h3>
            <div className="space-y-3 text-xs">
              {circles.slice(0, 3).map((c) => (
                <div key={c.id} className="p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-800">
                  <div className="font-bold text-amber-200">{c.name}</div>
                  <div className="text-[11px] text-emerald-200 mt-0.5">
                    المعلم: {c.teacherName} • {c.timing}
                  </div>
                  <div className="text-[10px] text-emerald-300/80 mt-0.5">
                    الموقع: {c.location}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-200">
              <span>حي جامع سعيد الجابي - الشارع العام</span>
              <span className="font-mono">+966 50 123 4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
