import React, { useState } from 'react';
import { StudentFile, Student } from '../../types';
import {
  FolderOpen,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Archive,
  FileText,
  Image as ImageIcon,
  FileCheck,
  FileSpreadsheet,
  X,
} from 'lucide-react';

interface FilesViewProps {
  studentFiles: StudentFile[];
  students: Student[];
  onOpenUploadModal: () => void;
  onToggleArchive: (fileId: string, isArchived: boolean) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
}

export const FilesView: React.FC<FilesViewProps> = ({
  studentFiles,
  students,
  onOpenUploadModal,
  onToggleArchive,
  onDeleteFile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewFile, setPreviewFile] = useState<StudentFile | null>(null);

  const filteredFiles = studentFiles.filter((f) => {
    const matchesSearch =
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const categoryLabels: Record<string, string> = {
    certificate: 'شهادة وتفوق',
    id_document: 'إثبات وهوية',
    exam_sheet: 'ورقة اختبار',
    pledge_agreement: 'إقرار وعهد',
    medical: 'تقرير طبي',
    photo: 'صورة شخصية',
    other: 'أخرى',
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-purple-600" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-600" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel'))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    return <FileCheck className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-quran flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-800" />
            <span>مستندات وملفات الطلاب والشهادات الرسمية</span>
          </h2>
          <p className="text-xs text-slate-500">
            أرشيف إلكتروني آمن لشهادات الحفظ، أوراق الاختبارات، الوثائق الرسمية، ونماذج القبول
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Upload className="w-4 h-4 text-amber-300" />
          <span>رفع مستند / شهادة جديدة</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الملف، اسم الطالب، أو الوصف..."
            className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">جميع التصنيفات</option>
            <option value="certificate">شهادات الحفظ والتفوق</option>
            <option value="id_document">وثائق الهوية</option>
            <option value="exam_sheet">استمارات الاختبار</option>
            <option value="pledge_agreement">إقرارات أولياء الأمور</option>
            <option value="medical">تقارير طبية</option>
          </select>
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
          لا توجد ملفات مرفوعة حالياً. اضغط «رفع مستند / شهادة جديدة» للبدء.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredFiles.map((f) => (
            <div
              key={f.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    {getFileIcon(f.mimeType)}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {categoryLabels[f.category] || f.category}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-800 truncate" title={f.fileName}>
                  {f.fileName}
                </h4>
                <p className="text-[11px] font-medium text-emerald-900 mt-1">
                  الطالب: {f.studentName}
                </p>

                {f.description && (
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{f.description}</p>
                )}

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>{(f.fileSize / 1024).toFixed(1)} KB</span>
                  <span>• {new Date(f.createdAt).toLocaleDateString('ar-SA')}</span>
                  <span>• بواسطة {f.uploaderName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setPreviewFile(f)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة</span>
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={f.downloadUrl}
                    download={f.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    title="تنزيل الملف"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
                        onDeleteFile(f.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[85vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="truncate">
                <h3 className="font-bold text-xs sm:text-sm truncate">{previewFile.fileName}</h3>
                <span className="text-[10px] text-slate-300">الطالب: {previewFile.studentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.downloadUrl}
                  download={previewFile.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل</span>
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto flex items-center justify-center bg-slate-100 min-h-[300px]">
              {previewFile.mimeType.startsWith('image/') ? (
                <img
                  src={previewFile.downloadUrl}
                  alt={previewFile.fileName}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-xs border border-slate-200 max-w-md">
                  <FileText className="w-16 h-16 text-emerald-800 mx-auto mb-3" />
                  <h4 className="font-bold text-sm text-slate-800 mb-1">{previewFile.fileName}</h4>
                  <p className="text-xs text-slate-500 mb-4">
                    مستند من نوع {previewFile.mimeType} ({(previewFile.fileSize / 1024).toFixed(1)} KB)
                  </p>
                  <a
                    href={previewFile.downloadUrl}
                    download={previewFile.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل وفتح الملف بجهازك</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
