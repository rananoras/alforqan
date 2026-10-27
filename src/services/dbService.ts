import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
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
  PointRule,
} from '../types';
import { DEFAULT_POINT_RULES, DEFAULT_FEE_PLANS } from '../data/quranData';

// Generate next unique student code like SJ-2026-0001
export async function generateNextStudentNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `SJ-${currentYear}-`;
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    let maxNum = 0;
    studentsSnap.forEach((d) => {
      const data = d.data() as Student;
      if (data.studentNumber) {
        const parts = data.studentNumber.split('-');
        if (parts.length >= 3) {
          const num = parseInt(parts[2], 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      }
    });
    const nextSeq = String(maxNum + 1).padStart(4, '0');
    return `${prefix}${nextSeq}`;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'students');
    return `${prefix}0001`;
  }
}

// Generate unique payment receipt number like REC-2026-0001
export async function generateNextReceiptNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `REC-${currentYear}-`;
  try {
    const paySnap = await getDocs(collection(db, 'payments'));
    let maxNum = 0;
    paySnap.forEach((d) => {
      const data = d.data() as PaymentRecord;
      if (data.receiptNumber && data.receiptNumber.startsWith(prefix)) {
        const parts = data.receiptNumber.split('-');
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    const nextSeq = String(maxNum + 1).padStart(4, '0');
    return `${prefix}${nextSeq}`;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'payments');
  }
}

// Add audit log entry
export async function logAuditEvent(
  action: string,
  category: AuditLog['category'],
  details: string,
  targetId?: string
) {
  try {
    const logData: Omit<AuditLog, 'id'> = {
      action,
      category,
      details,
      targetId: targetId || '',
      performedBy: auth.currentUser?.displayName || auth.currentUser?.email || 'مستخدم النظام',
      userEmail: auth.currentUser?.email || '',
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, 'audit_logs'), logData);
  } catch {
    // Non-blocking for logs
  }
}

