import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  Student,
  Circle,
  Registration,
  MemorizationRecord,
  AttendanceRecord,
  PaymentRecord,
  PointRecord,
  StudentFile,
  SystemSetting,
  AuditLog,
} from './types';
import {
  createStudent,
  updateStudent,
  archiveStudent,
  createCircle,
  updateCircle,
  submitRegistration,
  reviewRegistration,
  recordMemorization,
  recordAttendanceEntry,
  createPayment,
  awardPointsManual,
  uploadStudentFileRecord,
  toggleArchiveFile,
  deleteStudentFile,
  updateSystemSettings,
} from './services/dbService';

import { Navbar, MainRoute } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { AddEditStudentModal } from './components/students/AddEditStudentModal';
import { RegistrationsView } from './components/registrations/RegistrationsView';
import { NewRegistrationModal } from './components/registrations/NewRegistrationModal';
import { MemorizationView } from './components/memorization/MemorizationView';
import { AddMemorizationModal } from './components/memorization/AddMemorizationModal';
import { AttendanceView } from './components/attendance/AttendanceView';
import { FinanceView } from './components/finance/FinanceView';
import { AddPaymentModal } from './components/finance/AddPaymentModal';
import { PointsView } from './components/points/PointsView';
import { AwardPointsModal } from './components/points/AwardPointsModal';
import { FilesView } from './components/files/FilesView';
import { UploadFileModal } from './components/files/UploadFileModal';
import { CirclesView } from './components/circles/CirclesView';
import { SettingsView } from './components/settings/SettingsView';
import { ReportsView } from './components/reports/ReportsView';
import { PrintableModal } from './components/print/PrintableModal';

import { PublicRegistrationHome } from './components/public/PublicRegistrationHome';
import { StudentPortalView } from './components/portals/StudentPortalView';
import { TeacherPortalView } from './components/portals/TeacherPortalView';
import { ParentPortalView } from './components/portals/ParentPortalView';
import { AccountantPortalView } from './components/portals/AccountantPortalView';
import { StaffPortalView } from './components/portals/StaffPortalView';
import { Shield, AlertCircle, Sparkles } from 'lucide-react';

