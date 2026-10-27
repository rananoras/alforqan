import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookMarked,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Award,
  FolderOpen,
  Printer,
  Settings,
  HelpCircle,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'students'
  | 'registrations'
  | 'circles'
  | 'memorization'
  | 'attendance'
  | 'points'
  | 'files'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  pendingRegistrationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  pendingRegistrationsCount = 0,
}) => {
  const { activeRole } = useAuth();

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    roles?: string[];
  }[] = [
    {
      id: 'dashboard',
      label: 'الرئيسية والإحصائيات',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'students',
      label: 'شؤون الطلاب وسجلاتهم',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'registrations',
      label: 'طلبات التسجيل في الجامع',
      icon: <UserPlus className="w-5 h-5" />,
      badge: pendingRegistrationsCount,
      roles: ['admin', 'staff', 'teacher'],
    },
    {
      id: 'circles',
      label: 'حلقات القرآن الكريم',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'memorization',
      label: 'متابعة الحفظ والتسميع',
      icon: <BookMarked className="w-5 h-5" />,
    },
    {
      id: 'attendance',
      label: 'سجل الحضور والغياب',
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      id: 'points',
      label: 'نقاط التميز والمكافآت',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'files',
      label: 'ملفات ومستندات الطلاب',
      icon: <FolderOpen className="w-5 h-5" />,
    },
    {
      id: 'reports',
      label: 'التقارير والشهادات والطباعة',
      icon: <Printer className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'إعدادات النظام والتدقيق',
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin', 'staff'],
    },
  ];

  // Filter items according to role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(activeRole);
  });

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 right-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-l border-slate-200 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 overflow-y-auto flex-1 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-emerald-800 tracking-wider">
            القائمة الرئيسية
          </div>

          {filteredNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      isActive
                        ? 'text-amber-300'
                        : 'text-emerald-700 group-hover:text-emerald-800'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-amber-400 text-emerald-950'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mosque Mini Banner at bottom */}
        <div className="p-3 border-t border-slate-100 bg-emerald-50/50">
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-xl p-3 text-white text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-[11px] font-bold text-amber-300">
                جامع سعيد الجابي
              </p>
            </div>
            <p className="text-[10px] text-emerald-100 leading-relaxed">
              «خيركم من تعلّم القرآن وعلّمه»
            </p>
            <p className="text-[9px] text-emerald-200/80 mt-1">
              العام الدراسي 1447-1448هـ
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