// Seed initial mosque data if the system is completely new
export async function seedInitialDataIfEmpty() {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (!settingsDoc.exists()) {
      // 1. Settings
      const initialSettings: SystemSetting = {
        id: 'general',
        mosqueName: 'جامع سعيد الجابي ومجمع الحلقات القرآنية',
        centerName: 'إدارة شؤون الحلقات والتعليم القرآني',
        currency: 'ر.س',
        phone: '+966 50 123 4567',
        email: 'info@saeed-aljabi.org',
        address: 'حي جامع سعيد الجابي - الشارع العام',
        academicYear: '1447-1448هـ / 2026م',
        adminRegistrationCode: 'JABY-2026',
        pointRules: JSON.stringify(DEFAULT_POINT_RULES),
        feePlans: JSON.stringify(DEFAULT_FEE_PLANS),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'settings', 'general'), initialSettings);

      // 2. Circles
      const circle1Ref = doc(collection(db, 'circles'));
      const circle2Ref = doc(collection(db, 'circles'));
      const circle3Ref = doc(collection(db, 'circles'));

      const c1: Circle = {
        id: circle1Ref.id,
        name: 'حلقة الإمام عاصم بن أبي النجود',
        teacherName: 'الشيخ عبد الرحمن السالم',
        program: 'حفظ عام وإتقان',
        timing: 'بعد صلاة العصر',
        location: 'الرواق الشمالي - جامع سعيد الجابي',
        capacity: 18,
        studentCount: 3,
        days: 'الأحد إلى الخميس',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const c2: Circle = {
        id: circle2Ref.id,
        name: 'حلقة الصحابي الجليل زيد بن ثابت',
        teacherName: 'الشيخ إبراهيم المنصور',
        program: 'المراجعة المكثفة وتثبيت الحفظ',
        timing: 'بعد صلاة المغرب',
        location: 'المصلى الرئيسي - المحراب',
        capacity: 15,
        studentCount: 2,
        days: 'الأحد إلى الأربعاء',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const c3: Circle = {
        id: circle3Ref.id,
        name: 'حلقة براعم جامع سعيد الجابي للناشئة',
        teacherName: 'الشيخ محمد الدوسري',
        program: 'تأسيس وتلقين جزء عم وتجويد',
        timing: 'بعد صلاة العصر',
        location: 'قاعة الأنشطة القرآنية',
        capacity: 20,
        studentCount: 2,
        days: 'الأحد إلى الخميس',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      await setDoc(circle1Ref, c1);
      await setDoc(circle2Ref, c2);
      await setDoc(circle3Ref, c3);

      // 3. Students
      const sampleStudents: Omit<Student, 'id'>[] = [
        {
          studentNumber: 'FRQ-2026-0001',
          fullName: 'عبد الله محمد المنصور',
          gender: 'male',
          birthDate: '2012-05-14',
          academicGrade: 'الصف الأول المتوسط',
          nationalId: '1098765432',
          phone: '0551122334',
          address: 'حي جامع سعيد الجابي - شارع النور',
          circleId: circle1Ref.id,
          circleName: c1.name,
          program: c1.program,
          guardianName: 'محمد عبد الله المنصور',
          guardianPhone: '0501122334',
          guardianRelation: 'أب',
          guardianEmail: 'm.mansoor@example.com',
          guardianJob: 'مهندس اتصالات',
          status: 'active',
          totalPoints: 145,
          currentSurah: 'النساء',
          completedJuz: 4,
          feeBalance: 0,
          notes: 'طالب حريص ومتميز في التجويد ومخارج الحروف',
          registeredAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        },
        {
          studentNumber: 'FRQ-2026-0002',
          fullName: 'عمر خالد الدوسري',
          gender: 'male',
          birthDate: '2013-09-20',
          academicGrade: 'الصف السادس الابتدائي',
          nationalId: '1122334455',
          phone: '0552233445',
          address: 'حي جامع سعيد الجابي - قرب مدرسة الأندلس',
          circleId: circle1Ref.id,
          circleName: c1.name,
          program: c1.program,
          guardianName: 'خالد ناصر الدوسري',
          guardianPhone: '0502233445',
          guardianRelation: 'أب',
          guardianEmail: 'k.dossary@example.com',
          guardianJob: 'معلم لغة عربية',
          status: 'active',
          totalPoints: 110,
          currentSurah: 'آل عمران',
          completedJuz: 3,
          feeBalance: 50,
          notes: 'يحتاج تركيزاً على المدود وأحكام النون الساكنة',
          registeredAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
        },
        {
          studentNumber: 'FRQ-2026-0003',
          fullName: 'يوسف أحمد العتيبي',
          gender: 'male',
          birthDate: '2011-03-11',
          academicGrade: 'الصف الثاني المتوسط',
          nationalId: '1088776655',
          phone: '0553344556',
          address: 'حي الصفا - مجمع 4',
          circleId: circle2Ref.id,
          circleName: c2.name,
          program: c2.program,
          guardianName: 'أحمد صالح العتيبي',
          guardianPhone: '0503344556',
          guardianRelation: 'أب',
          guardianEmail: 'ahmed.otaibi@example.com',
          guardianJob: 'طبيب عام',
          status: 'active',
          totalPoints: 210,
          currentSurah: 'الأنعام',
          completedJuz: 7,
          feeBalance: 0,
          notes: 'حفظ راسخ وصوت ندي ما شاء الله',
          registeredAt: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
        },
        {
          studentNumber: 'FRQ-2026-0004',
          fullName: 'ريان طارق الزهراني',
          gender: 'male',
          birthDate: '2015-08-05',
          academicGrade: 'الصف الرابع الابتدائي',
          nationalId: '1155667788',
          phone: '0554455667',
          address: 'حي جامع سعيد الجابي',
          circleId: circle3Ref.id,
          circleName: c3.name,
          program: c3.program,
          guardianName: 'طارق عبد العزيز الزهراني',
          guardianPhone: '0504455667',
          guardianRelation: 'أب',
          guardianEmail: 'tariq.z@example.com',
          guardianJob: 'موظف بنكي',
          status: 'active',
          totalPoints: 85,
          currentSurah: 'النبأ',
          completedJuz: 1,
          feeBalance: 100,
          notes: 'حفظ جزء عم كاملاً ويستعد لمسابقة البراعم',
          registeredAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
        },
      ];

      for (const st of sampleStudents) {
        const sRef = doc(collection(db, 'students'));
        await setDoc(sRef, { ...st, id: sRef.id });

        // Add an initial registration fee payment
        const payRef = doc(collection(db, 'payments'));
        const pRecord: PaymentRecord = {
          id: payRef.id,
          studentId: sRef.id,
          studentNumber: st.studentNumber,
          studentName: st.fullName,
          receiptNumber: `REC-2026-000${sampleStudents.indexOf(st) + 1}`,
          type: 'registration_fee',
          totalAmount: 100,
          discountAmount: 0,
          paidAmount: 100,
          remainingBalance: st.feeBalance,
          paymentMethod: 'mada',
          notes: 'رسوم التسجيل الأولي واستلام المصحف الشريف',
          collectedBy: 'المحاسب المالي',
          createdAt: st.registeredAt,
        };
        await setDoc(payRef, pRecord);

        // Add a sample points entry
        const ptRef = doc(collection(db, 'points_ledger'));
        const ptRecord: PointRecord = {
          id: ptRef.id,
          studentId: sRef.id,
          studentName: st.fullName,
          type: 'add',
          points: 50,
          reason: 'مكافأة افتتاحية للالتزام والتسجيل المبكر في المسجد',
          eventKey: `init-bonus-${sRef.id}`,
          awardedBy: 'إدارة الجامع',
          createdAt: st.registeredAt,
        };
        await setDoc(ptRef, ptRecord);
      }

      await logAuditEvent('تهيئة النظام الأولي', 'system', 'تم إنشاء الإعدادات والحلقات الافتراضية وقاعدة الطلاب بنجاح');
    }
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

// Student CRUD
export async function createStudent(data: Omit<Student, 'id' | 'studentNumber'>): Promise<string> {
  try {
    const studentNumber = await generateNextStudentNumber();
    const docRef = doc(collection(db, 'students'));
    const student: Student = {
      ...data,
      id: docRef.id,
      studentNumber,
      totalPoints: data.totalPoints || 0,
      completedJuz: data.completedJuz || 0,
      feeBalance: data.feeBalance || 0,
      registeredAt: data.registeredAt || new Date().toISOString(),
    };
    await setDoc(docRef, student);
    await logAuditEvent('إضافة طالب جديد', 'student', `تم تسجيل الطالب ${student.fullName} برقم ${student.studentNumber}`, docRef.id);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'students');
  }
}

export async function updateStudent(id: string, updates: Partial<Student>) {
  try {
    await updateDoc(doc(db, 'students', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    await logAuditEvent('تحديث بيانات طالب', 'student', `تم تعديل بيانات الطالب ${updates.fullName || id}`, id);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `students/${id}`);
  }
}

export async function archiveStudent(id: string, isArchived: boolean) {
  try {
    await updateDoc(doc(db, 'students', id), {
      status: isArchived ? 'archived' : 'active',
      updatedAt: new Date().toISOString(),
    });
    await logAuditEvent(isArchived ? 'أرشفة طالب' : 'إلغاء أرشفة طالب', 'student', `تم تغيير حالة الطالب ${id}`, id);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `students/${id}`);
  }
}

// Circle CRUD
export async function createCircle(data: Omit<Circle, 'id' | 'createdAt' | 'studentCount'>) {
  try {
    const docRef = doc(collection(db, 'circles'));
    const circle: Circle = {
      ...data,
      id: docRef.id,
      studentCount: 0,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, circle);
    await logAuditEvent('إضافة حلقة جديدة', 'circle', `تم إنشاء حلقة ${circle.name}`, docRef.id);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'circles');
  }
}

export async function updateCircle(id: string, updates: Partial<Circle>) {
  try {
    await updateDoc(doc(db, 'circles', id), updates);
    await logAuditEvent('تحديث بيانات حلقة', 'circle', `تم تعديل حلقة ${updates.name || id}`, id);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `circles/${id}`);
  }
}

