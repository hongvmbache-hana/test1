import {
  ProcedureCategory,
  ProcedureItem,
  Dossier,
  SystemNotification,
  AuditLogItem,
  DepartmentStat,
  AdminUserAccount
} from '../types';

export const INITIAL_ADMIN_USERS: AdminUserAccount[] = [
  {
    id: 'user-1',
    username: 'hongvm',
    password: 'Hongvm@1988',
    fullName: 'Hoàng Văn Hồng',
    title: 'Quản trị viên Hệ thống (Super Admin)',
    department: 'Sở Thông tin & Truyền thông / Trung tâm Phục vụ HCC',
    role: 'super_admin',
    status: 'active',
    createdAt: '2026-01-01',
    lastLogin: '2026-08-13 07:15',
    permissions: {
      canManageProcedures: true,
      canManageCategories: true,
      canManageSettings: true,
      canManageUsers: true
    }
  },
  {
    id: 'user-2',
    username: 'nguyenvana',
    password: 'Canbo123@',
    fullName: 'Nguyễn Văn An',
    title: 'Chuyên viên Tiếp nhận & Xử lý Thủ tục',
    department: 'Bộ phận Một cửa - Sở Tư pháp',
    role: 'officer',
    status: 'active',
    createdAt: '2026-02-10',
    lastLogin: '2026-08-12 16:30',
    permissions: {
      canManageProcedures: true,
      canManageCategories: true,
      canManageSettings: false,
      canManageUsers: false
    }
  },
  {
    id: 'user-3',
    username: 'tranthib',
    password: 'Canbo456@',
    fullName: 'Trần Thị Bích',
    title: 'Cán bộ Biên tập & Cập nhật Danh mục',
    department: 'Sở Xây dựng tỉnh Quảng Ninh',
    role: 'editor',
    status: 'active',
    createdAt: '2026-03-15',
    lastLogin: '2026-08-11 09:20',
    permissions: {
      canManageProcedures: true,
      canManageCategories: true,
      canManageSettings: false,
      canManageUsers: false
    }
  }
];

