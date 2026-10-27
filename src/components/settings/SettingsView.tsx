import React, { useState } from 'react';
import { SystemSetting, AuditLog, PointRule, UserProfile, UserRole } from '../../types';
import { DEFAULT_POINT_RULES, DEFAULT_FEE_PLANS } from '../../data/quranData';
import {
  Settings,
  Shield,
  Award,
  History,
  Save,
  CheckCircle,
  AlertCircle,
  Users,
} from 'lucide-react';

interface SettingsViewProps {
  settings: SystemSetting | null;
  auditLogs: AuditLog[];
  onUpdateSettings: (settings: Partial<SystemSetting>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  auditLogs,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'point_rules' | 'audit_logs'>('general');

  // Form states
  const [mosqueName, setMosqueName] = useState(
    settings?.mosqueName || 'جامع سعيد الجابي ومجمع الحلقات القرآنية'
  );
  const [centerName, setCenterName] = useState(
    settings?.centerName || 'إدارة شؤون الحلقات والتعليم القرآني'
  );
  const [currency, setCurrency] = useState(settings?.currency || 'ر.س');
  const [phone, setPhone] = useState(settings?.phone || '+966 50 123 4567');
  const [email, setEmail] = useState(settings?.email || 'info@saeed-aljabi.org');
  const [address, setAddress] = useState(settings?.address || 'حي جامع سعيد الجابي - الشارع العام');
  const [academicYear, setAcademicYear] = useState(settings?.academicYear || '1447-1448هـ / 2026م');
  const [adminRegistrationCode, setAdminRegistrationCode] = useState(
    settings?.adminRegistrationCode || 'JABY-2026'
  );

  // Point rules custom state
  const [pointRulesList, setPointRulesList] = useState<PointRule[]>(() => {
    if (settings?.pointRules) {
      try {
        return JSON.parse(settings.pointRules);
      } catch {
        return DEFAULT_POINT_RULES;
      }
    }
    return DEFAULT_POINT_RULES;
  });

  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onUpdateSettings({
        mosqueName,
        centerName,
        currency,
        phone,
        email,
        address,
        academicYear,
        adminRegistrationCode,
        pointRules: JSON.stringify(pointRulesList),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRulePointsChange = (ruleId: string, val: number) => {
    setPointRulesList((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, defaultPoints: val } : r))
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-800" />
            <span>إعدادات النظام والعملة وسجل التدقيق الأمني</span>
          </h2>
          <p className="text-xs text-slate-500">
            تخصيص بيانات الجامع، العملة المعتمدة، قيم المكافآت، ومراقبة العمليات المالية والإدارية
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ التعديلات بنجاح!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs text-xs">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>بيانات الجامع والمركز</span>
        </button>



        <button
          onClick={() => setActiveTab('point_rules')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'point_rules'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>قواعد وقيم النقاط</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit_logs'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-rose-600" />
          <span>سجل التدقيق (Audit Logs)</span>
        </button>
      </div>

      {/* TAB 1: GENERAL MOSQUE SETTINGS */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">اسم الجامع الرسمي</label>
              <input
                type="text"
                required
                value={mosqueName}
                onChange={(e) => setMosqueName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">اسم الإدارة / المجمع</label>
              <input
                type="text"
                required
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">العام الدراسي الحالي</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">هاتف التواصل للجامع</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني للجامع</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">العنوان والحي</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
              <label className="block text-amber-950 font-bold text-xs flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>الرقم التعريفي المخصص من قبل الإدارة للتسجيل الإلكتروني</span>
              </label>
              <input
                type="text"
                required
                value={adminRegistrationCode}
                onChange={(e) => setAdminRegistrationCode(e.target.value)}
                placeholder="مثال: JABY-2026"
                className="w-full sm:w-1/2 px-3 py-2 border border-amber-300 bg-white rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 uppercase"
              />
              <p className="text-[11px] text-amber-800">
                هذا الرمز يُمنح من إدارة الجامع للطلاب أو أولياء الأمور الراغبين في التسجيل لإنشاء الحساب بالاسم والعمر، ولا يمكن إرسال الطلب بدونه لمنع التسجيلات العشوائية.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'جارٍ الحفظ...' : 'حفظ بيانات الجامع'}</span>
            </button>
          </div>
        </form>
      )}



      {/* TAB 3: POINT RULES */}
      {activeTab === 'point_rules' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-800 mb-1">
              تخصيص قيم وقواعد نقاط التميز والمكافآت
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              يمكن لمدير النظام تحديد عدد النقاط الممنوحة للحفظ والمراجعة والحضور، أو المخصومة للغياب والتأخر.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pointRulesList.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-slate-800">{r.name}</h4>
                  <p className="text-[10px] text-slate-500">{r.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={r.defaultPoints}
                    onChange={(e) => handleRulePointsChange(r.id, Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-emerald-900 bg-white"
                  />
                  <span className="font-bold text-slate-500">نقطة</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'جارٍ الحفظ...' : 'حفظ قواعد وقيم النقاط'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800">سجل تدقيق العمليات (Audit Trail)</h4>
              <p className="text-[11px] text-slate-500">
                توثيق كامل للعمليات الحساسة (إصدار الإيصالات، قبول الطلاب، وتعديلات النظام)
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
              {auditLogs.length} عملية مسجلة
            </span>
          </div>

          {auditLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              لا توجد سجلات تدقيق مسجلة حتى الآن.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-3">التاريخ والوقت</th>
                    <th className="p-3">الإجراء</th>
                    <th className="p-3">التصنيف</th>
                    <th className="p-3">التفاصيل</th>
                    <th className="p-3">المستخدم المنفذ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 font-mono whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('ar-SA')}
                      </td>
                      <td className="p-3 font-bold text-slate-800 whitespace-nowrap">{log.action}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                          {log.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 max-w-sm">{log.details}</td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {log.performedBy}
                        {log.userEmail && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {log.userEmail}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
