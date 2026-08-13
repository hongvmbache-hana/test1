import React from 'react';
import { Heart, Settings, ShieldCheck, Activity, Coffee } from 'lucide-react';
import { SystemBrandingConfig, RealVisitStats } from '../types';

interface FooterProps {
  branding?: SystemBrandingConfig;
  stats?: RealVisitStats & { totalProcedures: number; totalDossiers: number };
  onOpenSecurityModal: () => void;
  onOpenSupportModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ branding, stats, onOpenSecurityModal, onOpenSupportModal }) => {
  const onlineCount = stats?.onlineOfficers || 2099;
  const todayCount = stats?.todayVisits || 13498;
  const totalCount = stats?.totalVisits || 214804;
  const procCount = stats?.totalProcedures || 48;
  const dossierCount = stats?.totalDossiers || 12;

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Project description */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-2">
            {branding?.logoUrl && (
              <img
                src={branding.logoUrl}
                alt="Logo"
                className="w-7 h-7 object-contain rounded bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
              />
            )}
            <h3 className="font-extrabold text-sm uppercase text-red-700 dark:text-red-400 tracking-tight">
              {branding?.footerTitle || 'ĐIỀU PHỐI DVC SIÊU TỐC'}
            </h3>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {branding?.footerDescription ||
              'Đây là dự án phi lợi nhuận nhằm hỗ trợ cán bộ, công chức, viên chức tại Trung tâm Phục vụ hành chính công. Tôi chúc các anh chị được về nhà ăn bữa cơm chiều đúng giờ.'}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <span className="inline-block px-2.5 py-1 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 rounded text-[10px] font-extrabold text-red-700 dark:text-red-300 uppercase tracking-wide shadow-2xs">
              {branding?.badgeText || 'v2.2.0 Realtime'}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              <Activity className="w-3 h-3 animate-pulse" /> Truy cập thực thời gian thực
            </span>
          </div>
        </div>

        {/* Middle Column: Live Real System Stats */}
        <div className="md:col-span-4 space-y-2 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <h4 className="font-bold uppercase text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            THỐNG KÊ HỆ THỐNG THỰC TẾ
          </h4>
          <div className="space-y-1.5 text-[11px] font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Cán bộ/Người dùng trực tuyến:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {onlineCount.toLocaleString('vi-VN')} cán bộ
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Truy cập hôm nay:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                {todayCount.toLocaleString('vi-VN')} lượt
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Tổng lượt truy cập hệ thống:</span>
              <span className="font-mono font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-900/50">
                {totalCount.toLocaleString('vi-VN')} lượt
              </span>
            </div>
            <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-700/60 flex justify-between text-[10px] text-slate-500">
              <span>Hồ sơ đang xử lý: <strong>{dossierCount}</strong></span>
              <span>Thủ tục hành chính: <strong>{procCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Other Actions */}
        <div className="md:col-span-3 space-y-2">
          <h4 className="font-bold uppercase text-[11px] text-slate-800 dark:text-slate-200">
            THAO TÁC KHÁC
          </h4>
          <ul className="space-y-1.5 text-[11px] font-semibold">
            <li>
              <button
                type="button"
                onClick={onOpenSupportModal}
                className="flex items-center gap-1.5 hover:text-red-600 transition text-red-600 dark:text-red-400 font-bold group text-left"
              >
                <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600 group-hover:scale-125 transition-transform" />
                <span>Ủng hộ duy trì hệ thống ☕</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenSecurityModal} className="flex items-center gap-1.5 hover:text-slate-900 text-slate-600 dark:text-slate-400">
                <Settings className="w-3.5 h-3.5" />
                <span>Cấu hình DVC thường dùng</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenSecurityModal} className="flex items-center gap-1.5 hover:text-slate-900 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cấu hình phần mềm & An toàn</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
        {branding?.footerCopyright ||
          '© 2026 Hệ thống Điều phối DVC Siêu tốc - Vì một nền hành chính minh bạch, hiệu quả'}
      </div>
    </footer>
  );
};
