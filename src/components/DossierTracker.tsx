import React, { useState } from 'react';
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Upload,
  Eye,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  ArrowRight,
  Download,
  Send,
  Sparkles,
  FileCheck2,
  RefreshCw,
  X
} from 'lucide-react';
import { Dossier, DossierStatus } from '../types';

interface DossierTrackerProps {
  dossiers: Dossier[];
  onUpdateDossier: (updated: Dossier) => void;
  onOpenAiAssistant: () => void;
}

export const DossierTracker: React.FC<DossierTrackerProps> = ({
  dossiers,
  onUpdateDossier,
  onOpenAiAssistant
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeDossierModal, setActiveDossierModal] = useState<Dossier | null>(null);
  const [editingDossier, setEditingDossier] = useState<Dossier | null>(null);

  // Edit form state
  const [editCitizenPhone, setEditCitizenPhone] = useState('');
  const [editCitizenEmail, setEditCitizenEmail] = useState('');
  const [editCitizenAddress, setEditCitizenAddress] = useState('');
  const [editNote, setEditNote] = useState('');

  const filteredDossiers = dossiers.filter((d) => {
    const matchesCode =
      d.code.toLowerCase().includes(searchCode.toLowerCase()) ||
      d.citizenName.toLowerCase().includes(searchCode.toLowerCase()) ||
      d.procedureTitle.toLowerCase().includes(searchCode.toLowerCase());
    
    if (selectedStatusFilter === 'all') return matchesCode;
    if (selectedStatusFilter === 'additional_required') return matchesCode && d.status === 'additional_required';
    if (selectedStatusFilter === 'processing') return matchesCode && (d.status === 'processing' || d.status === 'received');
    if (selectedStatusFilter === 'completed') return matchesCode && (d.status === 'completed' || d.status === 'approved');
    return matchesCode;
  });

  const getStatusBadge = (status: DossierStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 font-bold px-2.5 py-1 rounded-full text-xs">Mới nộp</span>;
      case 'received':
        return <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 font-bold px-2.5 py-1 rounded-full text-xs">Đã tiếp nhận</span>;
      case 'processing':
        return <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Đang thẩm định</span>;
      case 'additional_required':
        return <span className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 font-bold px-2.5 py-1 rounded-full text-xs animate-pulse flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Yêu cầu bổ sung</span>;
      case 'approved':
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Hoàn thành</span>;
      case 'rejected':
        return <span className="bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-full text-xs">Từ chối</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-xs">Nháp</span>;
    }
  };

  const startEditDossier = (d: Dossier) => {
    setEditingDossier(d);
    setEditCitizenPhone(d.citizenPhone);
    setEditCitizenEmail(d.citizenEmail);
    setEditCitizenAddress(d.citizenAddress);
    setEditNote(d.formData?.note || '');
  };

  const handleSaveAdjustment = () => {
    if (!editingDossier) return;

    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated: Dossier = {
      ...editingDossier,
      citizenPhone: editCitizenPhone,
      citizenEmail: editCitizenEmail,
      citizenAddress: editCitizenAddress,
      formData: {
        ...editingDossier.formData,
        note: editNote,
        lastAdjustedAt: formattedDate
      },
      status: 'submitted', // Reset back to submitted for officer re-evaluation
      updatedAt: formattedDate,
      history: [
        ...editingDossier.history,
        {
          id: `h-adj-${Date.now()}`,
          timestamp: formattedDate,
          action: 'Công dân đã điều chỉnh thông tin & cập nhật tài liệu bổ sung',
          actor: editingDossier.citizenName,
          role: 'Công dân',
          notes: editNote
        }
      ]
    };

    onUpdateDossier(updated);
    setEditingDossier(null);
    if (activeDossierModal?.id === updated.id) {
      setActiveDossierModal(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                QUẢN LÝ & THEO DÕI TIẾN ĐỘ HỒ SƠ CÔNG DÂN
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tra cứu mã hồ sơ, điều chỉnh thông tin khi có yêu cầu và theo dõi phê duyệt thời gian thực
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search Code */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Nhập mã HS-2026-QN-..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={onOpenAiAssistant}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Soi lỗi</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        {[
          { id: 'all', label: `Tất cả (${dossiers.length})` },
          { id: 'additional_required', label: `⚠️ Yêu cầu bổ sung (${dossiers.filter((d) => d.status === 'additional_required').length})` },
          { id: 'processing', label: `🔄 Đang thẩm định (${dossiers.filter((d) => d.status === 'processing' || d.status === 'received').length})` },
          { id: 'completed', label: `✅ Đã hoàn thành (${dossiers.filter((d) => d.status === 'completed' || d.status === 'approved').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              selectedStatusFilter === tab.id
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 dark:bg-blue-950 dark:text-blue-300 shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dossiers Grid */}
      <div className="space-y-3">
        {filteredDossiers.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs hover:shadow-xs transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Dossier Summary */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                  {d.code}
                </span>
                {getStatusBadge(d.status)}
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" /> Nộp: {d.submittedAt}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {d.procedureTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Công dân: <strong className="text-slate-700 dark:text-slate-200">{d.citizenName}</strong> ({d.citizenIdCard})
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Cơ quan: <strong className="text-slate-700 dark:text-slate-200">{d.department}</strong>
                </span>
              </div>

              {/* Highlight Note if Additional Info Required */}
              {d.status === 'additional_required' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Yêu cầu từ cán bộ thụ lý:</strong>
                    <span>{d.additionalRequirementNotes || 'Vui lòng kiểm tra và cập nhật lại thông tin tài liệu.'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
              {d.status === 'additional_required' && (
                <button
                  onClick={() => startEditDossier(d)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Điều chỉnh hồ sơ</span>
                </button>
              )}

              <button
                onClick={() => setActiveDossierModal(d)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Xem tiến độ Realtime</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDossiers.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 font-semibold">
              Không tìm thấy hồ sơ nào phù hợp.
            </p>
          </div>
        )}
      </div>

      {/* Realtime Progress & History Timeline Modal */}
      {activeDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-mono font-bold uppercase">
                  Mã hồ sơ: {activeDossierModal.code}
                </span>
                <h3 className="text-base sm:text-lg font-black leading-snug">
                  {activeDossierModal.procedureTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveDossierModal(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Stepper Timeline Visualizer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">
                  Tiến trình giải quyết thủ tục
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                  {[
                    { title: 'Nộp hồ sơ', done: true },
                    { title: 'Tiếp nhận', done: activeDossierModal.status !== 'submitted' },
                    { title: 'Thẩm định', done: activeDossierModal.status === 'processing' || activeDossierModal.status === 'completed' || activeDossierModal.status === 'approved' },
                    { title: 'Trả kết quả', done: activeDossierModal.status === 'completed' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        s.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {s.done ? '✓' : idx + 1}
                      </div>
                      <span className={s.done ? 'text-emerald-600' : 'text-slate-400'}>{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* History Audit Trail */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-3">
                  Nhật ký xử lý chi tiết (Thời gian thực)
                </h4>
                <div className="space-y-3 relative pl-4 border-l-2 border-red-200 dark:border-slate-700">
                  {activeDossierModal.history.map((h) => (
                    <div key={h.id} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white dark:border-slate-900"></div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
                          <span>{h.timestamp}</span>
                          <span className="font-bold text-red-600">{h.role}: {h.actor}</span>
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{h.action}</p>
                        {h.notes && <p className="text-red-600 font-semibold mt-1">Ghi chú: {h.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Download if completed */}
              {activeDossierModal.status === 'completed' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                    <FileCheck2 className="w-5 h-5 text-emerald-600" />
                    <span>Kết quả điện tử chính thức có chữ ký số đã sẵn sàng</span>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow">
                    <Download className="w-4 h-4" /> Tải bản điện tử
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Adjustment / Edit Modal */}
      {editingDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="bg-gradient-to-r from-red-700 to-amber-700 text-white p-4 flex items-center justify-between">
              <h3 className="font-black text-sm uppercase">
                Cập nhật & Điều chỉnh hồ sơ ({editingDossier.code})
              </h3>
              <button onClick={() => setEditingDossier(null)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200">
                <p className="font-bold">Yêu cầu từ Cán bộ thụ lý:</p>
                <p className="mt-1">{editingDossier.additionalRequirementNotes}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  value={editCitizenPhone}
                  onChange={(e) => setEditCitizenPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editCitizenEmail}
                  onChange={(e) => setEditCitizenEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={editCitizenAddress}
                  onChange={(e) => setEditCitizenAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nội dung giải trình / Ghi chú bổ sung</label>
                <textarea
                  rows={3}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Nhập phản hồi hoặc ghi chú về tài liệu đã đính kèm lại..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingDossier(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAdjustment}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
                <span>Gửi lại hồ sơ đã điều chỉnh</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
