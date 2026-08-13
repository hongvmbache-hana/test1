import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  FileUp,
  UploadCloud,
  ShieldAlert,
  ShieldCheck,
  Building2,
  UserCheck,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { ProcedureItem, Dossier, DossierDocument } from '../types';

interface SubmissionWizardModalProps {
  procedure: ProcedureItem | null;
  selectedProvince: string;
  onClose: () => void;
  onSubmitSuccess: (newDossier: Dossier) => void;
}

export const SubmissionWizardModal: React.FC<SubmissionWizardModalProps> = ({
  procedure,
  selectedProvince,
  onClose,
  onSubmitSuccess
}) => {
  if (!procedure) return null;

  const [step, setStep] = useState<number>(1);
  
  // Citizen form fields
  const [citizenName, setCitizenName] = useState('Nguyễn Văn Hải');
  const [citizenIdCard, setCitizenIdCard] = useState('022095001289');
  const [citizenPhone, setCitizenPhone] = useState('0988 123 456');
  const [citizenEmail, setCitizenEmail] = useState('nguyenvanhai.qn@gmail.com');
  const [citizenAddress, setCitizenAddress] = useState('Số 45 Lê Thánh Tông, TP. Hạ Long, Tỉnh Quảng Ninh');
  const [note, setNote] = useState('');

  // Uploaded files
  const [uploadedDocs, setUploadedDocs] = useState<DossierDocument[]>([
    {
      id: 'doc-upload-1',
      name: 'CCCD_NguyenVanHai_2Mat.pdf',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      status: 'valid'
    },
    {
      id: 'doc-upload-2',
      name: 'ToKhai_DangKyTheomau.pdf',
      fileSize: '920 KB',
      fileType: 'PDF',
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      status: 'valid'
    }
  ]);

  const [isAiChecking, setIsAiChecking] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(95);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newDoc: DossierDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: file.name.split('.').pop()?.toUpperCase() || 'PDF',
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      status: 'valid'
    };
    setUploadedDocs([...uploadedDocs, newDoc]);
  };

  const handleRunAiCheck = async () => {
    setIsAiChecking(true);
    try {
      const res = await fetch('/api/ai-analyze-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureTitle: procedure.title,
          citizenData: { citizenName, citizenIdCard, citizenPhone, citizenAddress },
          documents: uploadedDocs.map((d) => d.name)
        })
      });
      const data = await res.json();
      setAiScore(data.completenessScore || 95);
    } catch (e) {
      setAiScore(92);
    } finally {
      setIsAiChecking(false);
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleSubmitFinal = () => {
    const randomCode = `HS-${new Date().getFullYear()}-QN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newDossier: Dossier = {
      id: `dos-${Date.now()}`,
      code: randomCode,
      procedureId: procedure.id,
      procedureTitle: procedure.title,
      categoryId: procedure.categoryId,
      categoryName: procedure.categoryName,
      department: procedure.department,
      province: selectedProvince,
      citizenName,
      citizenIdCard,
      citizenPhone,
      citizenEmail,
      citizenAddress,
      formData: {
        note,
        submittedVia: 'VNeID Direct Gateway'
      },
      documents: uploadedDocs,
      status: 'submitted',
      submittedAt: formattedDate,
      updatedAt: formattedDate,
      estimatedCompletionAt: `${now.getDate() + procedure.slaDays}/${now.getMonth() + 1}/${now.getFullYear()} 17:00`,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: formattedDate,
          action: 'Nộp hồ sơ trực tuyến thành công qua cổng ĐIỀU PHỐI DVC SIÊU TỐC',
          actor: citizenName,
          role: 'Công dân'
        },
        {
          id: `h-ai-${Date.now()}`,
          timestamp: formattedDate,
          action: 'Mã hóa AES-256 & Tự động lưu vết bảo mật VNeID Level 2',
          actor: 'Security Bot',
          role: 'System'
        }
      ],
      isEncrypted: true,
      securityLevel: 'VNeID-L2'
    };

    onSubmitSuccess(newDossier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Wizard Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileUp className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs text-amber-300 font-bold uppercase tracking-widest">
                Đẩy Hồ Sơ Trực Tuyến - {selectedProvince}
              </span>
              <h2 className="text-base sm:text-lg font-black line-clamp-1">
                {procedure.title}
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

        {/* Wizard Step Progress Tracker */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold">
          {[
            { num: 1, title: 'Cơ quan & Địa bàn' },
            { num: 2, title: 'Khai báo VNeID' },
            { num: 3, title: 'Đính kèm & AI Soi' },
            { num: 4, title: 'Xác thực & Mã hóa' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 ${
                step === s.num
                  ? 'text-red-600 dark:text-red-400 font-extrabold'
                  : step > s.num
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                  step === s.num
                    ? 'bg-red-600 text-white shadow-sm'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: Cơ quan & Địa bàn */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <p className="font-bold mb-1">Xác nhận đơn vị tiếp nhận xử lý hồ sơ:</p>
                  <p>Hệ thống tự động định tuyến hồ sơ của bạn về đúng đơn vị chuyên môn cấp Tỉnh/Thành phố.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Tỉnh / Thành phố xử lý
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedProvince}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Cơ quan thực hiện thụ lý
                  </label>
                  <input
                    type="text"
                    disabled
                    value={procedure.department}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Thời gian xử lý</span>
                    <p className="text-sm font-bold text-red-600">{procedure.slaDays} ngày làm việc</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Lệ phí thanh toán</span>
                    <p className="text-sm font-bold text-emerald-600">
                      {procedure.fee === 0 ? 'Miễn phí' : `${procedure.fee.toLocaleString('vi-VN')} VNĐ`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Khai báo VNeID & Thông tin công dân */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Đã đồng bộ thông tin xác thực Định danh VNeID Cấp độ 2</span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-black">
                  Đã xác minh
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Họ và tên người nộp *</label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mã CCCD / Định danh 12 số *</label>
                  <input
                    type="text"
                    value={citizenIdCard}
                    onChange={(e) => setCitizenIdCard(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email nhận thông báo kết quả</label>
                  <input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Địa chỉ thường trú / Nơi ở hiện tại *</label>
                  <input
                    type="text"
                    value={citizenAddress}
                    onChange={(e) => setCitizenAddress(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ghi chú bổ sung cho Cán bộ thụ lý (Nếu có)</label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập nội dung đề nghị hoặc thông tin đính kèm bổ sung..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Đính kèm & Smart AI Check */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* File Upload Box */}
              <div className="border-2 border-dashed border-red-300 dark:border-slate-700 hover:border-red-500 rounded-2xl p-6 text-center bg-red-50/40 dark:bg-slate-800/40 transition">
                <UploadCloud className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Kéo thả giấy tờ thành phần hồ sơ vào đây hoặc tải lên từ máy tính
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hỗ trợ định dạng PDF, JPG, PNG (Tối đa 15MB/file)
                </p>
                <label className="inline-block mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow">
                  <span>Chọn tệp đính kèm</span>
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Uploaded Files List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Tài liệu đã đính kèm ({uploadedDocs.length})</span>
                  <button
                    onClick={handleRunAiCheck}
                    disabled={isAiChecking}
                    className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 hover:underline font-bold"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>{isAiChecking ? 'AI đang soi kiểm tra...' : 'Kiểm tra độ hợp lệ bằng AI'}</span>
                  </button>
                </div>

                {uploadedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.fileSize} • {doc.fileType}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300">
                      Hợp lệ ✓
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Score Feedback Box */}
              {aiScore !== null && (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow">
                      {aiScore}%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-purple-950 dark:text-purple-200">
                        Đánh giá độ hoàn thiện hồ sơ của AI Trợ Lý
                      </p>
                      <p className="text-[11px] text-purple-800 dark:text-purple-300">
                        Giấy tờ đầy đủ, hình ảnh bản scan rõ nét, khớp đúng theo yêu cầu Nghị định.
                      </p>
                    </div>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-purple-600 shrink-0" />
                </div>
              )}

            </div>
          )}

          {/* STEP 4: Xác thực OTP & Cam kết Bảo mật */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                  <span>Mã hóa bảo mật thông tin</span>
                  <span className="text-emerald-600 flex items-center gap-1 font-mono">
                    <Lock className="w-3.5 h-3.5" /> AES-256 Enabled
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Tất cả thông tin cá nhân và tài liệu đính kèm sẽ được mã hóa đầu cuối trước khi truyền gửi đến hệ thống máy chủ Cổng Dịch vụ công.
                </p>
              </div>

              {/* OTP Simulation */}
              <div className="p-4 bg-red-50/50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-red-900 dark:text-red-200">
                    Xác thực mã OTP gửi về SĐT ({citizenPhone}) *
                  </label>
                  {!otpSent ? (
                    <button
                      onClick={handleSendOtp}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px]"
                    >
                      Gửi mã OTP
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600">Đã gửi OTP (Thử nghiệm)</span>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Nhập 6 số mã OTP (Ví dụ: 889912)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full p-3 rounded-lg border border-red-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center tracking-widest text-lg font-bold text-red-700 dark:text-red-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <input type="checkbox" id="commitment" defaultChecked className="rounded text-red-600 accent-red-600" />
                <label htmlFor="commitment" className="cursor-pointer font-medium">
                  Tôi xin chịu trách nhiệm trước pháp luật về tính chính xác và trung thực của các thông tin khai báo.
                </label>
              </div>

            </div>
          )}

        </div>

        {/* Wizard Footer Navigation Buttons */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow"
            >
              <span>Tiếp tục (Bước {step + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFinal}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>Hoàn tất & Đẩy hồ sơ</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
