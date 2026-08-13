import React, { useState } from 'react';
import { Coffee, Heart, Copy, Check, X, QrCode, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { SystemBrandingConfig } from '../types';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding?: SystemBrandingConfig;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, branding }) => {
  const [copiedField, setCopiedField] = useState<'account' | 'note' | null>(null);

  if (!isOpen) return null;

  const title = branding?.donationTitle || 'Mời admin quản lý ly Cafe Capuchino ☕';
  const description =
    branding?.donationDescription ||
    'Dự án phục vụ cộng đồng phi lợi nhuận. Sự ủng hộ của Quý vị giúp duy trì máy chủ, băng thông và liên tục nâng cấp tính năng phục vụ cán bộ, người dân.';
  const bankName = branding?.bankName || 'MBBank (Ngân hàng Quân Đội)';
  const accountNumber = branding?.accountNumber || '0988888888';
  const accountHolder = branding?.accountHolder || 'VŨ MẠNH HỒNG';
  const transferNote = branding?.transferNote || 'Moi Cafe Capuchino Admin DVC';
  
  // QR image url or fallback VietQR
  const defaultQrUrl = `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=30000&addInfo=${encodeURIComponent(
    transferNote
  )}&accountName=${encodeURIComponent(accountHolder)}`;
  const qrImageUrl = branding?.qrImageUrl || defaultQrUrl;

  const handleCopy = (text: string, field: 'account' | 'note') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-amber-900/50 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header */}
        <div className="relative bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 p-4 sm:p-5 text-white overflow-hidden shrink-0">
          {/* Subtle background circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute right-12 -bottom-10 w-24 h-24 bg-amber-400/15 rounded-full blur-lg pointer-events-none"></div>

          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-400/30 shadow-inner shrink-0">
              <Coffee className="w-6 h-6 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[9px] font-extrabold uppercase tracking-wider text-amber-200 mb-0.5">
                <Heart className="w-2.5 h-2.5 text-red-400 fill-red-400" />
                <span>Ủng Hộ Duy Trì Máy Chủ</span>
              </div>
              <h3 className="text-base font-black tracking-tight text-amber-100">{title}</h3>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-amber-100/90 leading-snug font-medium">
            {description}
          </p>
        </div>

        {/* Modal Content - Compact scrollable container */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          
          {/* Centered Extra-Large QR Code Section */}
          <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-50/20 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 shadow-inner text-center">
            <div className="relative p-2 bg-white rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700">
              <img
                src={qrImageUrl}
                alt="Mã QR Chuyển Khoản Ngân Hàng"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-xl"
                onError={(e) => {
                  // Fallback to VietQR if custom image fails
                  (e.target as HTMLImageElement).src = defaultQrUrl;
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                <QrCode className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-black text-amber-900 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Quét mã QR để chuyển khoản nhanh 24/7</span>
            </div>
          </div>

          {/* Compact Bank Details Below QR Code */}
          <div className="space-y-2">
            
            {/* Grid 1: Bank Name & Account Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              
              {/* Bank Name */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Ngân hàng</span>
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5 truncate">
                  {bankName}
                </div>
              </div>

              {/* Account Number with Copy Button */}
              <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/50 rounded-xl border border-amber-200/90 dark:border-amber-900/60">
                <div className="text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Số tài khoản
                </div>
                <div className="flex items-center justify-between gap-1.5 mt-0.5">
                  <span className="font-mono font-black text-sm text-amber-950 dark:text-amber-200 tracking-wide select-all">
                    {accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(accountNumber, 'account')}
                    className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-bold transition flex items-center gap-1 shrink-0 shadow-2xs"
                  >
                    {copiedField === 'account' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Grid 2: Account Holder & Transfer Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              
              {/* Account Holder */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Chủ tài khoản
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white uppercase mt-0.5 tracking-wide truncate">
                  {accountHolder}
                </div>
              </div>

              {/* Transfer Note with Copy */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nội dung chuyển khoản
                </div>
                <div className="flex items-center justify-between gap-1.5 mt-0.5">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate select-all">
                    {transferNote}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferNote, 'note')}
                    className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded text-[10px] font-bold transition flex items-center gap-1 shrink-0"
                  >
                    {copiedField === 'note' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Heart Message Footer Note */}
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-tight text-[10px] font-medium">
              Mọi sự hỗ trợ từ Quý vị đều được sử dụng trực tiếp để chi trả chi phí hạ tầng máy chủ, băng thông truyền tải dữ liệu và phát triển tính năng hoàn toàn miễn phí.
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>Capuchino Coffee Supporter</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
