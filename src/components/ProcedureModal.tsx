import React, { useState } from 'react';
import {
  X,
  FileText,
  Building2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { ProcedureCategory, ProcedureItem } from '../types';

interface ProcedureModalProps {
  category: ProcedureCategory | null;
  procedures: ProcedureItem[];
  onClose: () => void;
  onStartSubmission: (procedure: ProcedureItem) => void;
  initialProcedureId?: string | null;
}

export const ProcedureModal: React.FC<ProcedureModalProps> = ({
  category,
  procedures,
  onClose,
  onStartSubmission,
  initialProcedureId
}) => {
  const [selectedProcId, setSelectedProcId] = useState<string | null>(
    initialProcedureId || (procedures.length > 0 ? procedures[0].id : null)
  );

  React.useEffect(() => {
    if (initialProcedureId) {
      setSelectedProcId(initialProcedureId);
    } else if (procedures.length > 0) {
      setSelectedProcId(procedures[0].id);
    }
  }, [initialProcedureId, category, procedures]);

  if (!category) return null;

  const activeProcedure = procedures.find((p) => p.id === selectedProcId) || procedures[0];

  const handleOpenTargetUrl = (url?: string) => {
    const target = url || 'https://dichvucong.gov.vn';
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <FileText className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Mã Lĩnh Vực: {category.code}
              </span>
              <h2 className="text-lg font-black uppercase text-white">
                {category.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left sidebar procedure list + Right detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Procedure selection list */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 space-y-2 max-h-[300px] md:max-h-none bg-slate-50/50 dark:bg-slate-950/40">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2">
              Danh sách thủ tục ({procedures.length})
            </p>
            {procedures.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProcId(p.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedProcId === p.id
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-red-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    selectedProcId === p.id ? 'bg-red-700 text-amber-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    Mã: {p.code}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    selectedProcId === p.id ? 'text-amber-300' : 'text-emerald-600'
                  }`}>
                    {p.level}
                  </span>
                </div>
                <p className="line-clamp-2 leading-relaxed">
                  {p.title}
                </p>
              </button>
            ))}
          </div>

          {/* Procedure Detail View */}
          <div className="md:col-span-7 overflow-y-auto p-6 flex flex-col justify-between space-y-6">
            {activeProcedure ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300 dark:border-emerald-800">
                      ⚡ Dịch vụ công {activeProcedure.level}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Mã thủ tục: {activeProcedure.code}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {activeProcedure.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {activeProcedure.description}
                  </p>
                </div>

                {/* Dispatch Web URL Banner */}
                <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Globe className="w-4 h-4 text-red-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-red-900 dark:text-red-200">Đường dẫn web điều phối:</div>
                      <div className="text-red-700 dark:text-red-300 font-mono text-[11px] truncate">
                        {activeProcedure.targetUrl || 'https://dichvucong.gov.vn'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenTargetUrl(activeProcedure.targetUrl)}
                    className="shrink-0 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-2xs flex items-center gap-1 text-[11px]"
                  >
                    <span>Mở link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Agency / Department Card */}
                <div className="py-3 px-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-red-700" /> Cơ quan xử lý / Cơ quan thực hiện
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1" title={activeProcedure.department}>
                    {activeProcedure.department}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Action Button: Dispatch Link only */}
            {activeProcedure && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleOpenTargetUrl(activeProcedure.targetUrl)}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 text-sm uppercase tracking-wide"
                >
                  <ExternalLink className="w-5 h-5 text-amber-300" />
                  <span>TRUY CẬP TRANG ĐIỀU PHỐI NỘP HỒ SƠ ({activeProcedure.department})</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
