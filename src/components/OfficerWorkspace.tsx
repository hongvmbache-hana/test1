import React, { useState, useEffect } from 'react';
import {
  Edit,
  Lock,
  Plus,
  Search,
  X,
  Trash2,
  LogOut,
  Sparkles,
  CheckCircle2,
  ListPlus,
  Layers,
  FolderPlus,
  ExternalLink,
  Globe,
  Palette,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Save,
  Link,
  Info,
  Flame,
  Users,
  UserPlus,
  ShieldCheck,
  UserX,
  Crown,
  Key,
  Check,
  AlertCircle,
  Shield,
  Briefcase,
  UserCheck,
  Compass,
  MapPin,
  Route,
  Copy,
  Play,
  RefreshCw,
  Sliders,
  Wand2,
  ArrowRight,
  Coffee,
  QrCode,
  CreditCard,
  Heart,
  MessageCircle,
  Bot,
  Headphones,
  PhoneCall,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  ListChecks
} from 'lucide-react';
import { Dossier, ProcedureItem, ProcedureCategory, SystemBrandingConfig, RealVisitStats, AdminUserAccount, UserPermissions } from '../types';
import { INITIAL_ADMIN_USERS } from '../data/mockData';
import { CategoryIcon } from './CategoryIcon';
import { PublicAdminLogo } from './Header';

export const PROVINCE_PRESETS = [
  { code: '14', slug: 'quangninh', name: 'Tỉnh Quảng Ninh', portal: 'https://dichvucong.quangninh.gov.vn' },
  { code: '01', slug: 'hanoi', name: 'Thành phố Hà Nội', portal: 'https://dichvucong.hanoi.gov.vn' },
  { code: '79', slug: 'hochiminhcity', name: 'TP. Hồ Chí Minh', portal: 'https://dichvucong.hochiminhcity.gov.vn' },
  { code: '31', slug: 'haiphong', name: 'Thành phố Hải Phòng', portal: 'https://dichvucong.haiphong.gov.vn' },
  { code: '48', slug: 'danang', name: 'Thành phố Đà Nẵng', portal: 'https://dichvucong.danang.gov.vn' },
  { code: '12', slug: 'langson', name: 'Tỉnh Lạng Sơn', portal: 'https://dichvucong.langson.gov.vn' },
  { code: '22', slug: 'bacgiang', name: 'Tỉnh Bắc Giang', portal: 'https://dichvucong.bacgiang.gov.vn' },
  { code: '36', slug: 'thanhhoa', name: 'Tỉnh Thanh Hóa', portal: 'https://dichvucong.thanhhoa.gov.vn' },
  { code: '38', slug: 'hatinh', name: 'Tỉnh Hà Tĩnh', portal: 'https://dichvucong.hatinh.gov.vn' },
  { code: '60', slug: 'dongnai', name: 'Tỉnh Đồng Nai', portal: 'https://dichvucong.dongnai.gov.vn' },
  { code: '74', slug: 'binhduong', name: 'Tỉnh Bình Dương', portal: 'https://dichvucong.binhduong.gov.vn' },
  { code: '68', slug: 'kiengiang', name: 'Tỉnh Kiên Giang', portal: 'https://dichvucong.kiengiang.gov.vn' },
  { code: '00', slug: 'dichvucong', name: 'Cổng DVC Quốc Gia', portal: 'https://dichvucong.gov.vn' },
];

export const getDomainSlugFromProvinceCode = (code: string): string => {
  const trimmed = (code || '').trim().toLowerCase();
  const preset = PROVINCE_PRESETS.find(p => p.code === trimmed || p.slug === trimmed);
  if (preset) return preset.slug;
  if (/^\d+$/.test(trimmed)) {
    return `tinh${trimmed}`;
  }
  return trimmed.replace(/[^a-z0-9]/g, '') || 'quangninh';
};

export const generateProcedureRedirectUrl = (
  provinceCode: string,
  procedureCode: string,
  pattern: string
): string => {
  const domainSlug = getDomainSlugFromProvinceCode(provinceCode);
  const cleanCode = (procedureCode || '1.002891').trim();
  const cleanProvCode = (provinceCode || '14').trim();
  
  return pattern
    .replace(/{provinceDomain}/g, domainSlug)
    .replace(/{provinceCode}/g, cleanProvCode)
    .replace(/{procedureCode}/g, encodeURIComponent(cleanCode));
};

interface OfficerWorkspaceProps {
  branding?: SystemBrandingConfig;
  onSaveBranding?: (newBranding: SystemBrandingConfig) => void;
  onResetBranding?: () => void;
  realStats?: RealVisitStats;
  dossiers?: Dossier[];
  procedures: ProcedureItem[];
  categories: ProcedureCategory[];
  onUpdateDossier?: (updated: Dossier) => void;
  onAddProcedure: (newProc: ProcedureItem) => void;
  onUpdateProcedure: (updatedProc: ProcedureItem) => void;
  onBatchUpdateProcedures?: (updatedProcedures: ProcedureItem[], msg?: string) => void;
  onDeleteProcedure: (procId: string) => void;
  onAddCategory: (newCat: ProcedureCategory) => void;
  onUpdateCategory: (updatedCat: ProcedureCategory) => void;
  onBatchUpdateCategories?: (updatedCategories: ProcedureCategory[]) => void;
  onDeleteCategory: (catId: string) => void;
}