function MainApp() {
  const { currentUser, userProfile, activeRole, setActiveRole } = useAuth();

  // Route: 'home' (الصفحة الرئيسية للتسجيل), 'admin' (إدارة), 'teacher', 'student', 'parent', 'accountant', 'staff'
  const [currentRoute, setCurrentRoute] = useState<MainRoute>('home');
  const [adminTab, setAdminTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Firestore Real-Time Data Collections
  const [students, setStudents] = useState<Student[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [memorizationRecords, setMemorizationRecords] = useState<MemorizationRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [pointsLedger, setPointsLedger] = useState<PointRecord[]>([]);
  const [studentFiles, setStudentFiles] = useState<StudentFile[]>([]);
  const [settings, setSettings] = useState<SystemSetting | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [newRegModalOpen, setNewRegModalOpen] = useState(false);
  const [addMemModalOpen, setAddMemModalOpen] = useState(false);
  const [selectedStudentForMem, setSelectedStudentForMem] = useState<Student | null>(null);
  const [addPayModalOpen, setAddPayModalOpen] = useState(false);
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<Student | null>(null);
  const [awardPointsModalOpen, setAwardPointsModalOpen] = useState(false);
  const [selectedStudentForPoints, setSelectedStudentForPoints] = useState<Student | null>(null);
  const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false);
  const [selectedStudentForFile, setSelectedStudentForFile] = useState<Student | null>(null);

  // Printable Modal
  const [printableOpen, setPrintableOpen] = useState(false);
  const [printableMode, setPrintableMode] = useState<'card' | 'receipt' | 'certificate'>('card');
  const [printableStudent, setPrintableStudent] = useState<Student | null>(null);
  const [printablePayment, setPrintablePayment] = useState<PaymentRecord | null>(null);
  const [printableCertDetails, setPrintableCertDetails] = useState<any>(null);

  // Sync route with window.location.hash and pathname for GitHub Pages & direct routes
  useEffect(() => {
    const parseCurrentRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const queryParam = (searchParams.get('p') || '').toLowerCase();

      const combined = `${hash} ${path} ${queryParam}`;

      if (combined.includes('admin')) {
        setCurrentRoute('admin');
      } else if (combined.includes('teacher')) {
        setCurrentRoute('teacher');
      } else if (combined.includes('student')) {
        setCurrentRoute('student');
      } else if (combined.includes('parent')) {
        setCurrentRoute('parent');
      } else if (combined.includes('accountant')) {
        setCurrentRoute('accountant');
      } else if (combined.includes('staff')) {
        setCurrentRoute('staff');
      } else {
        setCurrentRoute('home');
      }
    };

    parseCurrentRoute();
    window.addEventListener('hashchange', parseCurrentRoute);
    window.addEventListener('popstate', parseCurrentRoute);
    return () => {
      window.removeEventListener('hashchange', parseCurrentRoute);
      window.removeEventListener('popstate', parseCurrentRoute);
    };
  }, []);

  const navigateToRoute = (route: MainRoute) => {
    setCurrentRoute(route);
    if (route === 'home') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${route}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subscriptions to Cloud Firestore
  useEffect(() => {
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snap) => {
        const list: Student[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Student));
        setStudents(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'students')
    );

    const unsubCircles = onSnapshot(
      collection(db, 'circles'),
      (snap) => {
        const list: Circle[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Circle));
        setCircles(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'circles')
    );

    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        const list: Registration[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Registration));
        setRegistrations(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'registrations')
    );

    const unsubMem = onSnapshot(
      collection(db, 'memorization_records'),
      (snap) => {
        const list: MemorizationRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as MemorizationRecord));
        setMemorizationRecords(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'memorization_records')
    );

    const unsubAtt = onSnapshot(
      collection(db, 'attendance_records'),
      (snap) => {
        const list: AttendanceRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AttendanceRecord));
        setAttendanceRecords(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'attendance_records')
    );

    const unsubPay = onSnapshot(
      collection(db, 'payments'),
      (snap) => {
        const list: PaymentRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as PaymentRecord));
        setPayments(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'payments')
    );

    const unsubPts = onSnapshot(
      collection(db, 'points_ledger'),
      (snap) => {
        const list: PointRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as PointRecord));
        setPointsLedger(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'points_ledger')
    );

    const unsubFiles = onSnapshot(
      collection(db, 'student_files'),
      (snap) => {
        const list: StudentFile[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as StudentFile));
        setStudentFiles(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'student_files')
    );

    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...snap.data(), id: snap.id } as SystemSetting);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'settings/general')
    );

    const unsubAudit = onSnapshot(
      collection(db, 'audit_logs'),
      (snap) => {
        const list: AuditLog[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AuditLog));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAuditLogs(list);
      },
      (err) => console.warn('Audit logs read restricted to admin')
    );

    return () => {
      unsubStudents();
      unsubCircles();
      unsubRegs();
      unsubMem();
      unsubAtt();
      unsubPay();
      unsubPts();
      unsubFiles();
      unsubSettings();
      unsubAudit();
    };
  }, []);

  // Handlers for printing
  const handlePrintCard = (student: Student) => {
    setPrintableStudent(student);
    setPrintableMode('card');
    setPrintableOpen(true);
  };

  const handlePrintReceipt = (payment: PaymentRecord) => {
    setPrintablePayment(payment);
    setPrintableMode('receipt');
    setPrintableOpen(true);
  };

  const handlePrintCertificate = (
    student: Student,
    details: { surahOrJuz: string; grade: string; date: string }
  ) => {
    setPrintableStudent(student);
    setPrintableCertDetails(details);
    setPrintableMode('certificate');
    setPrintableOpen(true);
  };

  const currency = settings?.currency || 'ر.س';
  const pendingRegsCount = registrations.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigateRoute={navigateToRoute}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        pendingCount={pendingRegsCount}
      />

      {/* VIEW 1: PUBLIC HOMEPAGE (الصفحة الرئيسية المخصصة للتسجيل) */}
      {currentRoute === 'home' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <PublicRegistrationHome
            circles={circles}
            registrations={registrations}
            students={students}
            memorizationRecords={memorizationRecords}
            adminRegistrationCode={settings?.adminRegistrationCode || 'JABY-2026'}
            onSubmitRegistration={async (data) => {
              await submitRegistration(data);
            }}
            onNavigateToAdmin={() => navigateToRoute('admin')}
            onNavigateToTeacher={() => navigateToRoute('teacher')}
            onNavigateToStudent={() => navigateToRoute('student')}
          />
        </main>
      )}

      {/* VIEW 2: STUDENT & PARENT PORTAL (بوابة الطالب وولي الأمر فقط) */}
      {currentRoute === 'student' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <StudentPortalView
            students={students}
            memorizationRecords={memorizationRecords}
            attendanceRecords={attendanceRecords}
            payments={payments}
            pointsLedger={pointsLedger}
            studentFiles={studentFiles}
            currency={currency}
            onPrintCard={handlePrintCard}
            onPrintReceipt={handlePrintReceipt}
          />
        </main>
      )}

      {/* VIEW 3: TEACHER PORTAL (بوابة المعلم لحلقاته وطلابه فقط) */}
      {currentRoute === 'teacher' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <TeacherPortalView
            circles={circles}
            students={students}
            memorizationRecords={memorizationRecords}
            attendanceRecords={attendanceRecords}
            onOpenAddMemorization={(st) => {
              setSelectedStudentForMem(st || null);
              setAddMemModalOpen(true);
            }}
            onOpenAttendance={() => {
              // Direct teacher to attendance view inside admin/attendance or modal
              navigateToRoute('admin');
              setAdminTab('attendance');
            }}
            onOpenAwardPoints={(st) => {
              setSelectedStudentForPoints(st || null);
              setAwardPointsModalOpen(true);
            }}
            onViewStudent={(st) => {
              setSelectedStudentForProfile(st);
              setProfileModalOpen(true);
            }}
          />
        </main>
      )}

      {/* VIEW 4: PARENT PORTAL (بوابة ولي الأمر لمتابعة الأبناء - رابط منفرد /parent) */}
      {currentRoute === 'parent' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <ParentPortalView
            students={students}
            memorizationRecords={memorizationRecords}
            attendanceRecords={attendanceRecords}
            payments={payments}
            pointsLedger={pointsLedger}
            studentFiles={studentFiles}
            currency={currency}
            onPrintCard={handlePrintCard}
            onPrintReceipt={handlePrintReceipt}
          />
        </main>
      )}

      {/* VIEW 5: ACCOUNTANT PORTAL (بوابة المحاسب المالي وسندات القبض - رابط منفرد /accountant) */}
      {currentRoute === 'accountant' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <AccountantPortalView
            payments={payments}
            students={students}
            currency={currency}
            onOpenAddPayment={(st) => {
              setSelectedStudentForPay(st || null);
              setAddPayModalOpen(true);
            }}
            onPrintReceipt={handlePrintReceipt}
          />
        </main>
      )}

      {/* VIEW 6: STAFF PORTAL (بوابة شؤون الطلاب والقبول - رابط منفرد /staff) */}
      {currentRoute === 'staff' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <StaffPortalView
            registrations={registrations}
            students={students}
            circles={circles}
            studentFiles={studentFiles}
            onReviewRegistration={reviewRegistration}
            onOpenNewRegistration={() => setNewRegModalOpen(true)}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setAddStudentOpen(true);
            }}
            onOpenEditStudent={(st) => {
              setStudentToEdit(st);
              setAddStudentOpen(true);
            }}
            onViewStudent={(st) => {
              setSelectedStudentForProfile(st);
              setProfileModalOpen(true);
            }}
            onOpenUploadModal={(st) => {
              setSelectedStudentForFile(st || null);
              setUploadFileModalOpen(true);
            }}
            onPrintCard={handlePrintCard}
          />
        </main>
      )}

      {/* VIEW 7: ADMIN CONTROL PANEL (لوحة تحكم المدير العام على رابط منفرد /admin) */}
      {currentRoute === 'admin' && (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Admin Sidebar Navigation */}
          <Sidebar
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            pendingRegistrationsCount={pendingRegsCount}
          />

          {/* Admin Main Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
            {/* Admin Header Notice */}
            {activeRole !== 'admin' && (
              <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    أنت تتصفح بوابة الإدارة حالياً بصلاحية «{activeRole}». يمكنك تفعيل دور المدير العام لمعاينة كامل الإعدادات والتحكم بالنظام.
                  </span>
                </div>
                <button
                  onClick={() => setActiveRole('admin')}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg shrink-0 transition-colors"
                >
                  التبديل إلى دور المدير
                </button>
              </div>
            )}

            {adminTab === 'dashboard' && (
              <DashboardView
                students={students}
                circles={circles}
                memorizationRecords={memorizationRecords}
                attendanceRecords={attendanceRecords}
                payments={payments}
                pointsLedger={pointsLedger}
                registrations={registrations}
                currency={currency}
                onNavigate={setAdminTab}
                onOpenAddStudent={() => {
                  setStudentToEdit(null);
                  setAddStudentOpen(true);
                }}
                onOpenAddMemorization={() => {
                  setSelectedStudentForMem(null);
                  setAddMemModalOpen(true);
                }}
                onOpenAddAttendance={() => setAdminTab('attendance')}
                onOpenAddPayment={() => {
                  setSelectedStudentForPay(null);
                  setAddPayModalOpen(true);
                }}
                onOpenAwardPoints={() => {
                  setSelectedStudentForPoints(null);
                  setAwardPointsModalOpen(true);
                }}
              />
            )}

            {adminTab === 'students' && (
              <StudentsView
                students={students}
                circles={circles}
                currency={currency}
                onOpenAddStudent={() => {
                  setStudentToEdit(null);
                  setAddStudentOpen(true);
                }}
                onOpenEditStudent={(st) => {
                  setStudentToEdit(st);
                  setAddStudentOpen(true);
                }}
                onViewStudent={(st) => {
                  setSelectedStudentForProfile(st);
                  setProfileModalOpen(true);
                }}
                onToggleArchive={archiveStudent}
                onPrintCard={handlePrintCard}
              />
            )}

            {adminTab === 'registrations' && (
              <RegistrationsView
                registrations={registrations}
                circles={circles}
                onReviewRegistration={reviewRegistration}
                onOpenNewRegistration={() => setNewRegModalOpen(true)}
              />
            )}

            {adminTab === 'circles' && (
              <CirclesView
                circles={circles}
                students={students}
                onAddCircle={createCircle}
                onUpdateCircle={updateCircle}
              />
            )}

            {adminTab === 'memorization' && (
              <MemorizationView
                memorizationRecords={memorizationRecords}
                students={students}
                onOpenAddModal={() => {
                  setSelectedStudentForMem(null);
                  setAddMemModalOpen(true);
                }}
              />
            )}

            {adminTab === 'attendance' && (
              <AttendanceView
                circles={circles}
                students={students}
                attendanceRecords={attendanceRecords}
                onSaveAttendanceEntry={async (data) => {
                  await recordAttendanceEntry(data);
                }}
              />
            )}

            {adminTab === 'finance' && (
              <FinanceView
                payments={payments}
                students={students}
                currency={currency}
                onOpenAddPayment={() => {
                  setSelectedStudentForPay(null);
                  setAddPayModalOpen(true);
                }}
                onPrintReceipt={handlePrintReceipt}
              />
            )}

            {adminTab === 'points' && (
              <PointsView
                pointsLedger={pointsLedger}
                students={students}
                onOpenAwardModal={() => {
                  setSelectedStudentForPoints(null);
                  setAwardPointsModalOpen(true);
                }}
              />
            )}

            {adminTab === 'files' && (
              <FilesView
                studentFiles={studentFiles}
                students={students}
                onOpenUploadModal={() => {
                  setSelectedStudentForFile(null);
                  setUploadFileModalOpen(true);
                }}
                onToggleArchive={toggleArchiveFile}
                onDeleteFile={deleteStudentFile}
              />
            )}

            {adminTab === 'reports' && (
              <ReportsView
                students={students}
                circles={circles}
                payments={payments}
                memorizationRecords={memorizationRecords}
                attendanceRecords={attendanceRecords}
                currency={currency}
                onPrintCard={handlePrintCard}
                onPrintCertificate={handlePrintCertificate}
                onPrintReceipt={handlePrintReceipt}
              />
            )}

            {/* الإعدادات وسجل التدقيق: تظهر حصرياً فقط في حساب الإدارة كما طلب المستخدم! */}
            {adminTab === 'settings' && (
              <SettingsView
                settings={settings}
                auditLogs={auditLogs}
                onUpdateSettings={updateSystemSettings}
              />
            )}
          </main>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Add / Edit Student Modal */}
      <AddEditStudentModal
        isOpen={addStudentOpen}
        onClose={() => {
          setAddStudentOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
        circles={circles}
        onSubmit={async (data) => {
          if (studentToEdit) {
            await updateStudent(studentToEdit.id, data);
          } else {
            await createStudent(data);
          }
        }}
      />

      {/* 2. Comprehensive Student Profile Dossier Modal */}
      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setSelectedStudentForProfile(null);
        }}
        student={selectedStudentForProfile}
        memorizationRecords={memorizationRecords}
        attendanceRecords={attendanceRecords}
        payments={payments}
        pointsLedger={pointsLedger}
        studentFiles={studentFiles}
        currency={currency}
        onPrintCard={handlePrintCard}
        onOpenAddPayment={(st) => {
          setSelectedStudentForPay(st);
          setAddPayModalOpen(true);
        }}
        onOpenAwardPoints={(st) => {
          setSelectedStudentForPoints(st);
          setAwardPointsModalOpen(true);
        }}
        onOpenAddMemorization={(st) => {
          setSelectedStudentForMem(st);
          setAddMemModalOpen(true);
        }}
      />

      {/* 3. New Registration Modal */}
      <NewRegistrationModal
        isOpen={newRegModalOpen}
        onClose={() => setNewRegModalOpen(false)}
        onSubmit={async (data) => {
          await submitRegistration(data);
        }}
        circles={circles}
        defaultAdminCode={settings?.adminRegistrationCode || 'JABY-2026'}
      />

      {/* 4. Add Memorization Session Modal */}
      <AddMemorizationModal
        isOpen={addMemModalOpen}
        onClose={() => {
          setAddMemModalOpen(false);
          setSelectedStudentForMem(null);
        }}
        students={students.filter((s) => s.status === 'active')}
        preselectedStudent={selectedStudentForMem}
        onSubmit={async (data) => {
          await recordMemorization(data);
        }}
      />

      {/* 5. Add Payment / Issue Receipt Modal */}
      <AddPaymentModal
        isOpen={addPayModalOpen}
        onClose={() => {
          setAddPayModalOpen(false);
          setSelectedStudentForPay(null);
        }}
        students={students}
        preselectedStudent={selectedStudentForPay}
        currency={currency}
        onSubmit={createPayment}
        onReceiptIssued={handlePrintReceipt}
      />

      {/* 6. Award / Deduct Points Modal */}
      <AwardPointsModal
        isOpen={awardPointsModalOpen}
        onClose={() => {
          setAwardPointsModalOpen(false);
          setSelectedStudentForPoints(null);
        }}
        students={students.filter((s) => s.status === 'active')}
        preselectedStudent={selectedStudentForPoints}
        onSubmit={async (data) => {
          await awardPointsManual(
            data.studentId,
            data.studentName,
            data.type,
            data.points,
            data.reason,
            data.eventKey,
            data.ruleId
          );
        }}
      />

      {/* 7. Upload Student File Modal */}
      <UploadFileModal
        isOpen={uploadFileModalOpen}
        onClose={() => {
          setUploadFileModalOpen(false);
          setSelectedStudentForFile(null);
        }}
        students={students}
        preselectedStudent={selectedStudentForFile}
        onSubmit={async (...args) => {
          await uploadStudentFileRecord(...args);
        }}
      />

      {/* 8. Printable Documents Modal */}
      <PrintableModal
        isOpen={printableOpen}
        onClose={() => setPrintableOpen(false)}
        mode={printableMode}
        student={printableStudent}
        payment={printablePayment}
        certificateData={printableCertDetails}
        currency={currency}
        mosqueName={settings?.mosqueName}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
