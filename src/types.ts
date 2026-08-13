export type UserRole = 'citizen' | 'officer' | 'admin';

export interface UserPermissions {
  canManageProcedures: boolean; // Quyền Thêm, Sửa, Xóa thủ tục hành chính
  canManageCategories: boolean; // Quyền Thêm, Sửa, Xóa danh mục
  canManageSettings: boolean;   // Quyền Cấu hình Giao diện, Logo, Tiêu đề
  canManageUsers: boolean;      // Quyền Quản lý Tài khoản & Phân quyền
}

export interface AdminUserAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  title: string;       // Chức danh cán bộ
  department: string;  // Cơ quan / Đơn vị
  role: 'super_admin' | 'officer' | 'editor';
  permissions: UserPermissions;
  status: 'active' | 'locked';
  createdAt: string;
  lastLogin?: string;
}

export type DossierStatus =
  | 'draft'               // Nháp
  | 'submitted'           // Mới nộp
  | 'received'            // Đã tiếp nhận
  | 'processing'          // Đang xử lý / Thẩm định
  | 'additional_required' // Yêu cầu bổ sung
  | 'approved'            // Đã phê duyệt
  | 'completed'           // Đã trả kết quả
  | 'rejected';           // Từ chối

export interface ProcedureCategory {
  id: string;
  code: string;
  name: string;
  iconName: string;
  totalProcedures: number;
  popular?: boolean;
  enabled?: boolean; // Cho phép bật/tắt hiển thị danh mục trên cổng công cộng
}

export interface ProcedureItem {
  id: string;
  code: string;
  categoryId: string;
  categoryName: string;
  title: string;
  department: string; // Cơ quan thực hiện
  level: 'Toàn trình' | 'Một phần' | 'Dịch vụ công khác';
  slaDays: number; // Số ngày làm việc
  fee: number; // Lệ phí (VNĐ)
  requiredDocuments: string[];
  description: string;
  targetUrl?: string; // Link web điều phối tùy biến
  provinceCode?: string; // Mã tỉnh điều hướng (ví dụ: '14' Quảng Ninh, '01' Hà Nội, '79' TP.HCM...)
}

export interface ProvinceRouterConfig {
  provinceCode: string;
  provinceName: string;
  domainSlug: string;
  urlPattern: string;
  autoRedirectEnabled: boolean;
}

export interface DossierDocument {
  id: string;
  name: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  status: 'valid' | 'invalid' | 'pending';
  aiNotes?: string;
  url?: string;
}

export interface DossierHistoryLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  notes?: string;
}

export interface Dossier {
  id: string;
  code: string; // e.g. HS-2026-QN-88912
  procedureId: string;
  procedureTitle: string;
  categoryId: string;
  categoryName: string;
  department: string;
  province: string;
  
  // Citizen Info
  citizenName: string;
  citizenIdCard: string; // CCCD/CMND
  citizenPhone: string;
  citizenEmail: string;
  citizenAddress: string;
  
  // Custom form fields / payload
  formData: Record<string, any>;
  documents: DossierDocument[];
  
  // Processing status
  status: DossierStatus;
  submittedAt: string;
  updatedAt: string;
  estimatedCompletionAt: string;
  officerInCharge?: string;
  officerNotes?: string;
  rejectionReason?: string;
  additionalRequirementNotes?: string;
  
  history: DossierHistoryLog[];
  isEncrypted: boolean;
  securityLevel: 'AES-256' | 'VNeID-L2' | 'Standard';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'security';
  timestamp: string;
  read: boolean;
  dossierCode?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  ipAddress: string;
  action: string;
  targetData: string;
  securityStatus: 'Encrypted' | 'Verified' | 'Flagged';
}

export interface DepartmentStat {
  name: string;
  totalReceived: number;
  completedOnTime: number;
  completedLate: number;
  processing: number;
  satisfactionRate: number; // e.g., 98.5%
}

export interface SystemBrandingConfig {
  logoUrl: string | null; // null or base64 or custom http URL
  headerTitle: string;
  headerSubtitle: string;
  badgeText: string;
  footerTitle: string;
  footerDescription: string;
  footerCopyright: string;

  // Donation / Support Maintenance (Coffee Capuchino QR & Bank)
  donationTitle?: string;       // Tiêu đề mời ủng hộ (Mời admin quản lý ly Cafe Capuchino)
  donationDescription?: string; // Lời cảm ơn/Mô tả ủng hộ
  bankName?: string;            // Tên Ngân hàng
  accountNumber?: string;       // Số tài khoản
  accountHolder?: string;       // Chủ tài khoản
  transferNote?: string;        // Cú pháp chuyển khoản
  qrImageUrl?: string | null;   // Link/Base64 ảnh QR Code

  // Floating Widgets: Zalo Support & AI Assistant Config
  zaloEnabled?: boolean;        // Bật/tắt nút Zalo
  zaloPhone?: string;          // Số điện thoại Zalo
  zaloLink?: string;           // Đường dẫn Zalo Chat (https://zalo.me/...)
  zaloTitle?: string;          // Tiêu đề hiển thị (Hỗ trợ Zalo 24/7)
  zaloQrUrl?: string | null;   // Mã QR Zalo cá nhân/OA

  aiEnabled?: boolean;          // Bật/tắt nút Trợ lý AI
  aiTitle?: string;            // Tên hiển thị Trợ lý AI (Trợ lý AI Điều phối DVC)
  aiGreeting?: string;         // Lời chào mở đầu của AI
  aiSuggestedQuestions?: string[]; // Câu hỏi gợi ý
}

export interface RealVisitStats {
  todayVisits: number;
  totalVisits: number;
  onlineOfficers: number;
}