export const INITIAL_CATEGORIES: ProcedureCategory[] = [
  { id: 'cat-1', code: 'ATVSLD', name: 'AN TOÀN, VỆ SINH LAO ĐỘNG', iconName: 'ShieldAlert', totalProcedures: 12 },
  { id: 'cat-2', code: 'BHXH', name: 'BẢO HIỂM XÃ HỘI', iconName: 'HeartPulse', totalProcedures: 28, popular: true },
  { id: 'cat-3', code: 'BTNN', name: 'BỒI THƯỜNG NHÀ NƯỚC', iconName: 'Scale', totalProcedures: 8 },
  { id: 'cat-4', code: 'CT', name: 'CHỨNG THỰC', iconName: 'Stamp', totalProcedures: 15, popular: true },
  { id: 'cat-5', code: 'CCVC', name: 'CÔNG CHỨC, VIÊN CHỨC', iconName: 'UserCheck', totalProcedures: 22 },
  { id: 'cat-6', code: 'CC', name: 'CÔNG CHỨNG', iconName: 'FileCheck', totalProcedures: 19, popular: true },
  { id: 'cat-7', code: 'CTTN', name: 'CÔNG TÁC THANH NIÊN', iconName: 'Users', totalProcedures: 6 },
  { id: 'cat-8', code: 'DK', name: 'ĐĂNG KIỂM', iconName: 'Car', totalProcedures: 14 },
  { id: 'cat-9', code: 'DKBPBD', name: 'ĐĂNG KÝ BIỆN PHÁP BẢO ĐẢM', iconName: 'Lock', totalProcedures: 11 },
  { id: 'cat-10', code: 'DGTS', name: 'ĐẤU GIÁ TÀI SẢN', iconName: 'Gavel', totalProcedures: 9 },
  { id: 'cat-11', code: 'DB', name: 'ĐƯỜNG BỘ', iconName: 'Truck', totalProcedures: 32 },
  { id: 'cat-12', code: 'DS', name: 'ĐƯỜNG SẮT', iconName: 'Train', totalProcedures: 10 },
  { id: 'cat-13', code: 'GDTP', name: 'GIÁM ĐỊNH TƯ PHÁP', iconName: 'FileSearch', totalProcedures: 16 },
  { id: 'cat-14', code: 'HTKT', name: 'HẠ TẦNG KỸ THUẬT', iconName: 'Wrench', totalProcedures: 18 },
  { id: 'cat-15', code: 'HHND', name: 'HÀNG HẢI VÀ ĐƯỜNG THỦY NỘI ĐỊA', iconName: 'Anchor', totalProcedures: 25 },
  { id: 'cat-16', code: 'HGCS', name: 'HÒA GIẢI Ở CƠ SỞ', iconName: 'Handshake', totalProcedures: 7 },
  { id: 'cat-17', code: 'HGTM', name: 'HÒA GIẢI THƯƠNG MẠI', iconName: 'Briefcase', totalProcedures: 13 },
  { id: 'cat-18', code: 'HDXD', name: 'HOẠT ĐỘNG XÂY DỰNG', iconName: 'Building', totalProcedures: 45, popular: true },
  { id: 'cat-19', code: 'HT', name: 'HỘ TỊCH', iconName: 'Baby', totalProcedures: 38, popular: true },
  { id: 'cat-20', code: 'HTPLDN', name: 'HỖ TRỢ PHÁP LÝ CHO DOANH NGHIỆP NHỎ VÀ VỪA', iconName: 'Building2', totalProcedures: 15 },
  { id: 'cat-21', code: 'KDKTATLD', name: 'KIỂM ĐỊNH KỸ THUẬT AN TOÀN LAO ĐỘNG', iconName: 'HardHat', totalProcedures: 11 },
  { id: 'cat-22', code: 'KDBDS', name: 'KINH DOANH BẤT ĐỘNG SẢN', iconName: 'Home', totalProcedures: 24, popular: true },
  { id: 'cat-23', code: 'LD', name: 'LAO ĐỘNG', iconName: 'UserCog', totalProcedures: 29 },
  { id: 'cat-24', code: 'LDTL', name: 'LAO ĐỘNG, TIỀN LƯƠNG', iconName: 'Coins', totalProcedures: 17 },
  { id: 'cat-25', code: 'LDTLBHXH', name: 'LAO ĐỘNG, TIỀN LƯƠNG VÀ BẢO HIỂM XÃ HỘI', iconName: 'Receipt', totalProcedures: 21 },
  { id: 'cat-26', code: 'LS', name: 'LUẬT SƯ', iconName: 'Award', totalProcedures: 14 },
  { id: 'cat-27', code: 'NCC', name: 'NGƯỜI CÓ CÔNG', iconName: 'Medal', totalProcedures: 33 },
  { id: 'cat-28', code: 'NACS', name: 'NHÀ Ở VÀ CÔNG SỞ', iconName: 'Landmark', totalProcedures: 20 },
  { id: 'cat-29', code: 'NCN', name: 'NUÔI CON NUÔI', iconName: 'Heart', totalProcedures: 12 },
  { id: 'cat-30', code: 'QLCLCTXD', name: 'QUẢN LÝ CHẤT LƯỢNG CÔNG TRÌNH XÂY DỰNG', iconName: 'Factory', totalProcedures: 19 },
  { id: 'cat-31', code: 'QLLDNN', name: 'QUẢN LÝ LAO ĐỘNG NGOÀI NƯỚC', iconName: 'Globe', totalProcedures: 16 },
  { id: 'cat-32', code: 'QLNNHQ', name: 'QUẢN LÝ NHÀ NƯỚC VỀ HỘI, QUỸ', iconName: 'Building', totalProcedures: 13 },
  { id: 'cat-33', code: 'QTV', name: 'QUẢN TÀI VIÊN', iconName: 'ShieldCheck', totalProcedures: 8 },
  { id: 'cat-34', code: 'QT', name: 'QUỐC TỊCH', iconName: 'Flag', totalProcedures: 10 },
  { id: 'cat-35', code: 'QH', name: 'QUY HOẠCH ĐÔ THỊ VÀ NÔNG THÔN', iconName: 'MapPin', totalProcedures: 27 },
  { id: 'cat-36', code: 'THADS', name: 'THI HÀNH ÁN DÂN SỰ', iconName: 'FileText', totalProcedures: 22 },
  { id: 'cat-37', code: 'TPL', name: 'THỪA PHÁT LẠI', iconName: 'FileCheck', totalProcedures: 9 },
  { id: 'cat-38', code: 'TTTM', name: 'TRỌNG TÀI THƯƠNG MẠI', iconName: 'Scale', totalProcedures: 11 },
  { id: 'cat-39', code: 'TGPL', name: 'TRỢ GIÚP PHÁP LÝ', iconName: 'HelpCircle', totalProcedures: 14 },
  { id: 'cat-40', code: 'TVPL', name: 'TƯ VẤN PHÁP LUẬT', iconName: 'MessageSquare', totalProcedures: 18 },
  { id: 'cat-41', code: 'VTLT', name: 'VĂN THƯ VÀ LƯU TRỮ NHÀ NƯỚC', iconName: 'FolderArchive', totalProcedures: 15 },
  { id: 'cat-42', code: 'VLXD', name: 'VẬT LIỆU XÂY DỰNG', iconName: 'Layers', totalProcedures: 13 },
  { id: 'cat-43', code: 'VL', name: 'VIỆC LÀM', iconName: 'Briefcase', totalProcedures: 31, popular: true },
];