// Registrations
export async function submitRegistration(data: Omit<Registration, 'id' | 'status' | 'submittedAt'>) {
  try {
    const docRef = doc(collection(db, 'registrations'));
    const reg: Registration = {
      ...data,
      id: docRef.id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    await setDoc(docRef, reg);
    await logAuditEvent('طلب تسجيل جديد', 'student', `طلب تسجيل للطالب ${reg.studentFullName}`, docRef.id);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'registrations');
  }
}

export async function reviewRegistration(
  regId: string,
  status: 'approved' | 'rejected' | 'waitlist',
  decisionNotes: string,
  circleId?: string,
  circleName?: string
) {
  try {
    const regSnap = await getDoc(doc(db, 'registrations', regId));
    if (!regSnap.exists()) throw new Error('الطلب غير موجود');
    const regData = regSnap.data() as Registration;

    let createdStudentId = '';
    let generatedStudentCode = '';

    if (status === 'approved') {
      // توليد كود خاص بالطالب عند القبول
      const studentNumber = await generateNextStudentNumber();
      generatedStudentCode = studentNumber;
      const stRef = doc(collection(db, 'students'));
      createdStudentId = stRef.id;

      const newStudent: Student = {
        id: stRef.id,
        studentNumber, // كود الطالب المولد مثل SJ-2026-0001
        fullName: regData.studentFullName,
        age: regData.studentAge || '',
        gender: 'male',
        birthDate: regData.birthDate || '',
        academicGrade: regData.academicGrade || (regData.studentAge ? `${regData.studentAge} سنوات` : 'غير محدد'),
        nationalId: regData.nationalId || '',
        phone: regData.phone || regData.guardianPhone || '',
        address: regData.address || 'حي جامع سعيد الجابي',
        circleId: circleId || regData.preferredCircleId || '',
        circleName: circleName || '',
        program: regData.program || 'حفظ عام وتجويد',
        guardianName: regData.guardianName || `ولي أمر ${regData.studentFullName}`,
        guardianPhone: regData.guardianPhone || regData.phone || '',
        guardianRelation: regData.guardianRelation || 'ولي أمر',
        guardianEmail: regData.guardianEmail || '',
        guardianJob: regData.guardianJob || '',
        status: 'active',
        totalPoints: 25, // نقاط ترحيبية فورية عند قبول الطالب
        completedJuz: 0,
        feeBalance: 0,
        registeredAt: new Date().toISOString(),
        notes: `تم اعتماد وقبول الطالب رسمياً من قبل الإدارة بكود: ${studentNumber}. ${decisionNotes || ''}`,
      };
      await setDoc(stRef, newStudent);

      // Welcome point record
      const ptRef = doc(collection(db, 'points_ledger'));
      await setDoc(ptRef, {
        id: ptRef.id,
        studentId: stRef.id,
        studentName: newStudent.fullName,
        type: 'add',
        points: 25,
        reason: `مكافأة قبول الطالب واعتماد الكود الأكاديمي (${studentNumber})`,
        eventKey: `reg-welcome-${stRef.id}`,
        awardedBy: auth.currentUser?.displayName || 'إدارة جامع سعيد الجابي',
        createdAt: new Date().toISOString(),
      });
    }

    await updateDoc(doc(db, 'registrations', regId), {
      status,
      decisionNotes: decisionNotes || (status === 'approved' ? 'تم القبول وتوليد كود الطالب بنجاح' : ''),
      decidedAt: new Date().toISOString(),
      decidedBy: auth.currentUser?.displayName || auth.currentUser?.email || 'إدارة جامع سعيد الجابي',
      studentIdCreated: createdStudentId || null,
      generatedStudentCode: generatedStudentCode || null,
    });

    await logAuditEvent(
      'مراجعة طلب تسجيل',
      'student',
      `تم تغيير حالة طلب الطالب ${regData.studentFullName} إلى ${status}`,
      regId
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `registrations/${regId}`);
  }
}

