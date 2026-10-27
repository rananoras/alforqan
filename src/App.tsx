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
import { Shield } from 'lucide-react';

const REGISTRATIONS_CACHE_KEY = 'saeed_aljabi_registrations_cache_v2';

function MainApp() {
  const { currentUser, userProfile, activeRole, setActiveRole } = useAuth();

  // Route: 'home' (الموقع العام والتسجيل), 'admin' (لوحة الإدارة), 'teacher' (بوابة المعلم), 'student' (بوابة الطالب)
  const [currentRoute, setCurrentRoute] = useState<MainRoute>('home');
  const [adminTab, setAdminTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Firestore Real-Time Data Collections with Local Storage Cache Fallback
  const [students, setStudents] = useState<Student[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const cached = localStorage.getItem(REGISTRATIONS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });
  const [memorizationRecords, setMemorizationRecords] = useState<MemorizationRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
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
  const [awardPointsModalOpen, setAwardPointsModalOpen] = useState(false);
  const [selectedStudentForPoints, setSelectedStudentForPoints] = useState<Student | null>(null);
  const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false);
  const [selectedStudentForFile, setSelectedStudentForFile] = useState<Student | null>(null);

  // Printable Modal
  const [printableOpen, setPrintableOpen] = useState(false);
  const [printableMode, setPrintableMode] = useState<'card' | 'receipt' | 'certificate'>('card');
  const [printableStudent, setPrintableStudent] = useState<Student | null>(null);
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

    // Registrations listener with cache sync
    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        const firestoreList: Registration[] = [];
        snap.forEach((d) => firestoreList.push({ ...d.data(), id: d.id } as Registration));

        setRegistrations((prev) => {
          // Merge Firestore records with any locally submitted pending records
          const map = new Map<string, Registration>();
          // Put cached/local first
          prev.forEach((r) => map.set(r.id, r));
          // Put firestore over it
          firestoreList.forEach((r) => map.set(r.id, r));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          try {
            localStorage.setItem(REGISTRATIONS_CACHE_KEY, JSON.stringify(merged));
          } catch {}
          return merged;
        });
      },
      (err) => {
        console.warn('Registrations snapshot listener notice:', err);
      }
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
      () => {}
    );

    return () => {
      unsubStudents();
      unsubCircles();
      unsubRegs();
      unsubMem();
      unsubAtt();
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

  const handlePrintCertificate = (
    student: Student,
    details: { surahOrJuz: string; grade: string; date: string }
  ) => {
    setPrintableStudent(student);
    setPrintableCertDetails(details);
    setPrintableMode('certificate');
    setPrintableOpen(true);
  };

  // Submit Registration with Immediate Local + Firestore Update
  const handleRegisterStudent = async (data: any) => {
    const regId = await submitRegistration(data);
    const newReg: Registration = {
      id: regId || `local-${Date.now()}`,
      studentFullName: data.studentFullName,
      studentAge: data.studentAge || '',
      adminRegistrationCode: data.adminRegistrationCode || '',
      phone: data.phone || '',
      guardianName: '',
      guardianPhone: data.phone || '',
      guardianRelation: '',
      guardianEmail: '',
      guardianJob: '',
      program: 'حفظ عام وتجويد',
      academicGrade: data.studentAge ? `${data.studentAge} سنوات` : 'غير محدد',
      nationalId: '',
      address: 'حي جامع سعيد الجابي',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setRegistrations((prev) => {
      const updated = [newReg, ...prev.filter((r) => r.id !== newReg.id)];
      try {
        localStorage.setItem(REGISTRATIONS_CACHE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return regId;
  };

  // Review Registration with Immediate Status & Student Code Update
  const handleReviewRegistration = async (
    regId: string,
    status: 'approved' | 'rejected' | 'waitlist',
    decisionNotes: string,
    circleId?: string,
    circleName?: string
  ) => {
    await reviewRegistration(regId, status, decisionNotes, circleId, circleName);

    setRegistrations((prev) => {
      const updated = prev.map((r) => {
        if (r.id === regId) {
          const generatedCode =
            status === 'approved' && !r.generatedStudentCode
              ? `SJ-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`
              : r.generatedStudentCode;
          return {
            ...r,
            status,
            decisionNotes,
            generatedStudentCode: generatedCode,
            decidedAt: new Date().toISOString(),
          };
        }
        return r;
      });
      try {
        localStorage.setItem(REGISTRATIONS_CACHE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

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

      {/* VIEW 1: PUBLIC HOMEPAGE (الموقع العام المخصص للتسجيل والاستعلام) */}
      {currentRoute === 'home' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <PublicRegistrationHome
            circles={circles}
            registrations={registrations}
            students={students}
            memorizationRecords={memorizationRecords}
            adminRegistrationCode={settings?.adminRegistrationCode || 'JABY-2026'}
            onSubmitRegistration={handleRegisterStudent}
            onNavigateToAdmin={() => navigateToRoute('admin')}
            onNavigateToTeacher={() => navigateToRoute('teacher')}
            onNavigateToStudent={() => navigateToRoute('student')}
          />
        </main>
      )}

      {/* VIEW 2: STUDENT PORTAL (بوابة الطالب لمتابعة الحفظ والحضور والنقاط) */}
      {currentRoute === 'student' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <StudentPortalView
            students={students}
            memorizationRecords={memorizationRecords}
            attendanceRecords={attendanceRecords}
            pointsLedger={pointsLedger}
            studentFiles={studentFiles}
            onPrintCard={handlePrintCard}
          />
        </main>
      )}

      {/* VIEW 3: TEACHER PORTAL (بوابة المعلم للحلقات والطلاب والتسميع والتحضير) */}
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

      {/* VIEW 4: ADMIN CONTROL PANEL (لوحة تحكم إدارة الجامع على رابط منفرد /admin) */}
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
                    أنت تتصفح لوحة الإدارة بصلاحية «{activeRole}». يمكنك تفعيل دور المدير العام لمعاينة كامل الإعدادات والتحكم بالنظام.
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
                pointsLedger={pointsLedger}
                registrations={registrations}
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
                onReviewRegistration={handleReviewRegistration}
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
                memorizationRecords={memorizationRecords}
                attendanceRecords={attendanceRecords}
                onPrintCard={handlePrintCard}
                onPrintCertificate={handlePrintCertificate}
              />
            )}

            {/* الإعدادات وسجل التدقيق: للمدير فقط */}
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
        pointsLedger={pointsLedger}
        studentFiles={studentFiles}
        onPrintCard={handlePrintCard}
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
          await handleRegisterStudent(data);
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

      {/* 5. Award / Deduct Points Modal */}
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

      {/* 6. Upload Student File Modal */}
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

      {/* 7. Printable Documents Modal */}
      <PrintableModal
        isOpen={printableOpen}
        onClose={() => setPrintableOpen(false)}
        mode={printableMode}
        student={printableStudent}
        payment={null}
        certificateData={printableCertDetails}
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