export const SAMPLE_PROCEDURES: ProcedureItem[] = [
  {
    id: 'proc-1',
    code: '1.002891',
    categoryId: 'cat-19',
    categoryName: 'HỘ TỊCH',
    title: 'Cấp bản sao trích lục hộ tịch (Khai sinh, Kết hôn, Khai tử)',
    department: 'Sở Tư pháp / UBND Cấp huyện/Xã',
    level: 'Toàn trình',
    slaDays: 1,
    fee: 8000,
    requiredDocuments: [
      'Tờ khai cấp bản sao trích lục hộ tịch theo mẫu',
      'Căn cước công dân / Hộ chiếu (Bản chụp rõ 2 mặt)',
      'Giấy tờ chứng minh quan hệ nhân thân (nếu ủy quyền)'
    ],
    description: 'Thủ tục đăng ký nộp hồ sơ xin cấp bản sao trích lục hộ tịch trực tuyến toàn trình, kết quả được trả qua Bưu điện hoặc bản điện tử có chữ ký số.',
    targetUrl: 'https://dichvucong.quangninh.gov.vn/portaldvc/DVC/1.002891'
  },
  {
    id: 'proc-2',
    code: '1.008823',
    categoryId: 'cat-18',
    categoryName: 'HOẠT ĐỘNG XÂY DỰNG',
    title: 'Cấp Giấy phép xây dựng nhà ở riêng lẻ đô thị',
    department: 'Sở Xây dựng / Phòng Quản lý Đô thị',
    level: 'Toàn trình',
    slaDays: 15,
    fee: 150000,
    requiredDocuments: [
      'Đơn đề nghị cấp giấy phép xây dựng theo mẫu',
      'Giấy chứng nhận quyền sử dụng đất (Bản quét đã công chứng)',
      'Bản vẽ thiết kế kỹ thuật xây dựng đã thẩm định',
      'Cam kết đảm bảo an toàn công trình liền kề'
    ],
    description: 'Cấp giấy phép xây dựng mới cho hộ gia đình, cá nhân có nhu cầu xây dựng nhà ở đô thị.',
    targetUrl: 'https://dichvucong.quangninh.gov.vn/portaldvc/DVC/1.008823'
  },
  {
    id: 'proc-3',
    code: '1.004412',
    categoryId: 'cat-43',
    categoryName: 'VIỆC LÀM',
    title: 'Giải quyết hưởng trợ cấp thất nghiệp cho người lao động',
    department: 'Trung tâm Dịch vụ việc làm tỉnh Quảng Ninh',
    level: 'Toàn trình',
    slaDays: 20,
    fee: 0,
    requiredDocuments: [
      'Đề nghị hưởng trợ cấp thất nghiệp theo mẫu số 01',
      'Bản chính hoặc bản sao có chứng thực của Quyết định nghỉ việc / Hợp đồng lao động hết hạn',
      'Sổ Bảo hiểm xã hội đã chốt sổ'
    ],
    description: 'Nộp hồ sơ trực tuyến hưởng bảo hiểm thất nghiệp nhanh chóng không cần xếp hàng trực tiếp.',
    targetUrl: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nghenh.html?ma_thu_tuc=1.004412'
  },
  {
    id: 'proc-4',
    code: '1.001928',
    categoryId: 'cat-4',
    categoryName: 'CHỨNG THỰC',
    title: 'Chứng thực bản sao từ bản chính giấy tờ, văn bản do cơ quan có thẩm quyền cấp',
    department: 'Phòng Tư pháp / UBND Cấp Xã',
    level: 'Toàn trình',
    slaDays: 1,
    fee: 2000,
    requiredDocuments: [
      'Tệp ảnh/Quét bản chính tài liệu cần chứng thực',
      'Bản quét CCCD người nộp'
    ],
    description: 'Thủ tục cấp bản sao điện tử được chứng thực từ bản chính có giá trị pháp lý tương đương bản sao bằng giấy.',
    targetUrl: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nghenh.html?ma_thu_tuc=1.001928'
  },
  {
    id: 'proc-5',
    code: '1.009981',
    categoryId: 'cat-22',
    categoryName: 'KINH DOANH BẤT ĐỘNG SẢN',
    title: 'Cấp chứng chỉ hành nghề môi giới bất động sản',
    department: 'Sở Xây dựng tỉnh Quảng Ninh',
    level: 'Một phần',
    slaDays: 10,
    fee: 300000,
    requiredDocuments: [
      'Đơn đăng ký dự thi/cấp chứng chỉ hành nghề',
      'Bằng tốt nghiệp THPT trở lên',
      '2 ảnh 4x6 nền trắng đính kèm'
    ],
    description: 'Đăng ký xét duyệt hồ sơ cấp chứng chỉ môi giới BĐS cho cá nhân tham gia thị trường.',
    targetUrl: 'https://dichvucong.quangninh.gov.vn/portaldvc/DVC/1.009981'
  }
];