// Memorization Records
export async function recordMemorization(
  data: Omit<MemorizationRecord, 'id' | 'createdAt'>
) {
  try {
    const docRef = doc(collection(db, 'memorization_records'));
    const record: MemorizationRecord = {
      ...data,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, record);

    // If points are awarded, log to points ledger with duplicate prevention eventKey
    if (data.pointsAwarded && data.pointsAwarded > 0) {
      const ptRef = doc(collection(db, 'points_ledger'));
      const eventKey = `mem-record-${docRef.id}`;
      const ptRecord: PointRecord = {
        id: ptRef.id,
        studentId: data.studentId,
        studentName: data.studentName,
        type: 'add',
        points: data.pointsAwarded,
        reason: `تسميع ${data.type === 'new_memorization' ? 'حفظ جديد' : 'مراجعة'}: سورة ${data.surahName} (الآيات ${data.fromAyah}-${data.toAyah}) - تقدير ${data.grade}`,
        eventKey,
        awardedBy: data.teacherName,
        createdAt: new Date().toISOString(),
      };
      await setDoc(ptRef, ptRecord);

      // Increment student totalPoints
      const stRef = doc(db, 'students', data.studentId);
      const stSnap = await getDoc(stRef);
      if (stSnap.exists()) {
        const curPoints = stSnap.data().totalPoints || 0;
        await updateDoc(stRef, {
          totalPoints: curPoints + data.pointsAwarded,
          currentSurah: data.surahName,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    await logAuditEvent(
      'تسجيل تسميع قرآن',
      'student',
      `تسميع للطالب ${data.studentName} في سورة ${data.surahName}`,
      docRef.id
    );
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'memorization_records');
  }
}

// Attendance Records (with duplicate prevention per student per date)
export async function recordAttendanceEntry(
  data: Omit<AttendanceRecord, 'id' | 'createdAt'>
) {
  try {
    // Unique deterministic ID or check: studentId + "_" + date
    const attendanceDocId = `${data.studentId}_${data.date}`;
    const docRef = doc(db, 'attendance_records', attendanceDocId);

    const record: AttendanceRecord = {
      ...data,
      id: attendanceDocId,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, record);

    // If absent without excuse, or tardy, handle points deduction/addition if configured
    if (data.status === 'absent' && !data.excuseReason) {
      // Deduct points event
      const eventKey = `att-deduct-absent-${attendanceDocId}`;
      const existingPt = await getDocs(
        query(collection(db, 'points_ledger'), where('eventKey', '==', eventKey), limit(1))
      );
      if (existingPt.empty) {
        const ptRef = doc(collection(db, 'points_ledger'));
        await setDoc(ptRef, {
          id: ptRef.id,
          studentId: data.studentId,
          studentName: data.studentName,
          type: 'deduct',
          points: 5,
          reason: `خصم لغياب بدون عذر بتاريخ ${data.date}`,
          eventKey,
          awardedBy: 'نظام الحضور',
          createdAt: new Date().toISOString(),
        });
        // Deduct from student totalPoints
        const stRef = doc(db, 'students', data.studentId);
        const stSnap = await getDoc(stRef);
        if (stSnap.exists()) {
          const cur = stSnap.data().totalPoints || 0;
          await updateDoc(stRef, { totalPoints: Math.max(0, cur - 5) });
        }
      }
    } else if (data.status === 'present') {
      // Award attendance point
      const eventKey = `att-award-${attendanceDocId}`;
      const existingPt = await getDocs(
        query(collection(db, 'points_ledger'), where('eventKey', '==', eventKey), limit(1))
      );
      if (existingPt.empty) {
        const ptRef = doc(collection(db, 'points_ledger'));
        await setDoc(ptRef, {
          id: ptRef.id,
          studentId: data.studentId,
          studentName: data.studentName,
          type: 'add',
          points: 2,
          reason: `حضور منتظم في حلقة القرآن بتاريخ ${data.date}`,
          eventKey,
          awardedBy: 'نظام الحضور',
          createdAt: new Date().toISOString(),
        });
        const stRef = doc(db, 'students', data.studentId);
        const stSnap = await getDoc(stRef);
        if (stSnap.exists()) {
          const cur = stSnap.data().totalPoints || 0;
          await updateDoc(stRef, { totalPoints: cur + 2 });
        }
      }
    }

    return attendanceDocId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `attendance_records/${data.studentId}_${data.date}`);
  }
}

// Payments & Financial Ledger
export async function createPayment(
  data: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'createdAt'>
) {
  try {
    const receiptNumber = await generateNextReceiptNumber();
    const docRef = doc(collection(db, 'payments'));
    const payment: PaymentRecord = {
      ...data,
      id: docRef.id,
      receiptNumber,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payment);

    // Update student fee balance
    const stRef = doc(db, 'students', data.studentId);
    const stSnap = await getDoc(stRef);
    if (stSnap.exists()) {
      const currentBalance = stSnap.data().feeBalance || 0;
      const newBalance = Math.max(0, currentBalance - data.paidAmount);
      await updateDoc(stRef, {
        feeBalance: newBalance,
        updatedAt: new Date().toISOString(),
      });
    }

    await logAuditEvent(
      'تسجيل دفعة مالية',
      'finance',
      `إيصال رقم ${receiptNumber} للطالب ${data.studentName} بمبلغ ${data.paidAmount} ر.س`,
      docRef.id
    );
    return payment;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'payments');
  }
}

// Points Ledger (with strict eventKey duplicate check)
export async function awardPointsManual(
  studentId: string,
  studentName: string,
  type: 'add' | 'deduct',
  points: number,
  reason: string,
  eventKey: string,
  ruleId?: string
) {
  try {
    // Check if eventKey already exists
    const existingSnap = await getDocs(
      query(collection(db, 'points_ledger'), where('eventKey', '==', eventKey), limit(1))
    );
    if (!existingSnap.empty) {
      throw new Error('تم منح أو خصم النقاط لهذا الحدث مسبقاً (تم منع التكرار)');
    }

    const docRef = doc(collection(db, 'points_ledger'));
    const record: PointRecord = {
      id: docRef.id,
      studentId,
      studentName,
      type,
      points,
      reason,
      eventKey,
      ruleId: ruleId || '',
      awardedBy: auth.currentUser?.displayName || auth.currentUser?.email || 'إدارة الحلقات',
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, record);

    // Update student totalPoints
    const stRef = doc(db, 'students', studentId);
    const stSnap = await getDoc(stRef);
    if (stSnap.exists()) {
      const cur = stSnap.data().totalPoints || 0;
      const updated = type === 'add' ? cur + points : Math.max(0, cur - points);
      await updateDoc(stRef, {
        totalPoints: updated,
        updatedAt: new Date().toISOString(),
      });
    }

    await logAuditEvent(
      type === 'add' ? 'منح نقاط' : 'خصم نقاط',
      'points',
      `${type === 'add' ? 'منح' : 'خصم'} ${points} نقطة للطالب ${studentName} - السبب: ${reason}`,
      docRef.id
    );
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'points_ledger');
  }
}

