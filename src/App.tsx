import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
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

import { Navbar } from './components/layout/Navbar';
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

function MainApp() {
  const { currentUser, userProfile, activeRole } = useAuth();

  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
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

  // Subscriptions to Cloud Firestore
  useEffect(() => {
    // 1. Students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snap) => {
        const list: Student[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Student));
        setStudents(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'students')
    );

    // 2. Circles
    const unsubCircles = onSnapshot(
      collection(db, 'circles'),
      (snap) => {
        const list: Circle[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Circle));
        setCircles(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'circles')
    );

    // 3. Registrations
    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        const list: Registration[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Registration));
        setRegistrations(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'registrations')
    );

    // 4. Memorization
    const unsubMem = onSnapshot(
      collection(db, 'memorization_records'),
      (snap) => {
        const list: MemorizationRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as MemorizationRecord));
        setMemorizationRecords(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'memorization_records')
    );

    // 5. Attendance
    const unsubAtt = onSnapshot(
      collection(db, 'attendance_records'),
      (snap) => {
        const list: AttendanceRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AttendanceRecord));
        setAttendanceRecords(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'attendance_records')
    );

    // 6. Payments
    const unsubPay = onSnapshot(
      collection(db, 'payments'),
      (snap) => {
        const list: PaymentRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as PaymentRecord));
        setPayments(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'payments')
    );

    // 7. Points Ledger
    const unsubPts = onSnapshot(
      collection(db, 'points_ledger'),
      (snap) => {
        const list: PointRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as PointRecord));
        setPointsLedger(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'points_ledger')
    );

    // 8. Student Files
    const unsubFiles = onSnapshot(
      collection(db, 'student_files'),
      (snap) => {
        const list: StudentFile[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as StudentFile));
        setStudentFiles(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'student_files')
    );

    // 9. Settings
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...snap.data(), id: snap.id } as SystemSetting);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'settings/general')
    );

    // 10. Audit Logs
    const unsubAudit = onSnapshot(
      collection(db, 'audit_logs'),
      (snap) => {
        const list: AuditLog[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AuditLog));
        // Sort descending by date
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
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenRegisterModal={() => setNewRegModalOpen(true)}
        pendingCount={pendingRegsCount}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pendingRegistrationsCount={pendingRegsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              students={students}
              circles={circles}
              memorizationRecords={memorizationRecords}
              attendanceRecords={attendanceRecords}
              payments={payments}
              pointsLedger={pointsLedger}
              registrations={registrations}
              currency={currency}
              onNavigate={setCurrentTab}
              onOpenAddStudent={() => {
                setStudentToEdit(null);
                setAddStudentOpen(true);
              }}
              onOpenAddMemorization={() => {
                setSelectedStudentForMem(null);
                setAddMemModalOpen(true);
              }}
              onOpenAddAttendance={() => setCurrentTab('attendance')}
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

          {currentTab === 'students' && (
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

          {currentTab === 'registrations' && (
            <RegistrationsView
              registrations={registrations}
              circles={circles}
              onReviewRegistration={reviewRegistration}
              onOpenNewRegistration={() => setNewRegModalOpen(true)}
            />
          )}

          {currentTab === 'circles' && (
            <CirclesView
              circles={circles}
              students={students}
              onAddCircle={createCircle}
              onUpdateCircle={updateCircle}
            />
          )}

          {currentTab === 'memorization' && (
            <MemorizationView
              memorizationRecords={memorizationRecords}
              students={students}
              onOpenAddModal={() => {
                setSelectedStudentForMem(null);
                setAddMemModalOpen(true);
              }}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              circles={circles}
              students={students}
              attendanceRecords={attendanceRecords}
              onSaveAttendanceEntry={async (data) => {
                await recordAttendanceEntry(data);
              }}
            />
          )}

          {currentTab === 'finance' && (
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

          {currentTab === 'points' && (
            <PointsView
              pointsLedger={pointsLedger}
              students={students}
              onOpenAwardModal={() => {
                setSelectedStudentForPoints(null);
                setAwardPointsModalOpen(true);
              }}
            />
          )}

          {currentTab === 'files' && (
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

          {currentTab === 'reports' && (
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

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              auditLogs={auditLogs}
              onUpdateSettings={updateSystemSettings}
            />
          )}
        </main>
      </div>

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
