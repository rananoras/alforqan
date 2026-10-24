import React, { useState } from 'react';
import { Student, FileCategory } from '../../types';
import { X, Upload, FolderOpen, Save, AlertCircle } from 'lucide-react';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    studentId: string,
    studentName: string,
    fileName: string,
    category: FileCategory,
    description: string,
    fileSize: number,
    mimeType: string,
    downloadUrl: string
  ) => Promise<void>;
  students: Student[];
  preselectedStudent?: Student | null;
}

export const UploadFileModal: React.FC<UploadFileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  preselectedStudent,
}) => {
  const [studentId, setStudentId] = useState(preselectedStudent?.id || students[0]?.id || '');
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<FileCategory>('certificate');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      setErrorMsg('يرجى تحديد الطالب');
      return;
    }
    if (!selectedFile) {
      setErrorMsg('يرجى اختيار ملف لرفعه');
      return;
    }

    const studentObj = students.find((s) => s.id === studentId);
    if (!studentObj) return;

    try {
      setSubmitting(true);
      setErrorMsg('');

      // Read file as Base64 Data URL for instant, zero-CORS reliable preview & download
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Url = event.target?.result as string;
          await onSubmit(
            studentId,
            studentObj.fullName,
            fileName || selectedFile.name,
            category,
            description,
            selectedFile.size,
            selectedFile.type || 'application/octet-stream',
            base64Url
          );
          onClose();
        } catch (err: any) {
          setErrorMsg(err.message || 'حدث خطأ أثناء حفظ الملف');
        } finally {
          setSubmitting(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء قراءة الملف');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base font-quran">
              رفع مستند أو شهادة أو تقرير للطالب
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="m-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Student Picker */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              ربط الملف بالطالب <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentNumber})
                </option>
              ))}
            </select>
          </div>

          {/* File Picker */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              اختيار الملف من جهازك (PDF، Word، Excel، صور) <span className="text-rose-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer bg-slate-50 transition-colors">
              <input
                type="file"
                required
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                className="w-full text-slate-500 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-800 file:text-white hover:file:bg-emerald-700"
              />
              {selectedFile && (
                <p className="text-[11px] text-emerald-800 font-bold mt-2">
                  الملف المحدد: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>

          {/* Custom Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">اسم المستند التوضيحي</label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="مثال: شهادة إتمام جزء عم 1447هـ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">تصنيف المستند</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FileCategory)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
            >
              <option value="certificate">شهادة حفظ وتفوق قرآني</option>
              <option value="id_document">صورة الهوية الوطنية / الإقامة</option>
              <option value="exam_sheet">استمارة اختبار وتقييم</option>
              <option value="pledge_agreement">إقرار وعهد ولي الأمر</option>
              <option value="medical">تقرير أو عذر طبي</option>
              <option value="photo">صورة شخصية للطالب</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">وصف أو ملاحظة حول المستند</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف تفصيلي..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'جارٍ الرفع...' : 'رفع وحفظ الملف'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