// Student Files (supports Data URL upload with metadata)
export async function uploadStudentFileRecord(
  studentId: string,
  studentName: string,
  fileName: string,
  category: StudentFile['category'],
  description: string,
  fileSize: number,
  mimeType: string,
  downloadUrl: string
) {
  try {
    const docRef = doc(collection(db, 'student_files'));
    const fileRecord: StudentFile = {
      id: docRef.id,
      studentId,
      studentName,
      fileName,
      category,
      description,
      fileSize,
      mimeType,
      downloadUrl,
      uploadedBy: auth.currentUser?.uid || 'user',
      uploaderName: auth.currentUser?.displayName || auth.currentUser?.email || 'المسؤول',
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, fileRecord);
    await logAuditEvent(
      'رفع ملف طالب',
      'file',
      `تم رفع مستند ${fileName} (${category}) للطالب ${studentName}`,
      docRef.id
    );
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'student_files');
  }
}

export async function toggleArchiveFile(fileId: string, isArchived: boolean) {
  try {
    await updateDoc(doc(db, 'student_files', fileId), { isArchived });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `student_files/${fileId}`);
  }
}

export async function deleteStudentFile(fileId: string) {
  try {
    await deleteDoc(doc(db, 'student_files', fileId));
    await logAuditEvent('حذف ملف طالب', 'file', `تم حذف الملف ${fileId}`, fileId);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `student_files/${fileId}`);
  }
}

// System Settings
export async function updateSystemSettings(settings: Partial<SystemSetting>) {
  try {
    await updateDoc(doc(db, 'settings', 'general'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    await logAuditEvent('تحديث إعدادات النظام', 'system', 'تم حفظ التعديلات في إعدادات الجامع والرسوم والنقاط');
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'settings/general');
  }
}
