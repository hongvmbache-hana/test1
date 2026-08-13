import React, { useState } from 'react';
import { Bot, MessageCircle, X, ExternalLink, Phone, Sparkles, QrCode, Check, Copy, Coffee, Heart } from 'lucide-react';
import { SystemBrandingConfig } from '../types';

interface FloatingSupportWidgetsProps {
  branding?: SystemBrandingConfig;
  onOpenAiAssistant: () => void;
  onOpenSupportModal: () => void;
}

export const FloatingSupportWidgets: React.FC<FloatingSupportWidgetsProps> = ({
  branding,
  onOpenAiAssistant,
  onOpenSupportModal
}) => {
  const [isZaloModalOpen, setIsZaloModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const zaloEnabled = branding?.zaloEnabled !== false;
  const aiEnabled = branding?.aiEnabled !== false;
  const zaloTitle = branding?.zaloTitle || 'Hỗ trợ Zalo 24/7';
  const zaloPhone = branding?.zaloPhone || '0988888888';
  const zaloLink = branding?.zaloLink || `https://zalo.me/${zaloPhone.replace(/\D/g, '')}`;
  const zaloQrUrl = branding?.zaloQrUrl;

  const aiTitle = branding?.aiTitle || 'Trợ lý AI DVC';
  const donationTitle = branding?.donationTitle || 'Mời admin quản lý ly Cafe Capuchino ☕';

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(zaloPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(null as any), 2000);
  };

  return (
    <>
      {/* Floating Buttons Group - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Button 1: Hỗ trợ Zalo */}
        {zaloEnabled && (
          <div className="relative group pointer-events-auto">
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-lg backdrop-blur-xs border border-slate-700 animate-fadeIn">
              <span>{zaloTitle}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <button
              type="button"
              onClick={() => setIsZaloModalOpen(true)}
              className="relative flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
              title={zaloTitle}
            >
              {/* Pulse effect rings */}
              <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping opacity-75"></span>

              <div className="relative flex items-center justify-center">
                {/* Custom Zalo icon styling / MessageCircle */}
                <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
              </div>

              {/* Online indicator badge */}
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </button>
          </div>
        )}

        {/* Button 2: Trợ lý AI DVC */}
        {aiEnabled && (
          <div className="relative group pointer-events-auto">
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-lg backdrop-blur-xs border border-slate-700 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{aiTitle}</span>
            </div>

            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="relative flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 hover:from-purple-500 hover:to-indigo-700 text-white shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
              title={aiTitle}
            >
              {/* Pulse effect ring */}
              <span className="absolute -inset-1 rounded-full bg-purple-500/25 animate-pulse"></span>

              <div className="relative flex items-center justify-center">
                <Bot className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" />
              </div>

              {/* AI Badge */}
              <span className="absolute -top-1 -left-1 px-1.5 py-0.2 bg-amber-400 text-purple-950 font-black text-[9px] rounded-full border border-white dark:border-slate-900 shadow-2xs uppercase tracking-tight">
                AI
              </span>
            </button>
          </div>
        )}

        {/* Button 3: Cốc Cafe Capuchino - Ủng Hộ Duy Trì Hệ Thống (Nằm ngay dưới Trợ lý AI) */}
        <div className="relative group pointer-events-auto">
          {/* Tooltip on hover */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/90 text-amber-200 text-xs font-bold rounded-xl whitespace-nowrap shadow-lg backdrop-blur-xs border border-amber-800 animate-fadeIn">
            <Coffee className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{donationTitle}</span>
          </div>

          <button
            type="button"
            onClick={onOpenSupportModal}
            className="relative flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
            title={donationTitle}
          >
            {/* Pulse effect ring */}
            <span className="absolute -inset-1 rounded-full bg-amber-500/30 animate-pulse"></span>

            <div className="relative flex items-center justify-center">
              <Coffee className="w-6 h-6 text-amber-100 group-hover:rotate-12 transition-transform" />
            </div>

            {/* Heart Badge */}
            <span className="absolute -top-1 -left-1 p-1 bg-rose-500 text-white rounded-full border border-white dark:border-slate-900 shadow-2xs">
              <Heart className="w-2.5 h-2.5 fill-white" />
            </span>
          </button>
        </div>

      </div>

      {/* Zalo Support Modal */}
      {isZaloModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsZaloModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-200 dark:border-blue-900/50 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white overflow-hidden">
              <button
                onClick={() => setIsZaloModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Hỗ Trợ Trực Tuyên 24/7</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white">{zaloTitle}</h3>
                </div>
              </div>

              <p className="mt-3 text-xs text-blue-100/90 leading-relaxed font-medium">
                Kết nối trực tiếp qua Zalo với Trung tâm Phục vụ Hành chính công để được giải đáp thắc mắc và hỗ trợ tiếp nhận hồ sơ tức thì.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-center">
              
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 shadow-inner">
                <div className="relative p-2.5 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                  <img
                    src={
                      zaloQrUrl ||
                      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(zaloLink)}`
                    }
                    alt="Mã QR Zalo Hỗ Trợ"
                    className="w-40 h-40 object-contain rounded-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>
                <span className="mt-3 text-xs font-bold text-blue-900 dark:text-blue-300">
                  Quét mã QR bằng ứng dụng Zalo để mở hội thoại
                </span>
              </div>

              {/* Phone & Hotline Info */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-blue-600" />
                    <span>Số Điện Thoại / Zalo Hotline</span>
                  </div>
                  <div className="text-sm font-mono font-black text-slate-900 dark:text-white mt-0.5">
                    {zaloPhone}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Button: Chat Ngay qua Zalo */}
              <a
                href={zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 transition transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mở Chat Ngay Trực Tiếp Trên Zalo</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setIsZaloModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                Đóng cửa sổ
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