export const INITIAL_DOSSIERS: Dossier[] = [
  {
    id: 'dos-101',
    code: 'HS-2026-QN-88912',
    procedureId: 'proc-1',
    procedureTitle: 'Cấp bản sao trích lục hộ tịch (Khai sinh, Kết hôn, Khai tử)',
    categoryId: 'cat-19',
    categoryName: 'HỘ TỊCH',
    department: 'Sở Tư pháp tỉnh Quảng Ninh',
    province: 'Tỉnh Quảng Ninh',
    citizenName: 'Nguyễn Văn Hải',
    citizenIdCard: '022095001289',
    citizenPhone: '0988 123 456',
    citizenEmail: 'nguyenvanhai.qn@gmail.com',
    citizenAddress: 'Số 45 Lê Thánh Tông, TP. Hạ Long, Tỉnh Quảng Ninh',
    formData: {
      loaiTrichLuc: 'Trích lục Khai sinh',
      soLuong: 3,
      hoTenNguoiDuocCap: 'Nguyễn Văn Hải',
      ngaySinh: '15/08/1995',
      noiDangKyKhaiSinh: 'UBND Phường Hồng Gai, TP. Hạ Long'
    },
    documents: [
      { id: 'doc-1', name: 'CCCD_NguyenVanHai_2Mat.pdf', fileSize: '1.8 MB', fileType: 'PDF', uploadDate: '24/07/2026 10:15', status: 'valid', url: '#' },
      { id: 'doc-2', name: 'ToKhai_TrichLucHoTich.pdf', fileSize: '850 KB', fileType: 'PDF', uploadDate: '24/07/2026 10:16', status: 'valid', url: '#' }
    ],
    status: 'processing',
    submittedAt: '24/07/2026 10:20',
    updatedAt: '24/07/2026 11:30',
    estimatedCompletionAt: '25/07/2026 11:00',
    officerInCharge: 'Chuyên viên Trần Thị Mai - Phòng Hộ Tịch',
    history: [
      { id: 'h1', timestamp: '24/07/2026 10:20', action: 'Công dân gửi hồ sơ trực tuyến', actor: 'Nguyễn Văn Hải', role: 'Công dân' },
      { id: 'h2', timestamp: '24/07/2026 10:45', action: 'Hệ thống AI tự động xác thực chữ ký số & CCCD', actor: 'AI Security Bot', role: 'System' },
      { id: 'h3', timestamp: '24/07/2026 11:30', action: 'Tiếp nhận hồ sơ hợp lệ và phân công thụ lý', actor: 'Trần Thị Mai', role: 'Cán bộ thụ lý' }
    ],
    isEncrypted: true,
    securityLevel: 'VNeID-L2'
  },
  {
    id: 'dos-102',
    code: 'HS-2026-QN-99104',
    procedureId: 'proc-2',
    procedureTitle: 'Cấp Giấy phép xây dựng nhà ở riêng lẻ đô thị',
    categoryId: 'cat-18',
    categoryName: 'HOẠT ĐỘNG XÂY DỰNG',
    department: 'Phòng Quản lý Đô thị TP. Bãi Cháy',
    province: 'Tỉnh Quảng Ninh',
    citizenName: 'Lê Minh Tuấn',
    citizenIdCard: '019088009123',
    citizenPhone: '0912 345 678',
    citizenEmail: 'minhtuan.le@construction.vn',
    citizenAddress: 'KĐT Bãi Cháy, TP. Hạ Long, Tỉnh Quảng Ninh',
    formData: {
      diaDiemXayDung: 'Lô B12 Khu cư xá Bãi Cháy',
      dienTichXayDung: '120 m2',
      soTang: 4,
      chieuCaoCôngTrinh: '15.5 m'
    },
    documents: [
      { id: 'doc-3', name: 'GiayChungNhan_QSDDat.pdf', fileSize: '4.2 MB', fileType: 'PDF', uploadDate: '23/07/2026 14:10', status: 'valid', url: '#' },
      { id: 'doc-4', name: 'BanVeThietKeKienTruc.pdf', fileSize: '12.5 MB', fileType: 'PDF', uploadDate: '23/07/2026 14:12', status: 'invalid', aiNotes: 'Cần bổ sung sơ đồ đấu nối hạ tầng kỹ thuật', url: '#' }
    ],
    status: 'additional_required',
    submittedAt: '23/07/2026 14:15',
    updatedAt: '24/07/2026 09:10',
    estimatedCompletionAt: '05/08/2026 17:00',
    officerInCharge: 'KTS. Phạm Quốc Bảo - Phòng Quản lý Đô thị',
    additionalRequirementNotes: 'Kính gửi công dân Lê Minh Tuấn: Vui lòng bổ sung Bản vẽ sơ đồ đấu nối điện nước & thoát nước thải khu vực đô thị có phê duyệt của Đơn vị vận hành trước ngày 28/07/2026.',
    history: [
      { id: 'h10', timestamp: '23/07/2026 14:15', action: 'Công dân gửi hồ sơ thành công', actor: 'Lê Minh Tuấn', role: 'Công dân' },
      { id: 'h11', timestamp: '24/07/2026 09:10', action: 'Cán bộ gửi Yêu cầu bổ sung tài liệu', actor: 'Phạm Quốc Bảo', role: 'Cán bộ thụ lý', notes: 'Thiếu sơ đồ đấu nối hạ tầng' }
    ],
    isEncrypted: true,
    securityLevel: 'AES-256'
  },
  {
    id: 'dos-103',
    code: 'HS-2026-QN-77402',
    procedureId: 'proc-3',
    procedureTitle: 'Giải quyết hưởng trợ cấp thất nghiệp cho người lao động',
    categoryId: 'cat-43',
    categoryName: 'VIỆC LÀM',
    department: 'Trung tâm Dịch vụ việc làm tỉnh Quảng Ninh',
    province: 'Tỉnh Quảng Ninh',
    citizenName: 'Phạm Thị Phương',
    citizenIdCard: '030092004567',
    citizenPhone: '0977 888 999',
    citizenEmail: 'phuong.pham92@outlook.com',
    citizenAddress: 'Số 12 Nguyễn Văn Cừ, TP. Uông Bí, Tỉnh Quảng Ninh',
    formData: {
      soSoBHXH: '7911029381',
      soThangDongBHXH: '36 tháng',
      soTienLuongToanThoiGian: '8.500.000 VNĐ'
    },
    documents: [
      { id: 'doc-5', name: 'QuyetDinhThoiViec_CongTyABC.pdf', fileSize: '1.2 MB', fileType: 'PDF', uploadDate: '22/07/2026 08:30', status: 'valid', url: '#' },
      { id: 'doc-6', name: 'SoBHXH_DaChotSo.pdf', fileSize: '2.4 MB', fileType: 'PDF', uploadDate: '22/07/2026 08:31', status: 'valid', url: '#' }
    ],
    status: 'completed',
    submittedAt: '22/07/2026 08:35',
    updatedAt: '24/07/2026 11:00',
    estimatedCompletionAt: '24/07/2026 11:00',
    officerInCharge: 'Nguyễn Văn Thành - Phòng BHTN',
    history: [
      { id: 'h20', timestamp: '22/07/2026 08:35', action: 'Nộp hồ sơ trực tuyến thành công', actor: 'Phạm Thị Phương', role: 'Công dân' },
      { id: 'h21', timestamp: '22/07/2026 14:00', action: 'Đã tiếp nhận hồ sơ', actor: 'Nguyễn Văn Thành', role: 'Cán bộ thụ lý' },
      { id: 'h22', timestamp: '23/07/2026 16:30', action: 'Lãnh đạo ký duyệt Quyết định hưởng TCTN điện tử', actor: 'Giám đốc TTDVL', role: 'Lãnh đạo' },
      { id: 'h23', timestamp: '24/07/2026 11:00', action: 'Đã trả kết quả bản điện tử qua Kho quản lý dữ liệu công dân VNeID', actor: 'Hệ thống tự động', role: 'System' }
    ],
    isEncrypted: true,
    securityLevel: 'VNeID-L2'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Hồ sơ đã được tiếp nhận',
    message: 'Mã hồ sơ HS-2026-QN-88912 (Cấp bản sao trích lục hộ tịch) đã được Phòng Hộ tịch tiếp nhận xử lý.',
    type: 'info',
    timestamp: '24/07/2026 11:30',
    read: false,
    dossierCode: 'HS-2026-QN-88912'
  },
  {
    id: 'notif-2',
    title: 'Yêu cầu điều chỉnh hồ sơ!',
    message: 'Hồ sơ HS-2026-QN-99104 cần bổ sung Sơ đồ đấu nối hạ tầng kỹ thuật trước ngày 28/07/2026.',
    type: 'warning',
    timestamp: '24/07/2026 09:10',
    read: false,
    dossierCode: 'HS-2026-QN-99104'
  },
  {
    id: 'notif-3',
    title: 'Trả kết quả thành công',
    message: 'Kết quả thủ tục Giải quyết trợ cấp thất nghiệp (HS-2026-QN-77402) đã được cấp bản điện tử.',
    type: 'success',
    timestamp: '24/07/2026 11:00',
    read: true,
    dossierCode: 'HS-2026-QN-77402'
  },
  {
    id: 'notif-4',
    title: 'Xác thực an toàn cấp cao VNeID',
    message: 'Tài khoản công dân đã được đồng bộ với Cơ sở dữ liệu Quốc gia về Dân cư thành công.',
    type: 'security',
    timestamp: '24/07/2026 08:00',
    read: true
  }
];

