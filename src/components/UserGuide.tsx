import React from 'react';
import { HelpCircle, FileCheck2, ShieldCheck, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

export const UserGuide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-red-100 dark:bg-red-950 text-red-600 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              HƯỚNG DẪN NỘP HỒ SƠ & THEO DÕI TRỰC TUYẾN
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quy trình 4 bước đơn giản giúp công dân đẩy hồ sơ hành chính siêu tốc không cần xếp hàng
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            step: 'Bước 1',
            title: 'Tìm kiếm Thủ tục',
            desc: 'Tra cứu theo từ khóa hoặc chọn đúng danh mục lĩnh vực chuyên môn (Hộ tịch, Xây dựng, Lao động,...).'
          },
          {
            step: 'Bước 2',
            title: 'Khai báo & Tải file scan',
            desc: 'Hệ thống tự động đồng bộ VNeID. Tải lên tệp ảnh/PDF bản scan giấy tờ kèm theo.'
          },
          {
            step: 'Bước 3',
            title: 'AI Soi kiểm tra & Mã hóa',
            desc: 'Trợ lý AI quét tự động kiểm tra tính rõ nét và đầy đủ. Dữ liệu được mã hóa AES-256.'
          },
          {
            step: 'Bước 4',
            title: 'Theo dõi Realtime & Nhận Kq',
            desc: 'Cập nhật tiến độ thẩm định thời gian thực và nhận bản điện tử có chữ ký số hợp pháp.'
          }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 relative">
            <span className="text-xs font-black text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200">
              {item.step}
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
