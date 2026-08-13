import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck,
  X,
  AlertOctagon,
  Eye,
  CheckCircle,
  Database,
  Fingerprint
} from 'lucide-react';
import { AUDIT_LOGS } from '../data/mockData';

interface SecurityPanelModalProps {
  onClose: () => void;
}

export const SecurityPanelModal: React.FC<SecurityPanelModalProps> = ({ onClose }) => {
  const [e2eEncryption, setE2eEncryption] = useState(true);
  const [vneidVerification, setVneidVerification] = useState(true);
  const [sessionLockTimeout, setSessionLockTimeout] = useState('15');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                CẤP ĐỘ BẢO MẬT CAO NHẤT (TIÊU CHUẨN NGHỊ ĐỊNH 13/2023/NĐ-CP)
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                BẢO MẬT DỮ LIỆU CÔNG DÂN & AN NINH MẠNG
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Security Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Mã hóa AES-256</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Toàn bộ dữ liệu hồ sơ cá nhân được mã hóa đường truyền & lưu trữ.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/80">
              <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 mb-1">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                <span>Định danh VNeID L2</span>
              </div>
              <p className="text-[11px] text-blue-800 dark:text-blue-300">
                Xác thực sinh trắc học trực tiếp qua Cơ sở dữ liệu Dân cư Quốc gia.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/80">
              <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200 mb-1">
                <Database className="w-4 h-4 text-purple-600" />
                <span>Chữ ký số Chuyên dùng</span>
              </div>
              <p className="text-[11px] text-purple-800 dark:text-purple-300">
                Xác thực toàn vẹn tài liệu với chứng thư số Chính phủ.
              </p>
            </div>
          </div>

          {/* Security Configuration Toggles */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase">
              Cấu hình Tự động Bảo mật & Quyền riêng tư
            </h3>

            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Bật Mã hóa Đầu cuối (End-to-End Encryption)</p>
                <p className="text-[11px] text-slate-400">Ngăn chặn mọi hành vi can thiệp trái phép vào file scan đính kèm.</p>
              </div>
              <button
                onClick={() => setE2eEncryption(!e2eEncryption)}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  e2eEncryption ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow"></span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Bắt buộc Xác thực OTP khi mở Hồ sơ Nhạy cảm</p>
                <p className="text-[11px] text-slate-400">Gửi OTP xác minh chủ sở hữu khi truy cập thông tin Hộ tịch/Tài sản.</p>
              </div>
              <button
                onClick={() => setVneidVerification(!vneidVerification)}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  vneidVerification ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow"></span>
              </button>
            </div>
          </div>

          {/* Audit Trail Log */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase mb-3 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Nhật ký Giám sát Truy cập Dữ liệu Cá nhân (Audit Logs)
            </h3>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] space-y-2 max-h-48 overflow-y-auto">
              {AUDIT_LOGS.map((log) => (
                <div key={log.id} className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">[{log.timestamp}]</span>
                  <span className="text-amber-300 font-bold">{log.actor}</span>
                  <span className="text-slate-300">{log.action}</span>
                  <span className="text-emerald-400 font-bold">[{log.securityStatus}]</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
          >
            Đóng bảng cấu hình
          </button>
        </div>

      </div>
    </div>
  );
};
