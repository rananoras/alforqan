export type UserRole = 'admin' | 'staff' | 'teacher' | 'accountant' | 'parent' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  assignedCircleId?: string;
  linkedStudentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type Gender = 'male' | 'female';
export type StudentStatus = 'active' | 'archived' | 'suspended';

export interface Student {
  id: string; // Firestore document ID
  studentNumber: string; // Fixed unique ID: FRQ-2026-0001
  fullName: string;
  gender: Gender;
  birthDate: string;
  academicGrade: string; // المرحلة الدراسية (ابتدائي، متوسط، ثانوي، جامعي)
  nationalId?: string;
  phone?: string;
  address?: string;
  circleId?: string;
  circleName?: string;
  program: string; // حفظ عام، مكثف، إتقان وتجويد، براعم الفرقان، تأهيل مسابقات
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string; // أب، أم، أخ، ولي أمر
  guardianEmail?: string;
  guardianJob?: string;
  status: StudentStatus;
  totalPoints: number;
  currentSurah?: string;
  completedJuz: number; // 0 - 30
  feeBalance: number; // الرصيد المالي المتبقي على الطالب
  notes?: string;
  avatarUrl?: string;
  registeredAt: string;
  updatedAt?: string;
}

export interface Circle {
  id: string;
  name: string; // اسم الحلقة: حلقة أبي بن كعب، حلقة زيد بن ثابت...
  teacherId?: string;
  teacherName: string;
  program: string;
  timing: string; // العصر، المغرب، العشاء، الفجر
  location: string; // مصلى الجامع الرئيسي، الجناح الشرقي...
  capacity: number;
  studentCount: number;
  days: string; // الأحد إلى الخميس، السبت والاثنين والأربعاء...
  status: 'active' | 'inactive';
  createdAt: string;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'waitlist';

export interface Registration {
  id: string;
  studentFullName: string;
  birthDate: string;
  academicGrade: string;
  nationalId?: string;
  phone?: string;
  address?: string;
  program: string;
  preferredCircleId?: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  guardianEmail?: string;
  guardianJob?: string;
  status: RegistrationStatus;
  decisionNotes?: string;
  submittedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  studentIdCreated?: string; // Set when approved
}

export type RecitationType = 'new_memorization' | 'near_review' | 'far_review' | 'recitation';
export type PerformanceGrade = 'excellent' | 'very_good' | 'good' | 'acceptable' | 'needs_repeat';

export interface MemorizationRecord {
  id: string;
  studentId: string;
  studentName: string;
  circleId?: string;
  date: string; // YYYY-MM-DD
  type: RecitationType;
  surahName: string;
  surahNumber: number;
  fromAyah: number;
  toAyah: number;
  pagesCount: number;
  masteryScore: number; // 1 to 5
  tajweedScore: number; // 1 to 5
  grade: PerformanceGrade;
  teacherId?: string;
  teacherName: string;
  teacherNotes?: string;
  nextAssignment?: string;
  pointsAwarded: number;
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  circleId?: string;
  circleName?: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  lateMinutes?: number;
  excuseReason?: string;
  markedBy?: string;
  createdAt: string;
}

export type PaymentType =
  | 'registration_fee'
  | 'monthly_tuition'
  | 'semester_tuition'
  | 'books_supplies'
  | 'activity_fee'
  | 'donation'
  | 'other';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'mada' | 'other';

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  receiptNumber: string; // Fixed format REC-2026-0001
  type: PaymentType;
  totalAmount: number;
  discountAmount: number;
  discountReason?: string;
  paidAmount: number;
  remainingBalance: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  collectedBy: string;
  createdAt: string;
}

export interface PointRule {
  id: string;
  name: string;
  type: 'add' | 'deduct';
  defaultPoints: number;
  description: string;
  category: 'memorization' | 'review' | 'attendance' | 'morals' | 'discipline' | 'competition';
}

export interface PointRecord {
  id: string;
  studentId: string;
  studentName: string;
  type: 'add' | 'deduct';
  points: number;
  ruleId?: string;
  reason: string;
  eventKey: string; // Unique string hash to prevent duplicate awarding: e.g., "mem-{recordId}" or "att-{studentId}-{date}"
  awardedBy: string;
  createdAt: string;
}

export type FileCategory =
  | 'certificate'
  | 'id_document'
  | 'medical'
  | 'pledge_agreement'
  | 'exam_sheet'
  | 'photo'
  | 'other';

export interface StudentFile {
  id: string;
  studentId: string;
  studentName: string;
  fileName: string;
  category: FileCategory;
  description?: string;
  fileSize: number; // in bytes
  mimeType: string;
  downloadUrl: string; // Firebase Storage URL or base64 data URL
  uploadedBy: string;
  uploaderName: string;
  isArchived: boolean;
  createdAt: string;
}

export interface SystemSetting {
  id: string;
  mosqueName: string;
  centerName: string;
  currency: string;
  phone: string;
  email: string;
  address: string;
  pointRules: string; // JSON string of PointRule[]
  feePlans: string; // JSON string of fee schedules
  academicYear: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'auth' | 'student' | 'finance' | 'points' | 'circle' | 'file' | 'system';
  details: string;
  performedBy: string;
  userEmail?: string;
  targetId?: string;
  createdAt: string;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: 'مكية' | 'مدنية';
}