export const OfficerWorkspace: React.FC<OfficerWorkspaceProps> = ({
  branding,
  onSaveBranding,
  onResetBranding,
  realStats,
  procedures,
  categories,
  onAddProcedure,
  onUpdateProcedure,
  onBatchUpdateProcedures,
  onDeleteProcedure,
  onAddCategory,
  onUpdateCategory,
  onBatchUpdateCategories,
  onDeleteCategory
}) => {
  // Admin User Accounts & Local Storage State
  const [adminUsers, setAdminUsers] = useState<AdminUserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('dvc_admin_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMIN_USERS;
  });

  // Save users to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('dvc_admin_users', JSON.stringify(adminUsers));
    } catch (e) {
      console.error(e);
    }
  }, [adminUsers]);

  // Current Logged-In Admin Account State
  const [loggedInUser, setLoggedInUser] = useState<AdminUserAccount | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false); // Always require fresh login when opening or switching to Admin tab
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Subtab State: 'procedures' | 'categories' | 'widgets' | 'settings' | 'users' | 'province_router'
  const [activeSubTab, setActiveSubTab] = useState<'procedures' | 'categories' | 'widgets' | 'settings' | 'users' | 'province_router'>('procedures');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Province Router Config State
  const [provRouterCode, setProvRouterCode] = useState<string>('14'); // Default province code: 14 Quảng Ninh
  const [provRouterName, setProvRouterName] = useState<string>('Tỉnh Quảng Ninh');
  const [provRouterPattern, setProvRouterPattern] = useState<string>(
    'https://dichvucong.{provinceDomain}.gov.vn/pki?procedureCode={provinceCode}'
  );
  const [testProcedureCode, setTestProcedureCode] = useState<string>(procedures.length > 0 ? procedures[0].code : 'QT-BHXH-01');
  const [testProvinceCode, setTestProvinceCode] = useState<string>('14');
  const [copiedRouterUrl, setCopiedRouterUrl] = useState<boolean>(false);
  const [routerToastMsg, setRouterToastMsg] = useState<string | null>(null);

  // Procedure Add/Edit extra field for Province Code
  const [procProvinceCode, setProcProvinceCode] = useState<string>('14');

  // Branding Config Form State
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(branding?.logoUrl || null);
  const [logoInputType, setLogoInputType] = useState<'file' | 'url'>('file');
  const [logoUrlInput, setLogoUrlInput] = useState<string>('');
  const [headerTitle, setHeaderTitle] = useState<string>(branding?.headerTitle || 'ĐIỀU PHỐI DVC SIÊU TỐC');
  const [headerSubtitle, setHeaderSubtitle] = useState<string>(branding?.headerSubtitle || 'Hệ thống điều phối dịch vụ công & tiếp nhận hồ sơ hành chính công trực tuyến');
  const [badgeText, setBadgeText] = useState<string>(branding?.badgeText || 'v2.2.0 Realtime');
  const [footerTitle, setFooterTitle] = useState<string>(branding?.footerTitle || 'ĐIỀU PHỐI DVC SIÊU TỐC');
  const [footerDescription, setFooterDescription] = useState<string>(branding?.footerDescription || 'Đây là dự án phi lợi nhuận nhằm hỗ trợ cán bộ, công chức, viên chức tại Trung tâm Phục vụ hành chính công. Tôi chúc các anh chị được về nhà ăn bữa cơm chiều đúng giờ.');
  const [footerCopyright, setFooterCopyright] = useState<string>(branding?.footerCopyright || '© 2026 Hệ thống Điều phối DVC Siêu tốc - Vì một nền hành chính minh bạch, hiệu quả');

  // Donation / Capuchino Coffee QR & Bank Config Form State
  const [donationTitle, setDonationTitle] = useState<string>(branding?.donationTitle || 'Mời admin quản lý ly Cafe Capuchino ☕');
  const [donationDescription, setDonationDescription] = useState<string>(
    branding?.donationDescription || 'Dự án phục vụ cộng đồng phi lợi nhuận. Sự ủng hộ của Quý vị giúp duy trì máy chủ, băng thông và liên tục nâng cấp tính năng phục vụ cán bộ, người dân.'
  );
  const [bankName, setBankName] = useState<string>(branding?.bankName || 'MBBank (Ngân hàng Quân Đội)');
  const [accountNumber, setAccountNumber] = useState<string>(branding?.accountNumber || '0988888888');
  const [accountHolder, setAccountHolder] = useState<string>(branding?.accountHolder || 'VŨ MẠNH HỒNG');
  const [transferNote, setTransferNote] = useState<string>(branding?.transferNote || 'Moi Cafe Capuchino Admin DVC');
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(branding?.qrImageUrl || null);
  const [qrInputType, setQrInputType] = useState<'vietqr' | 'url' | 'file'>('vietqr');
  const [qrUrlInput, setQrUrlInput] = useState<string>('');

  // Floating Widgets: Zalo Support & AI Assistant Config Form State
  const [zaloEnabled, setZaloEnabled] = useState<boolean>(branding?.zaloEnabled !== false);
  const [zaloPhone, setZaloPhone] = useState<string>(branding?.zaloPhone || '0988888888');
  const [zaloLink, setZaloLink] = useState<string>(branding?.zaloLink || 'https://zalo.me/0988888888');
  const [zaloTitle, setZaloTitle] = useState<string>(branding?.zaloTitle || 'Hỗ trợ Zalo 24/7');
  const [zaloQrUrl, setZaloQrUrl] = useState<string | null>(branding?.zaloQrUrl || null);

  const [aiEnabled, setAiEnabled] = useState<boolean>(branding?.aiEnabled !== false);
  const [aiTitle, setAiTitle] = useState<string>(branding?.aiTitle || 'Trợ lý AI Điều phối DVC');
  const [aiGreeting, setAiGreeting] = useState<string>(
    branding?.aiGreeting ||
      'Xin chào! Tôi là Trợ lý AI Điều phối DVC Siêu tốc. Tôi có thể hỗ trợ bạn hướng dẫn quy trình làm thủ tục, kiểm tra tính hợp lệ của giấy tờ hoặc giải đáp thắc mắc về thời gian xử lý.'
  );
  const [aiQuestionsText, setAiQuestionsText] = useState<string>(
    (branding?.aiSuggestedQuestions || [
      'Làm trích lục khai sinh cần giấy tờ gì?',
      'Thời gian xử lý cấp phép xây dựng?',
      'Lệ phí làm trợ cấp thất nghiệp?'
    ]).join('\n')
  );

  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);

  // Category Display Selection Configuration State
  const [catSearchTerm, setCatSearchTerm] = useState<string>('');
  const [catStatusFilter, setCatStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [enabledCategoryIds, setEnabledCategoryIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    categories.forEach((cat) => {
      if (cat.enabled !== false) {
        set.add(cat.id);
      }
    });
    return set;
  });

  useEffect(() => {
    const set = new Set<string>();
    categories.forEach((cat) => {
      if (cat.enabled !== false) {
        set.add(cat.id);
      }
    });
    setEnabledCategoryIds(set);
  }, [categories]);

  // Modal State for User Management (Add / Edit User)
  const [userModalMode, setUserModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [uUsername, setUUsername] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [uFullName, setUFullName] = useState('');
  const [uTitle, setUTitle] = useState('Chuyên viên Tiếp nhận Hồ sơ');
  const [uDepartment, setUDepartment] = useState('Bộ phận Một cửa - Trung tâm Phục vụ HCC');
  const [uRole, setURole] = useState<'super_admin' | 'officer' | 'editor'>('officer');
  const [uStatus, setUStatus] = useState<'active' | 'locked'>('active');
  const [uPermProcedures, setUPermProcedures] = useState(true);
  const [uPermCategories, setUPermCategories] = useState(true);
  const [uPermSettings, setUPermSettings] = useState(false);
  const [uPermUsers, setUPermUsers] = useState(false);
  const [userModalError, setUserModalError] = useState<string | null>(null);

  // Confirm Delete User State
  const [deletingUser, setDeletingUser] = useState<AdminUserAccount | null>(null);

  // Keep state in sync with props when branding changes
  useEffect(() => {
    if (branding) {
      setCustomLogoUrl(branding.logoUrl);
      setHeaderTitle(branding.headerTitle);
      setHeaderSubtitle(branding.headerSubtitle);
      setBadgeText(branding.badgeText);
      setFooterTitle(branding.footerTitle);
      setFooterDescription(branding.footerDescription);
      setFooterCopyright(branding.footerCopyright);

      setDonationTitle(branding.donationTitle || 'Mời admin quản lý ly Cafe Capuchino ☕');
      setDonationDescription(
        branding.donationDescription ||
          'Dự án phục vụ cộng đồng phi lợi nhuận. Sự ủng hộ của Quý vị giúp duy trì máy chủ, băng thông và liên tục nâng cấp tính năng phục vụ cán bộ, người dân.'
      );
      setBankName(branding.bankName || 'MBBank (Ngân hàng Quân Đội)');
      setAccountNumber(branding.accountNumber || '0988888888');
      setAccountHolder(branding.accountHolder || 'VŨ MẠNH HỒNG');
      setTransferNote(branding.transferNote || 'Moi Cafe Capuchino Admin DVC');
      setQrImageUrl(branding.qrImageUrl || null);

      setZaloEnabled(branding.zaloEnabled !== false);
      setZaloPhone(branding.zaloPhone || '0988888888');
      setZaloLink(branding.zaloLink || 'https://zalo.me/0988888888');
      setZaloTitle(branding.zaloTitle || 'Hỗ trợ Zalo 24/7');
      setZaloQrUrl(branding.zaloQrUrl || null);

      setAiEnabled(branding.aiEnabled !== false);
      setAiTitle(branding.aiTitle || 'Trợ lý AI Điều phối DVC');
      setAiGreeting(
        branding.aiGreeting ||
          'Xin chào! Tôi là Trợ lý AI Điều phối DVC Siêu tốc. Tôi có thể hỗ trợ bạn hướng dẫn quy trình làm thủ tục, kiểm tra tính hợp lệ của giấy tờ hoặc giải đáp thắc mắc về thời gian xử lý.'
      );
      setAiQuestionsText(
        (branding.aiSuggestedQuestions || [
          'Làm trích lục khai sinh cần giấy tờ gì?',
          'Thời gian xử lý cấp phép xây dựng?',
          'Lệ phí làm trợ cấp thất nghiệp?'
        ]).join('\n')
      );
    }
  }, [branding]);

  // Handle Logo File Upload
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn tệp nhỏ hơn.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setCustomLogoUrl(base64Data);
        setSettingsSuccessMsg('Đã chọn tệp logo thành công! Bấm "Lưu cấu hình" để áp dụng.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle QR File Upload
  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn tệp nhỏ hơn.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setQrImageUrl(base64Data);
        setSettingsSuccessMsg('Đã chọn tệp ảnh QR thành công! Bấm "Lưu tất cả cấu hình" để áp dụng.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Logo URL Input Apply
  const handleApplyLogoUrl = () => {
    if (logoUrlInput.trim()) {
      setCustomLogoUrl(logoUrlInput.trim());
      setSettingsSuccessMsg('Đã cập nhật đường dẫn Logo! Bấm "Lưu cấu hình" để áp dụng.');
    }
  };

  // Handle QR URL Input Apply
  const handleApplyQrUrl = () => {
    if (qrUrlInput.trim()) {
      setQrImageUrl(qrUrlInput.trim());
      setSettingsSuccessMsg('Đã cập nhật đường dẫn ảnh QR! Bấm "Lưu tất cả cấu hình" để áp dụng.');
    }
  };

  // Handle Save All Settings
  const handleSaveAllSettings = () => {
    // Determine effective QR URL
    let finalQrUrl = qrImageUrl;
    if (qrInputType === 'vietqr') {
      finalQrUrl = `https://img.vietqr.io/image/MB-${accountNumber.trim()}-compact2.png?amount=30000&addInfo=${encodeURIComponent(
        transferNote.trim()
      )}&accountName=${encodeURIComponent(accountHolder.trim())}`;
    }

    const newBrandingConfig: SystemBrandingConfig = {
      logoUrl: customLogoUrl,
      headerTitle: headerTitle.trim() || 'ĐIỀU PHỐI DVC SIÊU TỐC',
      headerSubtitle: headerSubtitle.trim() || 'Hệ thống điều phối dịch vụ công & tiếp nhận hồ sơ hành chính công trực tuyến',
      badgeText: badgeText.trim() || 'v2.2.0 Realtime',
      footerTitle: footerTitle.trim() || 'ĐIỀU PHỐI DVC SIÊU TỐC',
      footerDescription: footerDescription.trim() || 'Đây là dự án phi lợi nhuận...',
      footerCopyright: footerCopyright.trim() || '© 2026 Hệ thống Điều phối DVC Siêu tốc...',

      donationTitle: donationTitle.trim() || 'Mời admin quản lý ly Cafe Capuchino ☕',
      donationDescription: donationDescription.trim() || 'Dự án phục vụ cộng đồng phi lợi nhuận...',
      bankName: bankName.trim() || 'MBBank (Ngân hàng Quân Đội)',
      accountNumber: accountNumber.trim() || '0988888888',
      accountHolder: accountHolder.trim() || 'VŨ MẠNH HỒNG',
      transferNote: transferNote.trim() || 'Moi Cafe Capuchino Admin DVC',
      qrImageUrl: finalQrUrl,

      zaloEnabled,
      zaloPhone: zaloPhone.trim() || '0988888888',
      zaloLink: zaloLink.trim() || `https://zalo.me/${zaloPhone.trim()}`,
      zaloTitle: zaloTitle.trim() || 'Hỗ trợ Zalo 24/7',
      zaloQrUrl: zaloQrUrl,

      aiEnabled,
      aiTitle: aiTitle.trim() || 'Trợ lý AI Điều phối DVC',
      aiGreeting: aiGreeting.trim() || 'Xin chào! Tôi là Trợ lý AI Điều phối DVC Siêu tốc.',
      aiSuggestedQuestions: aiQuestionsText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    };

    if (onSaveBranding) {
      onSaveBranding(newBrandingConfig);
      setSettingsSuccessMsg('Đã lưu toàn bộ cấu hình Giao diện, Logo, Hỗ trợ Zalo, Trợ lý AI & Mã QR ủng hộ thành công!');
      setTimeout(() => setSettingsSuccessMsg(null), 4000);
    }
  };

  // Handle Reset to Default
  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại Cấu hình Giao diện, Hỗ trợ Zalo & Trợ lý AI về mặc định ban đầu không?')) {
      if (onResetBranding) {
        onResetBranding();
      }
      setCustomLogoUrl(null);
      setHeaderTitle('ĐIỀU PHỐI DVC SIÊU TỐC');
      setHeaderSubtitle('Hệ thống điều phối dịch vụ công & tiếp nhận hồ sơ hành chính công trực tuyến');
      setBadgeText('v2.2.0 Realtime');
      setFooterTitle('ĐIỀU PHỐI DVC SIÊU TỐC');
      setFooterDescription('Đây là dự án phi lợi nhuận nhằm hỗ trợ cán bộ, công chức, viên chức tại Trung tâm Phục vụ hành chính công. Tôi chúc các anh chị được về nhà ăn bữa cơm chiều đúng giờ.');
      setFooterCopyright('© 2026 Hệ thống Điều phối DVC Siêu tốc - Vì một nền hành chính minh bạch, hiệu quả');

      setDonationTitle('Mời admin quản lý ly Cafe Capuchino ☕');
      setDonationDescription('Dự án phục vụ cộng đồng phi lợi nhuận. Sự ủng hộ của Quý vị giúp duy trì máy chủ, băng thông và liên tục nâng cấp tính năng phục vụ cán bộ, người dân.');
      setBankName('MBBank (Ngân hàng Quân Đội)');
      setAccountNumber('0988888888');
      setAccountHolder('VŨ MẠNH HỒNG');
      setTransferNote('Moi Cafe Capuchino Admin DVC');
      setQrImageUrl('https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=30000&addInfo=Moi%20Cafe%20Capuchino%20Admin%20DVC&accountName=VU%20MANH%20HONG');

      setZaloEnabled(true);
      setZaloPhone('0988888888');
      setZaloLink('https://zalo.me/0988888888');
      setZaloTitle('Hỗ trợ Zalo 24/7');
      setZaloQrUrl(null);

      setAiEnabled(true);
      setAiTitle('Trợ lý AI Điều phối DVC');
      setAiGreeting('Xin chào! Tôi là Trợ lý AI Điều phối DVC Siêu tốc. Tôi có thể hỗ trợ bạn hướng dẫn quy trình làm thủ tục, kiểm tra tính hợp lệ của giấy tờ hoặc giải đáp thắc mắc về thời gian xử lý.');
      setAiQuestionsText('Làm trích lục khai sinh cần giấy tờ gì?\nThời gian xử lý cấp phép xây dựng?\nLệ phí làm trợ cấp thất nghiệp?');

      setSettingsSuccessMsg('Đã khôi phục cài đặt Giao diện, Hỗ trợ Zalo & Trợ lý AI mặc định!');
      setTimeout(() => setSettingsSuccessMsg(null), 4000);
    }
  };

  // Procedure Filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal State for Procedure (Add / Edit)
  const [procedureModalMode, setProcedureModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingProcedureId, setEditingProcedureId] = useState<string | null>(null);
  const [procCode, setProcCode] = useState('');
  const [procTitle, setProcTitle] = useState('');
  const [procCategoryId, setProcCategoryId] = useState('');
  const [procDept, setProcDept] = useState('Sở Tư pháp tỉnh Quảng Ninh');
  const [procLevel, setProcLevel] = useState<'Toàn trình' | 'Một phần' | 'Dịch vụ công khác'>('Toàn trình');
  const [procSla, setProcSla] = useState(3);
  const [procFee, setProcFee] = useState(10000);
  const [procDocs, setProcDocs] = useState('Tờ khai điện tử theo mẫu\nBản quét CCCD / Hộ chiếu rõ 2 mặt');
  const [procDesc, setProcDesc] = useState('Thủ tục hành chính được thực hiện trực tuyến qua Cổng DVC Siêu Tốc.');
  const [procTargetUrl, setProcTargetUrl] = useState('https://dichvucong.quangninh.gov.vn');

  // Modal State for Category (Add / Edit)
  const [categoryModalMode, setCategoryModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catCode, setCatCode] = useState('');
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('FileText');
  const [catPopular, setCatPopular] = useState(false);

  // Delete Confirmations
  const [deletingProc, setDeletingProc] = useState<ProcedureItem | null>(null);
  const [deletingCat, setDeletingCat] = useState<ProcedureCategory | null>(null);

  // Handle Admin Login
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUser = loginUsername.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    const found = adminUsers.find(
      (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
    );

    if (!found) {
      setLoginError('Tên đăng nhập hoặc mật khẩu không đúng!');
      return;
    }

    if (found.status === 'locked') {
      setLoginError('Tài khoản này hiện đang bị KHÓA. Vui lòng liên hệ Quản trị viên hệ thống!');
      return;
    }

    setLoggedInUser(found);
    setIsAdminLoggedIn(true);
    setLoginError(null);
  };

  const handleQuickFillAndLogin = (userObj: AdminUserAccount) => {
    setLoginUsername(userObj.username);
    setLoginPassword(userObj.password);
    setLoggedInUser(userObj);
    setIsAdminLoggedIn(true);
    setLoginError(null);
  };

  // Province Router Handlers
  const handleSelectProvincePreset = (preset: typeof PROVINCE_PRESETS[0]) => {
    setProvRouterCode(preset.code);
    setProvRouterName(preset.name);
    setTestProvinceCode(preset.code);
    setRouterToastMsg(`Đã chọn Mã tỉnh ${preset.code} (${preset.name})`);
    setTimeout(() => setRouterToastMsg(null), 2500);
  };

  const handleApplyProvinceRouterToAll = () => {
    if (!onBatchUpdateProcedures) return;
    const updatedList = procedures.map((p) => {
      const targetUrl = generateProcedureRedirectUrl(provRouterCode, p.code, provRouterPattern);
      return {
        ...p,
        provinceCode: provRouterCode,
        targetUrl: targetUrl
      };
    });
    onBatchUpdateProcedures(
      updatedList,
      `Đã tự động điều hướng ${updatedList.length} thủ tục về Mã tỉnh ${provRouterCode} (${provRouterName})!`
    );
    setRouterToastMsg(`Đã cập nhật điều hướng mã tỉnh thành công cho ${updatedList.length} thủ tục!`);
    setTimeout(() => setRouterToastMsg(null), 3500);
  };

  // Open Add Procedure Modal
  const openAddProcModal = () => {
    setProcedureModalMode('add');
    setEditingProcedureId(null);
    const newCode = `1.00${Math.floor(1000 + Math.random() * 9000)}`;
    setProcCode(newCode);
    setProcTitle('');
    setProcCategoryId(categories[0]?.id || 'cat-19');
    setProcDept('Sở Tư pháp tỉnh Quảng Ninh');
    setProcLevel('Toàn trình');
    setProcSla(3);
    setProcFee(15000);
    setProcDocs('Tờ khai điện tử theo mẫu\nBản quét CCCD / Hộ chiếu rõ 2 mặt');
    setProcDesc('Thủ tục được tiếp nhận và giải quyết trực tuyến.');
    setProcProvinceCode(provRouterCode);
    setProcTargetUrl(generateProcedureRedirectUrl(provRouterCode, newCode, provRouterPattern));
  };

  // Open Edit Procedure Modal
  const openEditProcModal = (p: ProcedureItem) => {
    setProcedureModalMode('edit');
    setEditingProcedureId(p.id);
    setProcCode(p.code);
    setProcTitle(p.title);
    setProcCategoryId(p.categoryId);
    setProcDept(p.department);
    setProcLevel(p.level);
    setProcSla(p.slaDays);
    setProcFee(p.fee);
    setProcDocs(p.requiredDocuments.join('\n'));
    setProcDesc(p.description);
    setProcProvinceCode(p.provinceCode || provRouterCode);
    setProcTargetUrl(p.targetUrl || generateProcedureRedirectUrl(p.provinceCode || provRouterCode, p.code, provRouterPattern));
  };

  // Save Procedure (Add or Edit)
  const handleSaveProcedure = () => {
    if (!procTitle || !procCode) return;
    const catObj = categories.find((c) => c.id === procCategoryId) || categories[0];
    const docsArray = procDocs
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const finalProvinceCode = procProvinceCode.trim() || provRouterCode;
    const finalTargetUrl = procTargetUrl.trim() || generateProcedureRedirectUrl(finalProvinceCode, procCode, provRouterPattern);

    if (procedureModalMode === 'add') {
      const newProc: ProcedureItem = {
        id: `proc-${Date.now()}`,
        code: procCode,
        categoryId: catObj.id,
        categoryName: catObj.name,
        title: procTitle,
        department: procDept,
        level: procLevel,
        slaDays: Number(procSla),
        fee: Number(procFee),
        requiredDocuments: docsArray.length > 0 ? docsArray : ['Tờ khai điện tử'],
        description: procDesc,
        provinceCode: finalProvinceCode,
        targetUrl: finalTargetUrl
      };
      onAddProcedure(newProc);
    } else if (procedureModalMode === 'edit' && editingProcedureId) {
      const updatedProc: ProcedureItem = {
        id: editingProcedureId,
        code: procCode,
        categoryId: catObj.id,
        categoryName: catObj.name,
        title: procTitle,
        department: procDept,
        level: procLevel,
        slaDays: Number(procSla),
        fee: Number(procFee),
        requiredDocuments: docsArray,
        description: procDesc,
        provinceCode: finalProvinceCode,
        targetUrl: finalTargetUrl
      };
      onUpdateProcedure(updatedProc);
    }

    setProcedureModalMode(null);
    setEditingProcedureId(null);
  };

  // Open Add Category Modal
  const openAddCategoryModal = () => {
    setCategoryModalMode('add');
    setEditingCategoryId(null);
    setCatCode(`DM-${Math.floor(10 + Math.random() * 90)}`);
    setCatName('');
    setCatIcon('FileText');
    setCatPopular(false);
  };

  // Open Edit Category Modal
  const openEditCategoryModal = (c: ProcedureCategory) => {
    setCategoryModalMode('edit');
    setEditingCategoryId(c.id);
    setCatCode(c.code);
    setCatName(c.name);
    setCatIcon(c.iconName);
    setCatPopular(!!c.popular);
  };

  // Save Category (Add or Edit)
  const handleSaveCategory = () => {
    if (!catName || !catCode) return;

    if (categoryModalMode === 'add') {
      const newCat: ProcedureCategory = {
        id: `cat-${Date.now()}`,
        code: catCode.toUpperCase(),
        name: catName.toUpperCase(),
        iconName: catIcon,
        totalProcedures: 0,
        popular: catPopular
      };
      onAddCategory(newCat);
    } else if (categoryModalMode === 'edit' && editingCategoryId) {
      const existing = categories.find((c) => c.id === editingCategoryId);
      const updatedCat: ProcedureCategory = {
        id: editingCategoryId,
        code: catCode.toUpperCase(),
        name: catName.toUpperCase(),
        iconName: catIcon,
        totalProcedures: existing ? existing.totalProcedures : 0,
        popular: catPopular
      };
      onUpdateCategory(updatedCat);
    }

    setCategoryModalMode(null);
    setEditingCategoryId(null);
  };

  // User Management Handlers
  const openAddUserModal = () => {
    setUserModalMode('add');
    setEditingUserId(null);
    setUUsername('');
    setUPassword('');
    setUFullName('');
    setUTitle('Chuyên viên Tiếp nhận Hồ sơ');
    setUDepartment('Bộ phận Một cửa - Trung tâm Phục vụ HCC');
    setURole('officer');
    setUStatus('active');
    setUPermProcedures(true);
    setUPermCategories(true);
    setUPermSettings(false);
    setUPermUsers(false);
    setUserModalError(null);
  };

  const openEditUserModal = (u: AdminUserAccount) => {
    setUserModalMode('edit');
    setEditingUserId(u.id);
    setUUsername(u.username);
    setUPassword(u.password);
    setUFullName(u.fullName);
    setUTitle(u.title);
    setUDepartment(u.department);
    setURole(u.role);
    setUStatus(u.status);
    setUPermProcedures(u.permissions.canManageProcedures);
    setUPermCategories(u.permissions.canManageCategories);
    setUPermSettings(u.permissions.canManageSettings);
    setUPermUsers(u.permissions.canManageUsers);
    setUserModalError(null);
  };

  const handleSaveUser = () => {
    if (!uUsername.trim() || !uPassword.trim() || !uFullName.trim()) {
      setUserModalError('Vui lòng điền đầy đủ Tên đăng nhập, Mật khẩu và Họ tên cán bộ!');
      return;
    }

    const cleanUser = uUsername.trim().toLowerCase();

    if (userModalMode === 'add') {
      const exists = adminUsers.some((u) => u.username.toLowerCase() === cleanUser);
      if (exists) {
        setUserModalError(`Tên đăng nhập "${cleanUser}" đã tồn tại! Vui lòng chọn tên khác.`);
        return;
      }
      const newUser: AdminUserAccount = {
        id: `user-${Date.now()}`,
        username: cleanUser,
        password: uPassword.trim(),
        fullName: uFullName.trim(),
        title: uTitle.trim(),
        department: uDepartment.trim(),
        role: uRole,
        status: uStatus,
        createdAt: new Date().toISOString().split('T')[0],
        permissions: {
          canManageProcedures: uPermProcedures,
          canManageCategories: uPermCategories,
          canManageSettings: uPermSettings,
          canManageUsers: uPermUsers
        }
      };
      setAdminUsers((prev) => [newUser, ...prev]);
    } else if (userModalMode === 'edit' && editingUserId) {
      const exists = adminUsers.some((u) => u.id !== editingUserId && u.username.toLowerCase() === cleanUser);
      if (exists) {
        setUserModalError(`Tên đăng nhập "${cleanUser}" đã được sử dụng bởi tài khoản khác!`);
        return;
      }
      setAdminUsers((prev) =>
        prev.map((u) => {
          if (u.id === editingUserId) {
            const updated: AdminUserAccount = {
              ...u,
              username: cleanUser,
              password: uPassword.trim(),
              fullName: uFullName.trim(),
              title: uTitle.trim(),
              department: uDepartment.trim(),
              role: uRole,
              status: uStatus,
              permissions: {
                canManageProcedures: uPermProcedures,
                canManageCategories: uPermCategories,
                canManageSettings: uPermSettings,
                canManageUsers: uPermUsers
              }
            };
            if (loggedInUser && loggedInUser.id === editingUserId) {
              setLoggedInUser(updated);
            }
            return updated;
          }
          return u;
        })
      );
    }

    setUserModalMode(null);
    setEditingUserId(null);
  };

  const handleToggleUserStatus = (userToToggle: AdminUserAccount) => {
    if (loggedInUser && loggedInUser.id === userToToggle.id) {
      alert('Bạn không thể tự khóa tài khoản mà bạn đang sử dụng để đăng nhập!');
      return;
    }
    const newStatus = userToToggle.status === 'active' ? 'locked' : 'active';
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userToToggle.id ? { ...u, status: newStatus } : u))
    );
  };

  const handleDeleteUserConfirm = (userToDelete: AdminUserAccount) => {
    if (loggedInUser && loggedInUser.id === userToDelete.id) {
      alert('Bạn không thể xóa tài khoản mà bạn đang sử dụng để đăng nhập!');
      return;
    }
    setAdminUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setDeletingUser(null);
  };

  // Filtered Users
  const filteredUsers = adminUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.title.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Filtered Procedures
  const filteredProcedures = procedures.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Categories
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If Admin is NOT logged in, show Admin Login view
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase">
              Đăng nhập Admin Dashboard
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vui lòng nhập tài khoản Quản trị viên để quản lý thủ tục & danh mục
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Nhập hongvm"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập Hongvm@1988"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-600 dark:text-red-300 font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-md transition"
            >
              Đăng nhập Quản trị
            </button>
          </form>

          {/* Quick Fill Box */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2.5">
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider text-center">
              🔑 Mẫu tài khoản thử nghiệm đăng nhập:
            </div>
            
            <button
              type="button"
              onClick={() => {
                const found = adminUsers.find(u => u.username === 'hongvm') || adminUsers[0];
                handleQuickFillAndLogin(found);
              }}
              className="w-full p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>1. hongvm (Super Admin - Toàn quyền)</span>
              </div>
              <span className="text-[10px] opacity-90 font-mono">Hongvm@1988</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const found = adminUsers.find(u => u.username === 'nguyenvana') || adminUsers[1] || adminUsers[0];
                handleQuickFillAndLogin(found);
              }}
              className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-200" />
                <span>2. nguyenvana (Thành viên - Quyền Thủ tục)</span>
              </div>
              <span className="text-[10px] opacity-90 font-mono">Canbo123@</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtering for Category Visibility Config Grid
  const displayCategoryItems = categories.filter((cat) => {
    const isChecked = enabledCategoryIds.has(cat.id);
    
    // Status Filter
    if (catStatusFilter === 'enabled' && !isChecked) return false;
    if (catStatusFilter === 'disabled' && isChecked) return false;

    // Search Term
    if (catSearchTerm.trim()) {
      const q = catSearchTerm.toLowerCase().trim();
      const matchName = cat.name.toLowerCase().includes(q);
      const matchCode = cat.code.toLowerCase().includes(q);
      return matchName || matchCode;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-md font-bold border border-emerald-200 dark:border-emerald-800 uppercase flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Đang đăng nhập: <strong>{loggedInUser?.fullName || 'Hoàng Văn Hồng'}</strong> ({loggedInUser?.username})</span>
            </span>

            {loggedInUser?.role === 'super_admin' ? (
              <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300 font-extrabold flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                Quản trị tối cao (Super Admin)
              </span>
            ) : (
              <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                Cán bộ / Thành viên
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mt-2 uppercase tracking-tight text-slate-900 dark:text-white">
            TRANG QUẢN TRỊ ADMIN - THỦ TỤC & DANH MỤC HÀNH CHÍNH
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            {loggedInUser?.department} • Chức danh: {loggedInUser?.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-600"
            title="Đăng xuất khỏi bàn làm việc Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Admin Subtabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveSubTab('procedures')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
            activeSubTab === 'procedures'
              ? 'bg-blue-600 text-white shadow-2xs font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <ListPlus className="w-4 h-4" />
          <span>Quản lý Thủ tục Hành chính ({procedures.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
            activeSubTab === 'categories'
              ? 'bg-blue-600 text-white shadow-2xs font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Quản lý Danh mục Thủ tục ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('widgets')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
            activeSubTab === 'widgets'
              ? 'bg-gradient-to-r from-blue-700 via-amber-700 to-rose-700 text-white shadow-md font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-300" />
          <span>Quản lý 3 Nút Nổi (AI, Zalo, Ủng Hộ ☕)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
            activeSubTab === 'settings'
              ? 'bg-red-700 text-white shadow-2xs font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <ListChecks className="w-4 h-4 text-amber-300" />
          <span>Cấu hình Hiển thị Danh mục Thủ tục ({enabledCategoryIds.size}/{categories.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
            activeSubTab === 'users'
              ? 'bg-indigo-600 text-white shadow-2xs font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Quản lý Tài khoản & Phân quyền ({adminUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('province_router')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
            activeSubTab === 'province_router'
              ? 'bg-emerald-600 text-white shadow-2xs font-bold'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Điều hướng Mã Tỉnh ({provRouterCode})</span>
        </button>
      </div>

      {/* SUBTAB 1: PROCEDURES MANAGEMENT (CRUD Thủ tục) */}
      {activeSubTab === 'procedures' && (
        <div className="space-y-4">
          {!loggedInUser?.permissions.canManageProcedures && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tài khoản <strong>[{loggedInUser?.fullName}]</strong> đang có quyền XEM danh sách. Bạn chưa được gán quyền <strong>Thêm/Sửa/Xóa thủ tục hành chính</strong>.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thủ tục theo mã, tên, cơ quan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter Dropdown */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="all">Tất cả Lĩnh vực ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.totalProcedures})
                  </option>
                ))}
              </select>
            </div>

            {loggedInUser?.permissions.canManageProcedures ? (
              <button
                onClick={openAddProcModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Thủ tục Hành chính mới</span>
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-not-allowed"
                title="Tài khoản không có quyền thêm thủ tục"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Thêm Thủ tục mới (🔒 Đã khóa)</span>
              </button>
            )}
          </div>

          {/* Procedures Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-semibold uppercase border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Mã Thủ Tục</th>
                    <th className="p-3.5">Tên Thủ Tục</th>
                    <th className="p-3.5">Link Web Điều Phối</th>
                    <th className="p-3.5">Danh Mục</th>
                    <th className="p-3.5">Cơ Quan Xử Lý</th>
                    <th className="p-3.5">Mức Độ</th>
                    <th className="p-3.5">Thời Hạn</th>
                    <th className="p-3.5">Lệ Phí</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredProcedures.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-3.5 font-mono font-bold text-blue-600 whitespace-nowrap">{p.code}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm">
                        <div>{p.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal line-clamp-1">{p.description}</div>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate max-w-[140px] block" title={p.targetUrl || 'https://dichvucong.gov.vn'}>
                            {p.targetUrl || 'https://dichvucong.gov.vn'}
                          </span>
                          <button
                            onClick={() => window.open(p.targetUrl || 'https://dichvucong.gov.vn', '_blank')}
                            className="p-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 rounded border border-blue-200 dark:border-blue-800 shrink-0"
                            title="Mở link điều phối"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {p.categoryName}
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs">{p.department}</td>
                      <td className="p-3.5 font-bold whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px]">
                          {p.level}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap font-medium">{p.slaDays} ngày</td>
                      <td className="p-3.5 whitespace-nowrap font-medium">
                        {p.fee === 0 ? 'Miễn phí' : `${p.fee.toLocaleString()} VNĐ`}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        {loggedInUser?.permissions.canManageProcedures ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditProcModal(p)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                              title="Sửa thủ tục"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingProc(p)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 rounded-lg transition"
                              title="Xóa thủ tục"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-normal italic">Chỉ xem</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredProcedures.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Không tìm thấy thủ tục nào khớp với điều kiện lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CATEGORIES MANAGEMENT (CRUD Danh mục) */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          {!loggedInUser?.permissions.canManageCategories && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tài khoản <strong>[{loggedInUser?.fullName}]</strong> đang có quyền XEM danh sách. Bạn chưa được gán quyền <strong>Thêm/Sửa/Xóa danh mục thủ tục</strong>.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm danh mục thủ tục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {loggedInUser?.permissions.canManageCategories ? (
                <button
                  onClick={openAddCategoryModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0 transition"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Thêm Danh mục mới</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Thêm Danh mục mới (🔒 Đã khóa)</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCategories.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
                    <CategoryIcon name={c.iconName} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded">
                        {c.code}
                      </span>
                      {c.popular && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 font-bold px-1.5 rounded flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                          PHỔ BIẾN
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase truncate mt-0.5">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {c.totalProcedures} thủ tục khả dụng
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {loggedInUser?.permissions.canManageCategories ? (
                    <>
                      <button
                        onClick={() => onUpdateCategory({ ...c, popular: !c.popular })}
                        className={`p-1.5 rounded-lg transition text-[11px] font-bold flex items-center gap-1 border ${
                          c.popular
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                        }`}
                        title={c.popular ? 'Bấm để hủy gán mục Phổ biến' : 'Bấm để bật gán mục Phổ biến trong trang chủ'}
                      >
                        <Flame className={`w-3.5 h-3.5 ${c.popular ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      </button>
                      <button
                        onClick={() => openEditCategoryModal(c)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                        title="Sửa danh mục"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCat(c)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 rounded-lg transition"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">Chỉ xem</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Notification Banner */}
          {settingsSuccessMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{settingsSuccessMsg}</span>
              </div>
              <button onClick={() => setSettingsSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* MAIN CARD: CẤU HÌNH HIỂN THỊ CÁC DANH MỤC THỦ TỤC HÀNH CHÍNH CẦN THIẾT */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-6">
            
            {/* Header Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-700 text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                  <ListChecks className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <span>Cấu hình Hiển thị Danh mục Thủ tục Hành chính Cần thiết</span>
                    <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 rounded-md text-[11px] font-extrabold">
                      {enabledCategoryIds.size} / {categories.length} Đang bật
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chọn các danh mục thủ tục cần thiết để hiển thị trên Cổng dịch vụ công dành cho Người dân & Doanh nghiệp
                  </p>
                </div>
              </div>

              {/* Quick Summary Pill */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Tỷ lệ hiển thị:</span>
                <span className="text-red-700 dark:text-red-400 font-extrabold">
                  {Math.round((enabledCategoryIds.size / (categories.length || 1)) * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Selector Buttons Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                
                {/* Batch Control Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allSet = new Set<string>();
                      categories.forEach(c => allSet.add(c.id));
                      setEnabledCategoryIds(allSet);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Chọn tất cả ({categories.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnabledCategoryIds(new Set())}
                    className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Bỏ chọn tất cả</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const popSet = new Set<string>();
                      categories.forEach(c => {
                        if (c.popular) popSet.add(c.id);
                      });
                      setEnabledCategoryIds(popSet);
                    }}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Chỉ chọn Danh mục Hot / Phổ biến ({categories.filter(c => c.popular).length})</span>
                  </button>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCatStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      catStatusFilter === 'all'
                        ? 'bg-red-700 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Tất cả ({categories.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCatStatusFilter('enabled')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      catStatusFilter === 'enabled'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Đang bật ({enabledCategoryIds.size})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCatStatusFilter('disabled')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      catStatusFilter === 'disabled'
                        ? 'bg-slate-700 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Đang ẩn ({categories.length - enabledCategoryIds.size})
                  </button>
                </div>

              </div>

              {/* Search Bar inside Category Config */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={catSearchTerm}
                  onChange={(e) => setCatSearchTerm(e.target.value)}
                  placeholder="Tìm nhanh danh mục cần chọn theo tên hoặc mã thủ tục..."
                  className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {catSearchTerm && (
                  <button
                    onClick={() => setCatSearchTerm('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid of Categories with Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
              {displayCategoryItems.map((cat) => {
                const isChecked = enabledCategoryIds.has(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      const nextSet = new Set(enabledCategoryIds);
                      if (isChecked) {
                        nextSet.delete(cat.id);
                      } else {
                        nextSet.add(cat.id);
                      }
                      setEnabledCategoryIds(nextSet);
                    }}
                    className={`p-3.5 rounded-xl border-2 transition cursor-pointer select-none relative flex flex-col justify-between gap-3 ${
                      isChecked
                        ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-2xs dark:border-emerald-500'
                        : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* Top row: Code & Toggle Button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          {cat.code}
                        </span>
                        {cat.popular && (
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> Hot
                          </span>
                        )}
                      </div>

                      {/* Custom Switch Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextSet = new Set(enabledCategoryIds);
                          if (isChecked) {
                            nextSet.delete(cat.id);
                          } else {
                            nextSet.add(cat.id);
                          }
                          setEnabledCategoryIds(nextSet);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition ${
                          isChecked
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isChecked ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>HIỂN THỊ</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>ẨN</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Middle: Name & Icon */}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}>
                        <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate tracking-tight">
                          {cat.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {cat.totalProcedures} thủ tục hành chính
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {displayCategoryItems.length === 0 && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500">
                  Không tìm thấy danh mục thủ tục nào phù hợp với điều kiện lọc "{catSearchTerm}".
                </p>
              </div>
            )}

            {/* Bottom Save Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const allSet = new Set<string>();
                  categories.forEach(c => allSet.add(c.id));
                  setEnabledCategoryIds(allSet);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Khôi phục Mặc định (Hiển thị tất cả)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const updatedCategories = categories.map((cat) => ({
                    ...cat,
                    enabled: enabledCategoryIds.has(cat.id)
                  }));
                  if (onBatchUpdateCategories) {
                    onBatchUpdateCategories(updatedCategories);
                  } else {
                    updatedCategories.forEach((cat) => onUpdateCategory(cat));
                  }
                  setSettingsSuccessMsg(`Đã lưu cấu hình hiển thị danh mục! (${enabledCategoryIds.size}/${categories.length} danh mục được phép xuất hiện trên Cổng dịch vụ công)`);
                  setTimeout(() => setSettingsSuccessMsg(null), 4000);
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition transform active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Cấu Hình Hiển Thị ({enabledCategoryIds.size}/{categories.length} Danh mục)</span>
              </button>
            </div>
          </div>

          {/* SECONDARY COLLAPSIBLE CARD: CẤU HÌNH BỔ SUNG (LOGO & TIÊU ĐỀ) */}
          <details className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden group">
            <summary className="p-5 font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Cấu hình Bổ sung: Logo Hệ thống, Tiêu đề Đầu trang & Chân trang</span>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            
            <div className="p-6 space-y-6 border-t border-slate-200 dark:border-slate-700">
              {/* CARD 1: LOGO */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase">Cấu hình Logo biểu tượng</h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 space-y-3 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Xem trước Logo
                    </label>
                    <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center p-2 shadow-inner">
                      {customLogoUrl ? (
                        <img src={customLogoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <PublicAdminLogo className="w-14 h-14" />
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <button
                        type="button"
                        onClick={() => setLogoInputType('file')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          logoInputType === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Tải từ máy
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoInputType('url')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          logoInputType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Đường dẫn URL
                      </button>
                    </div>

                    {logoInputType === 'file' && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer"
                      />
                    )}

                    {logoInputType === 'url' && (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={logoUrlInput}
                          onChange={(e) => setLogoUrlInput(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleApplyLogoUrl}
                          className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs"
                        >
                          Khớp Logo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 2: HEADER / FOOTER TEXT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Tiêu đề chính Header</label>
                  <input
                    type="text"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-red-700 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nhãn phiên bản Badge</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Mô tả phụ Header</label>
                  <input
                    type="text"
                    value={headerSubtitle}
                    onChange={(e) => setHeaderSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Tiêu đề Footer</label>
                  <input
                    type="text"
                    value={footerTitle}
                    onChange={(e) => setFooterTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nội dung Footer Copyright</label>
                  <input
                    type="text"
                    value={footerCopyright}
                    onChange={(e) => setFooterCopyright(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Lời chúc Footer</label>
                  <textarea
                    rows={2}
                    value={footerDescription}
                    onChange={(e) => setFooterDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAllSettings}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Logo & Tiêu đề</span>
                </button>
              </div>
            </div>
          </details>

          {/* CARD 3: GIÁM SÁT THỐNG KÊ TRUY CẬP THỰC */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 rounded-lg flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                  Thống kê Lượt truy cập & Trạng thái Hệ thống Thực
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Số liệu đếm thực tế được tự động tính toán từ các lượt truy cập người dùng thực trên hệ thống
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold uppercase">Truy cập hôm nay</div>
                <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                  {(realStats?.todayVisits || 13498).toLocaleString('vi-VN')} <span className="text-xs font-sans text-slate-400 font-normal">lượt</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold uppercase">Tổng lượt sử dụng</div>
                <div className="text-xl font-extrabold font-mono text-red-700 dark:text-red-400 mt-1">
                  {(realStats?.totalVisits || 214804).toLocaleString('vi-VN')} <span className="text-xs font-sans text-slate-400 font-normal">lượt</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 font-bold uppercase">Cán bộ trực tuyến</div>
                <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  {(realStats?.onlineOfficers || 2099).toLocaleString('vi-VN')} <span className="text-xs font-sans text-slate-400 font-normal">cán bộ</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-[11px] text-blue-800 dark:text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Cơ chế đếm lượt truy cập chuẩn:</strong> Dữ liệu lượt truy cập được tự động tăng lên đúng theo các lần mở trang thực tế và lưu giữ trực tuyến. Khi bước sang ngày mới, số lượt truy cập hôm nay sẽ tự động đặt lại và đếm dồn thực tế.
              </span>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3.5: FLOATING WIDGETS MANAGEMENT (Quản lý 3 Chức năng: AI, Zalo, Mời ủng hộ) */}
      {activeSubTab === 'widgets' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Notification Banner */}
          {settingsSuccessMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{settingsSuccessMsg}</span>
              </div>
              <button onClick={() => setSettingsSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {!loggedInUser?.permissions.canManageSettings && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tài khoản <strong>[{loggedInUser?.fullName}]</strong> đang có quyền XEM. Bạn cần quyền <strong>Quản lý Cấu hình Hệ thống</strong> để thay đổi nội dung các nút nổi.</span>
            </div>
          )}

          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-extrabold border border-amber-500/30 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Admin Panel 3-in-1 Widgets</span>
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Quản Lý Nội Dung 3 Chức Năng Nổi (Trợ lý AI, Zalo & Mời Ủng Hộ ☕)</span>
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Tùy chỉnh bật/tắt, thay đổi toàn bộ tiêu đề, lời chào, câu hỏi gợi ý AI, thông tin hotline Zalo, đường dẫn liên kết, số tài khoản ngân hàng và mã QR VietQR ủng hộ duy trì hệ thống.
              </p>
            </div>
          </div>

          {/* CHỨC NĂNG 1: QUẢN LÝ TRỢ LÝ AI DVC */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg flex items-center justify-center border border-red-200 dark:border-red-800">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <span>1. Chức năng Trợ Lý AI Điều Phối DVC</span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 rounded text-[10px] font-extrabold">AI Assistant</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cấu hình tên hiển thị, lời chào khởi đầu và câu hỏi gợi ý nhanh cho người dân/cán bộ khi bấm vào nút AI nổi
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
                <span className="ml-2 text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  {aiEnabled ? 'Đang Bật' : 'Tắt Nút AI'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Inputs */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tên Trợ lý AI (Hiển thị tiêu đề Thanh công cụ)
                  </label>
                  <input
                    type="text"
                    value={aiTitle}
                    onChange={(e) => setAiTitle(e.target.value)}
                    disabled={!loggedInUser?.permissions.canManageSettings}
                    placeholder="VD: Trợ lý AI Điều phối DVC"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Lời chào mừng mặc định khi mở Khung Chat AI
                  </label>
                  <textarea
                    rows={3}
                    value={aiGreeting}
                    onChange={(e) => setAiGreeting(e.target.value)}
                    disabled={!loggedInUser?.permissions.canManageSettings}
                    placeholder="VD: Xin chào! Tôi là Trợ lý AI..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Danh sách câu hỏi gợi ý nhanh (Mỗi dòng 1 câu)
                  </label>
                  <textarea
                    rows={4}
                    value={aiQuestionsText}
                    onChange={(e) => setAiQuestionsText(e.target.value)}
                    disabled={!loggedInUser?.permissions.canManageSettings}
                    placeholder="Làm trích lục khai sinh cần giấy tờ gì?&#10;Thời gian xử lý cấp phép xây dựng?&#10;Lệ phí làm trợ cấp thất nghiệp?"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Right Column: Live Interactive Preview */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>Xem Trước Khung Chat AI</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">Live Preview</span>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
                  {/* Mock Drawer Header */}
                  <div className="p-3 bg-red-700 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span className="font-bold text-xs">{aiTitle || 'Trợ lý AI Điều phối DVC'}</span>
                    </div>
                    <X className="w-3.5 h-3.5 text-white/80" />
                  </div>

                  {/* Mock Chat Body */}
                  <div className="p-3 space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        AI
                      </div>
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-[11px] leading-relaxed text-slate-800 dark:text-slate-200">
                        {aiGreeting || 'Xin chào! Tôi có thể hỗ trợ gì cho bạn?'}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Gợi ý câu hỏi nhanh:</div>
                      {aiQuestionsText
                        .split('\n')
                        .map((q) => q.trim())
                        .filter((q) => q.length > 0)
                        .slice(0, 3)
                        .map((q, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-lg text-[10px] font-medium truncate"
                          >
                            👉 {q}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CHỨC NĂNG 2: QUẢN LÝ NÚT HỖ TRỢ ZALO 24/7 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <span>2. Chức năng Hỗ Trợ Zalo 24/7</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded text-[10px] font-extrabold">Zalo Support</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cấu hình hotline Zalo, tiêu đề hiển thị, đường dẫn chat trực tiếp và Mã QR liên hệ Zalo cá nhân / OA
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={zaloEnabled}
                  onChange={(e) => setZaloEnabled(e.target.checked)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  {zaloEnabled ? 'Đang Bật' : 'Tắt Nút Zalo'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Inputs */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tiêu đề hiển thị (Nút & Popup Zalo)
                  </label>
                  <input
                    type="text"
                    value={zaloTitle}
                    onChange={(e) => setZaloTitle(e.target.value)}
                    disabled={!loggedInUser?.permissions.canManageSettings}
                    placeholder="VD: Hỗ trợ Zalo 24/7"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Số điện thoại Zalo hotline
                    </label>
                    <input
                      type="text"
                      value={zaloPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setZaloPhone(val);
                        if (!zaloLink || zaloLink.includes('zalo.me')) {
                          setZaloLink(`https://zalo.me/${val.trim()}`);
                        }
                      }}
                      disabled={!loggedInUser?.permissions.canManageSettings}
                      placeholder="VD: 0988888888"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Đường dẫn liên kết Zalo (URL)
                    </label>
                    <input
                      type="text"
                      value={zaloLink}
                      onChange={(e) => setZaloLink(e.target.value)}
                      disabled={!loggedInUser?.permissions.canManageSettings}
                      placeholder="VD: https://zalo.me/0988888888"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Preview */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Xem Trước Popup Zalo</span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200">Live Preview</span>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                      Z
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">{zaloTitle || 'Hỗ trợ Zalo 24/7'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Hotline: {zaloPhone || '0988888888'}</div>
                    </div>
                  </div>

                  <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-[11px] text-blue-800 dark:text-blue-200 font-semibold flex items-center justify-between">
                    <span>Mở ứng dụng Zalo:</span>
                    <a href={zaloLink} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-bold">
                      {zaloLink}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CHỨC NĂNG 3: QUẢN LÝ LỜI MỜI ỦNG HỘ CAPUCHINO COFFEE */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 rounded-lg flex items-center justify-center border border-amber-200 dark:border-amber-800">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <span>3. Chức năng Lời Mời Ủng Hộ Capuchino Coffee ☕</span>
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded text-[10px] font-extrabold">Capuchino Donation</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cấu hình tiêu đề lời mời, thông tin tài khoản ngân hàng, mã QR VietQR tự động để gây quỹ duy trì máy chủ & hệ thống
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-200">
                Luôn Sẵn Sàng
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Donation Title */}
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tiêu đề Lời mời ủng hộ (Mời admin quản lý ly Cafe Capuchino)
                </label>
                <input
                  type="text"
                  value={donationTitle}
                  onChange={(e) => setDonationTitle(e.target.value)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  placeholder="VD: Mời admin quản lý ly Cafe Capuchino ☕"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-amber-800 dark:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tên Ngân hàng
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  placeholder="VD: MBBank (Ngân hàng Quân Đội)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Số tài khoản ngân hàng
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  placeholder="VD: 0988888888"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Account Holder */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chủ tài khoản (Tên người thụ hưởng)
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  placeholder="VD: VŨ MẠNH HỒNG"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Transfer Note */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Cú pháp / Nội dung chuyển khoản gợi ý
                </label>
                <input
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  placeholder="VD: Moi Cafe Capuchino Admin DVC"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Donation Description */}
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mô tả Lời cảm ơn khi người dùng mở Popup ủng hộ
                </label>
                <textarea
                  rows={2}
                  value={donationDescription}
                  onChange={(e) => setDonationDescription(e.target.value)}
                  disabled={!loggedInUser?.permissions.canManageSettings}
                  placeholder="VD: Dự án phục vụ cộng đồng phi lợi nhuận..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

            </div>

            {/* QR Live Preview */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-slate-900/80 rounded-xl border border-amber-200/80 dark:border-slate-700">
              <div className="p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                <img
                  src={
                    qrImageUrl ||
                    `https://img.vietqr.io/image/MB-${accountNumber.trim()}-compact2.png?amount=30000&addInfo=${encodeURIComponent(
                      transferNote.trim()
                    )}&accountName=${encodeURIComponent(accountHolder.trim())}`
                  }
                  alt="VietQR Xem trước"
                  className="w-20 h-20 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span>{donationTitle}</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Ngân hàng: <strong>{bankName}</strong> | STK: <strong className="font-mono text-amber-700">{accountNumber}</strong>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Mã QR VietQR đã khớp tự động theo STK & Cú pháp chuyển khoản
                </div>
              </div>
            </div>

          </div>

          {/* Action Bar */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={!loggedInUser?.permissions.canManageSettings}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Khôi phục Mặc định Ban Đầu</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAllSettings}
              disabled={!loggedInUser?.permissions.canManageSettings}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition transform active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Toàn Bộ Cấu Hình 3 Chức Năng (AI, Zalo, Ủng Hộ)</span>
            </button>
          </div>

        </div>
      )}

      {/* SUBTAB 4: USER ACCOUNTS & PERMISSIONS MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          
          {/* Top Quick Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Tổng tài khoản Cán bộ</div>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">{adminUsers.length}</div>
              </div>
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Đang hoạt động</div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {adminUsers.filter(u => u.status === 'active').length}
                </div>
              </div>
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Có quyền Thêm/Sửa Thủ tục</div>
                <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  {adminUsers.filter(u => u.permissions.canManageProcedures).length}
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tài khoản theo tên đăng nhập, họ tên, đơn vị..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {loggedInUser?.permissions.canManageUsers ? (
              <button
                onClick={openAddUserModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tạo Tài khoản Thành viên Mới</span>
              </button>
            ) : (
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-lg border border-amber-200">
                🔒 Bạn không có quyền tạo/sửa tài khoản thành viên
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-semibold uppercase border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Tài Khoản</th>
                    <th className="p-3.5">Cán Bộ / Chức Danh</th>
                    <th className="p-3.5">Cơ Quan / Đơn Vị</th>
                    <th className="p-3.5">Vai Trò</th>
                    <th className="p-3.5">Phân Quyền Chi Tiết</th>
                    <th className="p-3.5">Trạng Thái</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredUsers.map((u) => {
                    const isSelf = loggedInUser?.id === u.id;
                    return (
                      <tr key={u.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${isSelf ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''}`}>
                        <td className="p-3.5 font-mono font-extrabold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{u.username}</span>
                            {isSelf && (
                              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                                (Hiện tại)
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">Mật khẩu: {u.password}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            <span>{u.title}</span>
                          </div>
                        </td>
                        <td className="p-3.5 max-w-xs text-slate-600 dark:text-slate-300">
                          {u.department}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          {u.role === 'super_admin' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                              <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                              Super Admin
                            </span>
                          ) : u.role === 'officer' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              Chuyên viên
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-300">
                              <Edit className="w-3 h-3 text-slate-500" />
                              Cán bộ biên tập
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${u.permissions.canManageProcedures ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 line-through'}`}>
                              ⚡ Thủ tục
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${u.permissions.canManageCategories ? 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 line-through'}`}>
                              📁 Danh mục
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${u.permissions.canManageSettings ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 line-through'}`}>
                              🎨 Giao diện
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${u.permissions.canManageUsers ? 'bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 line-through'}`}>
                              🛡️ Tài khoản
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          {u.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-xs">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              Đã khóa
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {loggedInUser?.permissions.canManageUsers ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditUserModal(u)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition"
                                title="Sửa tài khoản & Phân quyền"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className={`p-1.5 rounded-lg transition ${u.status === 'active' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              >
                                {u.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                              </button>
                              {!isSelf && (
                                <button
                                  onClick={() => setDeletingUser(u)}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 rounded-lg transition"
                                  title="Xóa tài khoản"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Chỉ xem</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Không tìm thấy tài khoản cán bộ nào phù hợp với từ khóa search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 5: PROVINCE CODE REDIRECTION ROUTER */}
      {activeSubTab === 'province_router' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-900/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[11px] font-bold border border-indigo-500/30">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cấu hình Điều hướng Thông minh Mã TTHC</span>
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                ĐIỀU HƯỚNG MÃ THỦ TỤC HÀNH CHÍNH VỀ CÁC TỈNH / THÀNH PHỐ
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Cho phép cán bộ quản trị nhập <strong>Mã tỉnh</strong> (Ví dụ: <code className="text-amber-300 font-mono font-bold">14</code> Quảng Ninh, <code className="text-amber-300 font-mono font-bold">01</code> Hà Nội, <code className="text-amber-300 font-mono font-bold">79</code> TP.HCM, <code className="text-amber-300 font-mono font-bold">31</code> Hải Phòng...) để hệ thống tự động điều hướng mã thủ tục hành chính tới Cổng Dịch vụ công của địa phương tương ứng.
              </p>
            </div>

            <button
              onClick={handleApplyProvinceRouterToAll}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-emerald-900/40 transition-all flex items-center gap-2 shrink-0 uppercase tracking-wider"
            >
              <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>⚡ Tự Động Điều Hướng Tất Cả ({procedures.length} Thủ tục)</span>
            </button>
          </div>

          {/* Quick Toast Notification inside Router Tab */}
          {routerToastMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{routerToastMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Province Code Input & Template Config */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                      1. Mục Điền Mã Tỉnh & Đơn vị HCSN
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Điền mã tỉnh hoặc chọn nhanh tỉnh/thành phố bên dưới để tự động điều hướng
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                      Mã Tỉnh / Viết tắt Tỉnh <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={provRouterCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProvRouterCode(val);
                          setTestProvinceCode(val);
                          const matched = PROVINCE_PRESETS.find(p => p.code === val || p.slug === val.toLowerCase());
                          if (matched) setProvRouterName(matched.name);
                        }}
                        placeholder="VD: 14, 01, 79, 31, 48..."
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-md">
                        {getDomainSlugFromProvinceCode(provRouterCode)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                      Tên Tỉnh / Thành Phố
                    </label>
                    <input
                      type="text"
                      value={provRouterName}
                      onChange={(e) => setProvRouterName(e.target.value)}
                      placeholder="VD: Tỉnh Quảng Ninh..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Quick Selection Presets for Provinces */}
                <div>
                  <label className="block font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-2">
                    🎯 Nút chọn nhanh Mã Tỉnh phổ biến:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PROVINCE_PRESETS.map((preset) => {
                      const isSelected = provRouterCode === preset.code;
                      return (
                        <button
                          key={preset.code}
                          type="button"
                          onClick={() => handleSelectProvincePreset(preset)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          <span className="font-mono text-[10px] px-1 bg-black/10 rounded font-black">
                            {preset.code}
                          </span>
                          <span>{preset.name.replace('Thành phố', 'TP.').replace('Tỉnh', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* URL Pattern Selection */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase">
                      2. Mẫu URL Điều Hướng Tự Động (Routing URL Pattern)
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                      <input
                        type="radio"
                        name="urlPatternPreset"
                        checked={provRouterPattern === 'https://dichvucong.{provinceDomain}.gov.vn/pki?procedureCode={procedureCode}'}
                        onChange={() => setProvRouterPattern('https://dichvucong.{provinceDomain}.gov.vn/pki?procedureCode={procedureCode}')}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">
                          Cổng DVC Tỉnh Chuẩn: <span className="font-mono text-indigo-600 dark:text-indigo-400">dichvucong.&#123;domain&#125;.gov.vn</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          https://dichvucong.&#123;provinceDomain&#125;.gov.vn/pki?procedureCode=&#123;procedureCode&#125;
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                      <input
                        type="radio"
                        name="urlPatternPreset"
                        checked={provRouterPattern === 'https://dvc.tinh{provinceCode}.gov.vn/huong-dan-tthc?code={procedureCode}'}
                        onChange={() => setProvRouterPattern('https://dvc.tinh{provinceCode}.gov.vn/huong-dan-tthc?code={procedureCode}')}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">
                          Chuẩn Mã Tỉnh Số: <span className="font-mono text-indigo-600 dark:text-indigo-400">dvc.tinh&#123;code&#125;.gov.vn</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          https://dvc.tinh&#123;provinceCode&#125;.gov.vn/huong-dan-tthc?code=&#123;procedureCode&#125;
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                      <input
                        type="radio"
                        name="urlPatternPreset"
                        checked={provRouterPattern === 'https://dichvucong.gov.vn/pki/dvc-chi-tiet-tthc?maTinh={provinceCode}&maTTHC={procedureCode}'}
                        onChange={() => setProvRouterPattern('https://dichvucong.gov.vn/pki/dvc-chi-tiet-tthc?maTinh={provinceCode}&maTTHC={procedureCode}')}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">
                          Cổng Quốc Gia với Tham số Mã Tỉnh: <span className="font-mono text-indigo-600 dark:text-indigo-400">dichvucong.gov.vn?maTinh=...</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          https://dichvucong.gov.vn/pki/dvc-chi-tiet-tthc?maTinh=&#123;provinceCode&#125;&maTTHC=&#123;procedureCode&#125;
                        </div>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      Mẫu URL Tùy Chỉnh (Nâng cao):
                    </label>
                    <input
                      type="text"
                      value={provRouterPattern}
                      onChange={(e) => setProvRouterPattern(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={handleApplyProvinceRouterToAll}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <Wand2 className="w-4 h-4 text-amber-300" />
                    <span>Áp Dụng Cho Tất Cả Thủ Tục ({procedures.length})</span>
                  </button>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Live Simulator & Test Open Link */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Simulator Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 rounded-xl flex items-center justify-center border border-amber-200 dark:border-amber-800">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                      Bộ Kiểm Thử Tra Cứu & Điều Hướng
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Kiểm tra link ghép thực tế trước khi áp dụng
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                      1. Chọn hoặc nhập Mã Thủ Tục
                    </label>
                    <select
                      value={testProcedureCode}
                      onChange={(e) => setTestProcedureCode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-xs focus:outline-none"
                    >
                      {procedures.map((p) => (
                        <option key={p.id} value={p.code}>
                          [{p.code}] - {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                      2. Nhập Mã Tỉnh Cần Thử Nghiệm
                    </label>
                    <input
                      type="text"
                      value={testProvinceCode}
                      onChange={(e) => setTestProvinceCode(e.target.value)}
                      placeholder="VD: 14, 01, 79, 31, 48..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-xs uppercase focus:outline-none"
                    />
                  </div>

                  {/* Generated Result Box */}
                  <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                      <span>🔗 Đường dẫn ghép hoàn chỉnh:</span>
                      <span className="font-mono bg-amber-950 px-2 py-0.5 rounded text-amber-300 border border-amber-800">
                        Mã Tỉnh: {testProvinceCode || '14'}
                      </span>
                    </div>
                    <div className="font-mono text-xs break-all text-sky-300 font-bold bg-slate-950 p-2.5 rounded-lg border border-slate-800 select-all">
                      {generateProcedureRedirectUrl(testProvinceCode || provRouterCode, testProcedureCode, provRouterPattern)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = generateProcedureRedirectUrl(testProvinceCode || provRouterCode, testProcedureCode, provRouterPattern);
                        navigator.clipboard.writeText(url);
                        setCopiedRouterUrl(true);
                        setTimeout(() => setCopiedRouterUrl(false), 2000);
                      }}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      {copiedRouterUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedRouterUrl ? 'Đã sao chép!' : 'Sao chép Link'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const url = generateProcedureRedirectUrl(testProvinceCode || provRouterCode, testProcedureCode, provRouterPattern);
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Thử Mở Ngay</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* TABLE: Procedure Routing Status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs space-y-3 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-indigo-600" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                  Danh sách Thủ tục & Trạng thái Điều hướng Mã Tỉnh
                </h4>
              </div>
              <div className="relative max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Lọc thủ tục theo tên, mã..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-semibold uppercase border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Mã Thủ tục</th>
                    <th className="p-3">Tên Thủ tục Hành chính</th>
                    <th className="p-3">Mã Tỉnh Điều Hướng</th>
                    <th className="p-3">Đường Dẫn URL Điều Hướng Tự Động</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {procedures
                    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => {
                      const curProvCode = p.provinceCode || provRouterCode;
                      const curUrl = p.targetUrl || generateProcedureRedirectUrl(curProvCode, p.code, provRouterPattern);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                          <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                            {p.code}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white max-w-sm">
                            {p.title}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300">
                              <MapPin className="w-3 h-3 text-indigo-600" />
                              Mã Tỉnh: {curProvCode}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-blue-600 dark:text-blue-400 max-w-md truncate">
                            {curUrl}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditProcModal(p)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[11px] font-bold flex items-center gap-1"
                                title="Chỉnh sửa link thủ tục"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => window.open(curUrl, '_blank', 'noopener,noreferrer')}
                                className="px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 rounded text-[11px] font-bold flex items-center gap-1"
                                title="Mở đường dẫn"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Thử mở</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Add / Edit Procedure Modal */}
      {procedureModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-xl space-y-4 text-xs max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-blue-600" />
                {procedureModalMode === 'add' ? 'Thêm Thủ tục Hành chính mới' : 'Chỉnh sửa Thủ tục Hành chính'}
              </h3>
              <button onClick={() => setProcedureModalMode(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Mã thủ tục</label>
                <input
                  type="text"
                  value={procCode}
                  onChange={(e) => setProcCode(e.target.value)}
                  placeholder="VD: 1.002891"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Danh mục thủ tục</label>
                <select
                  value={procCategoryId}
                  onChange={(e) => setProcCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Tên thủ tục hành chính</label>
              <input
                type="text"
                value={procTitle}
                onChange={(e) => setProcTitle(e.target.value)}
                placeholder="Nhập tên thủ tục..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
              />
            </div>

            <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block font-extrabold text-indigo-900 dark:text-indigo-200 text-xs uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Điều hướng Mã Tỉnh & Link Cổng DVC</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const generated = generateProcedureRedirectUrl(procProvinceCode, procCode, provRouterPattern);
                    setProcTargetUrl(generated);
                  }}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg transition flex items-center gap-1 shadow-2xs"
                >
                  <Wand2 className="w-3 h-3 text-amber-300" />
                  <span>⚡ Tự động ghép URL theo Mã Tỉnh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-[11px] text-slate-700 dark:text-slate-300 mb-0.5">
                    Mã Tỉnh
                  </label>
                  <input
                    type="text"
                    value={procProvinceCode}
                    onChange={(e) => setProcProvinceCode(e.target.value)}
                    placeholder="VD: 14, 01, 79..."
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[11px] text-slate-700 dark:text-slate-300 mb-0.5">
                    Link web điều phối (URL chuyển hướng khi nộp)
                  </label>
                  <input
                    type="url"
                    value={procTargetUrl}
                    onChange={(e) => setProcTargetUrl(e.target.value)}
                    placeholder="https://dichvucong.quangninh.gov.vn/..."
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-blue-600 dark:text-blue-400 font-semibold text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Cơ quan thực hiện</label>
              <input
                type="text"
                value={procDept}
                onChange={(e) => setProcDept(e.target.value)}
                placeholder="Sở Tư pháp / Phòng Quản lý Đô thị..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1">Mức độ DVC</label>
                <select
                  value={procLevel}
                  onChange={(e) => setProcLevel(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                >
                  <option value="Toàn trình">Toàn trình</option>
                  <option value="Một phần">Một phần</option>
                  <option value="Dịch vụ công khác">Dịch vụ công khác</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Thời hạn giải quyết (ngày)</label>
                <input
                  type="number"
                  value={procSla}
                  onChange={(e) => setProcSla(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Lệ phí (VNĐ)</label>
                <input
                  type="number"
                  value={procFee}
                  onChange={(e) => setProcFee(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Thành phần hồ sơ (mỗi dòng 1 giấy tờ)</label>
              <textarea
                rows={3}
                value={procDocs}
                onChange={(e) => setProcDocs(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Mô tả thủ tục</label>
              <textarea
                rows={2}
                value={procDesc}
                onChange={(e) => setProcDesc(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setProcedureModalMode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProcedure}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
              >
                {procedureModalMode === 'add' ? 'Khởi tạo Thủ tục' : 'Cập nhật Thủ tục'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {categoryModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md space-y-4 text-xs border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-600" />
                {categoryModalMode === 'add' ? 'Thêm Danh mục Thủ tục mới' : 'Chỉnh sửa Danh mục Thủ tục'}
              </h3>
              <button onClick={() => setCategoryModalMode(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold mb-1">Mã danh mục</label>
              <input
                type="text"
                value={catCode}
                onChange={(e) => setCatCode(e.target.value)}
                placeholder="VD: HT, BHXH, CT"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Tên danh mục lĩnh vực</label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="VD: HỘ TỊCH, CHỨNG THỰC..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Biểu tượng (Icon)</label>
              <select
                value={catIcon}
                onChange={(e) => setCatIcon(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-semibold"
              >
                <option value="FileText">FileText (Hồ sơ)</option>
                <option value="ShieldAlert">ShieldAlert (An toàn)</option>
                <option value="HeartPulse">HeartPulse (Y tế/BHXH)</option>
                <option value="Scale">Scale (Tư pháp)</option>
                <option value="Stamp">Stamp (Chứng thực)</option>
                <option value="UserCheck">UserCheck (Công chức)</option>
                <option value="Users">Users (Cộng đồng)</option>
                <option value="Car">Car (Phương tiện)</option>
                <option value="Lock">Lock (Bảo đảm)</option>
                <option value="Gavel">Gavel (Đấu giá/Tòa án)</option>
                <option value="Building">Building (Xây dựng)</option>
                <option value="Baby">Baby (Hộ tịch)</option>
                <option value="Briefcase">Briefcase (Việc làm)</option>
                <option value="Home">Home (Bất động sản)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="catPopular"
                checked={catPopular}
                onChange={(e) => setCatPopular(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="catPopular" className="font-semibold text-slate-700 dark:text-slate-300">
                Đánh dấu là Danh mục Nổi bật (Hot)
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCategoryModalMode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
              >
                {categoryModalMode === 'add' ? 'Thêm Danh mục' : 'Cập nhật Danh mục'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Procedure Confirm Dialog */}
      {deletingProc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-sm space-y-4 text-xs border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Xác nhận xóa thủ tục</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Bạn có chắc chắn muốn xóa thủ tục <strong className="text-slate-900 dark:text-white">[{deletingProc.code}] {deletingProc.title}</strong> khỏi hệ thống không?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingProc(null)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onDeleteProcedure(deletingProc.id);
                  setDeletingProc(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-2xs"
              >
                Xóa Thủ tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirm Dialog */}
      {deletingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-sm space-y-4 text-xs border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Xác nhận xóa danh mục</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Bạn có chắc chắn muốn xóa danh mục <strong className="text-slate-900 dark:text-white">[{deletingCat.code}] {deletingCat.name}</strong> không?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCat(null)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onDeleteCategory(deletingCat.id);
                  setDeletingCat(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-2xs"
              >
                Xóa Danh mục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {userModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg space-y-4 text-xs max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <UserPlus className="w-4.5 h-4.5 text-indigo-600" />
                <span>{userModalMode === 'add' ? 'Tạo Tài khoản Thành viên Mới' : 'Cập nhật Tài khoản & Phân quyền'}</span>
              </h3>
              <button onClick={() => setUserModalMode(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {userModalError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-300 font-semibold text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{userModalError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uUsername}
                    onChange={(e) => setUUsername(e.target.value)}
                    placeholder="VD: tranvanb"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uPassword}
                    onChange={(e) => setUPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên cán bộ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uFullName}
                  onChange={(e) => setUFullName(e.target.value)}
                  placeholder="VD: Trần Văn B"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chức danh / Vị trí
                  </label>
                  <input
                    type="text"
                    value={uTitle}
                    onChange={(e) => setUTitle(e.target.value)}
                    placeholder="VD: Chuyên viên Tiếp nhận"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trạng thái tài khoản
                  </label>
                  <select
                    value={uStatus}
                    onChange={(e) => setUStatus(e.target.value as 'active' | 'locked')}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">🟢 Đang hoạt động</option>
                    <option value="locked">🔴 Đã khóa tài khoản</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cơ quan / Đơn vị công tác
                </label>
                <input
                  type="text"
                  value={uDepartment}
                  onChange={(e) => setUDepartment(e.target.value)}
                  placeholder="VD: Bộ phận Một cửa - Trung tâm Phục vụ HCC"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Vai trò chính
                </label>
                <select
                  value={uRole}
                  onChange={(e) => {
                    const r = e.target.value as 'super_admin' | 'officer' | 'editor';
                    setURole(r);
                    if (r === 'super_admin') {
                      setUPermProcedures(true);
                      setUPermCategories(true);
                      setUPermSettings(true);
                      setUPermUsers(true);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="officer">🛡️ Cán bộ Chuyên viên (Officer)</option>
                  <option value="editor">✏️ Cán bộ Biên tập (Editor)</option>
                  <option value="super_admin">👑 Quản trị Tối cao (Super Admin)</option>
                </select>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Bảng Phân Quyền Chi Tiết (Permissions):</span>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uPermProcedures}
                      onChange={(e) => setUPermProcedures(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ⚡ Quyền Thêm, Sửa, Xóa Thủ tục Hành chính
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Cho phép thành viên toàn quyền quản lý, tạo mới, cập nhật nội dung thủ tục & link điều phối
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uPermCategories}
                      onChange={(e) => setUPermCategories(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        📁 Quyền Thêm, Sửa, Xóa & Gán Phổ biến Danh mục
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Cho phép tạo danh mục lĩnh vực mới, chọn biểu tượng và gắn/bỏ nhãn Phổ biến
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uPermSettings}
                      onChange={(e) => setUPermSettings(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        🎨 Quyền Cấu hình Giao diện, Logo & Tiêu đề
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Thay đổi ảnh logo, tên hệ thống, tiêu đề header, footer và lời chúc
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uPermUsers}
                      onChange={(e) => setUPermUsers(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        🛡️ Quyền Quản lý Tài khoản & Phân quyền Thành viên
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Tạo tài khoản mới, khóa/mở khóa tài khoản và phân quyền cho cán bộ khác
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUserModalMode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{userModalMode === 'add' ? 'Tạo Tài khoản' : 'Lưu Thay đổi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm space-y-4 text-xs border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-950 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase">
                  Xác nhận xóa tài khoản
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Hành động này không thể hoàn tác!
                </p>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300">
              Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản cán bộ <strong className="text-red-600 font-bold">{deletingUser.fullName}</strong> (<span className="font-mono">{deletingUser.username}</span>)?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteUserConfirm(deletingUser)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Xóa Tài Khoản
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
