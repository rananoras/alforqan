import React, { useState } from 'react';
import { Circle, Student } from '../../types';
import {
  GraduationCap,
  Plus,
  Users,
  Clock,
  MapPin,
  Calendar,
  Edit2,
  CheckCircle2,
  X,
  Save,
} from 'lucide-react';

interface CirclesViewProps {
  circles: Circle[];
  students: Student[];
  onAddCircle: (data: Omit<Circle, 'id' | 'createdAt' | 'studentCount'>) => Promise<any>;
  onUpdateCircle: (id: string, data: Partial<Circle>) => Promise<void>;
}

export const CirclesView: React.FC<CirclesViewProps> = ({
  circles,
  students,
  onAddCircle,
  onUpdateCircle,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCircle, setEditingCircle] = useState<Circle | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    teacherName: '',
    program: 'حفظ عام وإتقان',
    timing: 'بعد صلاة العصر',
    location: 'المصلى الرئيسي - جامع الفرقان',
    capacity: 20,
    days: 'الأحد إلى الخميس',
    status: 'active' as 'active' | 'inactive',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingCircle(null);
    setFormData({
      name: '',
      teacherName: '',
      program: 'حفظ عام وإتقان',
      timing: 'بعد صلاة العصر',
      location: 'المصلى الرئيسي - جامع الفرقان',
      capacity: 20,
      days: 'الأحد إلى الخميس',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Circle) => {
    setEditingCircle(c);
    setFormData({
      name: c.name,
      teacherName: c.teacherName,
      program: c.program,
      timing: c.timing,
      location: c.location,
      capacity: c.capacity,
      days: c.days,
      status: c.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.teacherName.trim()) return;

    try {
      setSubmitting(true);
      if (editingCircle) {
        await onUpdateCircle(editingCircle.id, formData);
      } else {
        await onAddCircle(formData);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ الحلقة');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-800" />
            <span>حلقات تحفيظ القرآن الكريم بالجامع</span>
          </h2>
          <p className="text-xs text-slate-500">
            توزيع الطلاب على الحلقات القرآنية، أوقات الانعقاد، المسارات، والمعلمون المشرفون
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>إنشاء حلقة جديدة</span>
        </button>
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {circles.map((c) => {
          const circleStudents = students.filter(
            (s) => s.circleId === c.id && s.status === 'active'
          );

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base font-quran text-amber-300">
                    {c.name}
                  </h3>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
                    title="تعديل بيانات الحلقة"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-emerald-100 mt-1">المعلم: {c.teacherName}</p>
                <div className="mt-2 inline-block bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {c.program}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>التوقيت:</strong> {c.timing}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>الموقع:</strong> {c.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>الأيام:</strong> {c.days}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700">الطلاب المسجلون:</span>
                    <span className="font-bold text-emerald-800">
                      {circleStudents.length} / {c.capacity} طالب
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (circleStudents.length / (c.capacity || 20)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Preview student names */}
                {circleStudents.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 block mb-1">من طلاب الحلقة:</span>
                    <div className="flex flex-wrap gap-1">
                      {circleStudents.slice(0, 4).map((s) => (
                        <span
                          key={s.id}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {s.fullName}
                        </span>
                      ))}
                      {circleStudents.length > 4 && (
                        <span className="text-[10px] text-emerald-700 font-bold self-center">
                          +{circleStudents.length - 4} آخرين
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Circle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm font-quran">
                {editingCircle ? 'تعديل بيانات الحلقة' : 'إنشاء حلقة تحفيظ جديدة'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم الحلقة</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: حلقة الإمام نافع المدني"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم المعلم المشرف</label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="الشيخ فلان الفلاني"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">البرنامج والمسار</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="حفظ عام وتجويد">حفظ عام وتجويد</option>
                  <option value="المسار المكثف للحفاظ">المسار المكثف للحفاظ</option>
                  <option value="برنامج الإتقان والمراجعة">برنامج الإتقان والمراجعة</option>
                  <option value="براعم الفرقان للتلقين">براعم الفرقان للتلقين</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">التوقيت</label>
                  <input
                    type="text"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    placeholder="بعد صلاة العصر"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">طاقة الاستيعاب</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">مكان انعقاد الحلقة بالجامع</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="المصلى الرئيسي - الرواق الشرقي"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">أيام الدوام الأسبوعي</label>
                <input
                  type="text"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  placeholder="الأحد إلى الخميس"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{submitting ? 'جارٍ الحفظ...' : 'حفظ الحلقة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
