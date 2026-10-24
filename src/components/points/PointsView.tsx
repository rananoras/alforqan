import React, { useState } from 'react';
import { PointRecord, Student, PointRule } from '../../types';
import { DEFAULT_POINT_RULES } from '../../data/quranData';
import {
  Award,
  Sparkles,
  Search,
  Filter,
  Plus,
  Trophy,
  Medal,
  Star,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface PointsViewProps {
  pointsLedger: PointRecord[];
  students: Student[];
  onOpenAwardModal: () => void;
  pointRules?: PointRule[];
}

export const PointsView: React.FC<PointsViewProps> = ({
  pointsLedger,
  students,
  onOpenAwardModal,
  pointRules,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'add' | 'deduct'>('all');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'ledger' | 'rules'>('leaderboard');

  const rules = pointRules || DEFAULT_POINT_RULES;

  // Filter ledger
  const filteredLedger = pointsLedger.filter((pt) => {
    const matchesSearch =
      pt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || pt.type === filterType;
    return matchesSearch && matchesType;
  });

  // Sort students for leaderboard
  const sortedStudents = [...students].sort(
    (a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)
  );

  const getRankBadge = (points: number) => {
    if (points >= 200) {
      return { title: 'حامل المسك (ذهبي)', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
    if (points >= 150) {
      return { title: 'الحافظ الفضي', color: 'bg-slate-200 text-slate-800 border-slate-300' };
    }
    if (points >= 100) {
      return { title: 'الحافظ البرونزي', color: 'bg-amber-800/10 text-amber-900 border-amber-800/20' };
    }
    return { title: 'براعم الفرقان', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>نظام نقاط التميز والمكافآت السلوكية والقرآنية</span>
          </h2>
          <p className="text-xs text-slate-500">
            لوحة شرف حفاظ الفرقان، ومنح النقاط للحفظ والمواظبة والأخلاق، ومنع تكرار الأحداث
          </p>
        </div>

        <button
          onClick={onOpenAwardModal}
          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>منح مكافأة / نقاط لطالب</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs text-xs">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>لوحة الشرف والمتفوقين</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'ledger'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>سجل حركات النقاط ({pointsLedger.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`py-3 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>قواعد وقيم النقاط المعتمدة ({rules.length})</span>
        </button>
      </div>

      {/* TAB 1: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top 3 Podium */}
          {sortedStudents.slice(0, 3).map((st, idx) => {
            const podiumStyles = [
              'bg-gradient-to-b from-amber-500/10 via-amber-400/5 to-white border-amber-300', // 1st
              'bg-gradient-to-b from-slate-200/40 via-slate-100/10 to-white border-slate-300', // 2nd
              'bg-gradient-to-b from-amber-800/10 via-amber-700/5 to-white border-amber-800/30', // 3rd
            ];
            const podiumMedals = ['🥇 المركز الأول', '🥈 المركز الثاني', '🥉 المركز الثالث'];

            return (
              <div
                key={st.id}
                className={`p-5 rounded-2xl border shadow-sm text-center relative overflow-hidden ${
                  podiumStyles[idx]
                }`}
              >
                <div className="text-xs font-bold text-amber-800 mb-2">{podiumMedals[idx]}</div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 font-bold text-2xl flex items-center justify-center mx-auto shadow-md border-2 border-white">
                  {st.fullName ? st.fullName[0] : 'ط'}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-3 font-quran">{st.fullName}</h3>
                <p className="text-[11px] text-slate-500">{st.circleName || 'حلقة عامة'}</p>

                <div className="mt-3 py-2 px-3 bg-white/80 rounded-xl border border-slate-200/80 inline-block">
                  <span className="text-xl font-bold text-amber-600 font-mono">{st.totalPoints}</span>
                  <span className="text-[10px] text-slate-500 mr-1">نقطة تميز</span>
                </div>

                <div className="mt-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                      getRankBadge(st.totalPoints).color
                    }`}
                  >
                    {getRankBadge(st.totalPoints).title}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Full Rank Table */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800">
              ترتيب جميع طلاب حلقات جامع الفرقان
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 text-center">الترتيب</th>
                    <th className="p-3.5">الرقم الأكاديمي</th>
                    <th className="p-3.5">اسم الطالب</th>
                    <th className="p-3.5">الحلقة والبرنامج</th>
                    <th className="p-3.5">الأجزاء المنجزة</th>
                    <th className="p-3.5">الرتبة القرآنية</th>
                    <th className="p-3.5 text-left pl-6">رصيد النقاط</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedStudents.map((st, idx) => {
                    const badge = getRankBadge(st.totalPoints);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 text-center font-bold text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="p-3.5 font-mono text-emerald-900 font-bold">{st.studentNumber}</td>
                        <td className="p-3.5 font-bold text-slate-800">{st.fullName}</td>
                        <td className="p-3.5 text-slate-600">{st.circleName || 'عامة'}</td>
                        <td className="p-3.5 text-amber-700 font-bold">{st.completedJuz} جزء</td>
                        <td className="p-3.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badge.color}`}>
                            {badge.title}
                          </span>
                        </td>
                        <td className="p-3.5 text-left pl-6 font-bold text-amber-600 text-sm font-mono">
                          {st.totalPoints}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث باسم الطالب أو السبب..."
                className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors ${
                  filterType === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
                }`}
              >
                الكل ({pointsLedger.length})
              </button>
              <button
                onClick={() => setFilterType('add')}
                className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors ${
                  filterType === 'add' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
                }`}
              >
                إضافات (+)
              </button>
              <button
                onClick={() => setFilterType('deduct')}
                className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors ${
                  filterType === 'deduct' ? 'bg-white shadow-xs text-rose-800 font-bold' : 'text-slate-600'
                }`}
              >
                خصومات (-)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            {filteredLedger.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                لا توجد حركات نقاط مسجلة حالياً.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">التاريخ</th>
                      <th className="p-3.5">اسم الطالب</th>
                      <th className="p-3.5">نوع الحركة</th>
                      <th className="p-3.5">النقاط</th>
                      <th className="p-3.5">السبب والتفاصيل</th>
                      <th className="p-3.5">المستخدم المنفذ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLedger.map((pt) => (
                      <tr key={pt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 text-slate-500 whitespace-nowrap">
                          {new Date(pt.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">{pt.studentName}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pt.type === 'add'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {pt.type === 'add' ? 'إضافة مكافأة' : 'خصم تأديبي'}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold font-mono text-sm whitespace-nowrap">
                          <span className={pt.type === 'add' ? 'text-emerald-700' : 'text-rose-700'}>
                            {pt.type === 'add' ? `+${pt.points}` : `-${pt.points}`}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700">{pt.reason}</td>
                        <td className="p-3.5 text-slate-400 whitespace-nowrap">{pt.awardedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RULES */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-slate-800">{r.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{r.description}</p>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium mt-1 inline-block">
                  تصنيف: {r.category}
                </span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl font-bold font-mono text-sm ${
                  r.type === 'add' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {r.type === 'add' ? `+${r.defaultPoints}` : `-${r.defaultPoints}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