export const AUDIT_LOGS: AuditLogItem[] = [
  { id: 'al-1', timestamp: '24/07/2026 13:35:10', actor: 'Nguyễn Văn Hải (Công dân)', ipAddress: '113.190.22.84', action: 'Truy cập điều chỉnh hồ sơ HS-2026-QN-88912', targetData: 'Căn cước công dân', securityStatus: 'Encrypted' },
  { id: 'al-2', timestamp: '24/07/2026 13:30:02', actor: 'Trần Thị Mai (Cán bộ)', ipAddress: '10.24.180.12', action: 'Phê duyệt chuyển bước thẩm định hồ sơ', targetData: 'Trích lục khai sinh', securityStatus: 'Verified' },
  { id: 'al-3', timestamp: '24/07/2026 12:15:44', actor: 'Hệ thống VNeID', ipAddress: '10.0.1.5', action: 'Kiểm tra xác thực sinh trắc học định danh', targetData: 'Token VNeID L2', securityStatus: 'Verified' },
  { id: 'al-4', timestamp: '24/07/2026 11:02:18', actor: 'Phạm Quốc Bảo (Cán bộ)', ipAddress: '10.24.180.45', action: 'Yêu cầu công dân điều chỉnh bản vẽ', targetData: 'Giấy phép xây dựng', securityStatus: 'Verified' }
];

export const DEPARTMENT_STATS: DepartmentStat[] = [
  { name: 'Sở Tư pháp', totalReceived: 3420, completedOnTime: 3380, completedLate: 12, processing: 28, satisfactionRate: 99.1 },
  { name: 'Sở Xây dựng', totalReceived: 1850, completedOnTime: 1780, completedLate: 25, processing: 45, satisfactionRate: 97.8 },
  { name: 'Sở Lao động - TB&XH', totalReceived: 4120, completedOnTime: 4080, completedLate: 10, processing: 30, satisfactionRate: 98.9 },
  { name: 'Sở Y tế', totalReceived: 1240, completedOnTime: 1220, completedLate: 5, processing: 15, satisfactionRate: 99.4 },
  { name: 'Sở Kế hoạch & Đầu tư', totalReceived: 2190, completedOnTime: 2120, completedLate: 30, processing: 40, satisfactionRate: 96.5 }
];
