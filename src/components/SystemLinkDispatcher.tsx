import React, { useState } from 'react';
import {
  ExternalLink,
  Search,
  Check,
  Copy,
  Edit2,
  X,
  Globe,
  Building2,
  Share2,
  MessageSquare,
  CreditCard,
  Database,
  Landmark,
  ShieldAlert,
  GraduationCap,
  Atom,
  Users,
  Leaf,
  Briefcase,
  Cross,
  Baby,
  Store,
  FileText,
  BookOpen,
  HelpCircle,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';

export interface DispatcherLink {
  id: string;
  title: string;
  url: string;
  iconType: string;
  badge?: string;
  clicks?: number;
}

export interface DispatcherSection {
  id: string;
  title: string;
  links: DispatcherLink[];
}

const INITIAL_SECTIONS: DispatcherSection[] = [
  {
    id: 'sec-dvcqg',
    title: 'CỔNG DỊCH VỤ CÔNG QUỐC GIA',
    links: [
      {
        id: 'link-1',
        title: 'CỔNG DVC QUỐC GIA',
        url: 'https://dichvucong.gov.vn',
        iconType: 'building',
        badge: 'Cơ bản'
      },
      {
        id: 'link-2',
        title: 'ĐIỀU PHỐI GIẢI QUYẾT TTHC',
        url: 'https://dichvucong.gov.vn/pki',
        iconType: 'dispatch'
      },
      {
        id: 'link-3',
        title: 'PHẢN ÁNH KIẾN NGHỊ',
        url: 'https://pakn.dichvucong.gov.vn',
        iconType: 'feedback'
      },
      {
        id: 'link-4',
        title: 'QUẢN TRỊ THANH TOÁN TRỰC TUYẾN',
        url: 'https://dichvucong.gov.vn/pay',
        iconType: 'payment'
      },
      {
        id: 'link-5',
        title: 'CSDL QUỐC GIA VỀ TTHC',
        url: 'https://csdl.dichvucong.gov.vn',
        iconType: 'database'
      },
      {
        id: 'link-6',
        title: 'CỔNG DVCQG CŨ (VPCP)',
        url: 'https://old.dichvucong.gov.vn',
        iconType: 'landmark'
      },
      {
        id: 'link-7',
        title: 'DVC ĐẢNG CỘNG SẢN',
        url: 'https://dvc.dangcongsan.vn',
        iconType: 'party_star'
      }
    ]
  },
  {
    id: 'sec-taptrung',
    title: 'HỆ THỐNG THÔNG TIN GIẢI QUYẾT TTHC TẬP TRUNG',
    links: [
      {
        id: 'link-8',
        title: 'MỘT CỬA QUẢNG NINH',
        url: 'https://dichvucong.quangninh.gov.vn',
        iconType: 'link_chain',
        badge: 'Trọng điểm'
      },
      {
        id: 'link-9',
        title: 'BỘ CÔNG THƯƠNG',
        url: 'https://dichvucong.moit.gov.vn',
        iconType: 'factory'
      },
      {
        id: 'link-10',
        title: 'BỘ DÂN TỘC VÀ TÔN GIÁO',
        url: 'https://dichvucong.cema.gov.vn',
        iconType: 'ethnic'
      },
      {
        id: 'link-11',
        title: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO',
        url: 'https://dichvucong.moet.gov.vn',
        iconType: 'education'
      },
      {
        id: 'link-12',
        title: 'BỘ KHOA HỌC VÀ CÔNG NGHỆ',
        url: 'https://dichvucong.most.gov.vn',
        iconType: 'science'
      },
      {
        id: 'link-13',
        title: 'BỘ NGOẠI GIAO',
        url: 'https://dichvucong.mofa.gov.vn',
        iconType: 'diplomacy'
      },
      {
        id: 'link-14',
        title: 'BỘ NỘI VỤ',
        url: 'https://dichvucong.moha.gov.vn',
        iconType: 'users'
      },
      {
        id: 'link-15',
        title: 'BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG',
        url: 'https://dichvucong.mard.gov.vn',
        iconType: 'agriculture'
      },
      {
        id: 'link-16',
        title: 'BỘ QUỐC PHÒNG',
        url: 'https://dichvucong.mod.gov.vn',
        iconType: 'defense'
      },
      {
        id: 'link-17',
        title: 'BỘ TÀI CHÍNH',
        url: 'https://dichvucong.mof.gov.vn',
        iconType: 'finance'
      },
      {
        id: 'link-18',
        title: 'BỘ TƯ PHÁP',
        url: 'https://dichvucong.moj.gov.vn',
        iconType: 'justice'
      },
      {
        id: 'link-19',
        title: 'BỘ VĂN HOÁ THỂ THAO VÀ DU LỊCH',
        url: 'https://dichvucong.bvhttdl.gov.vn',
        iconType: 'culture'
      },
      {
        id: 'link-20',
        title: 'BỘ XÂY DỰNG',
        url: 'https://dichvucong.moc.gov.vn',
        iconType: 'construction'
      },
      {
        id: 'link-21',
        title: 'BỘ Y TẾ',
        url: 'https://dichvucong.moh.gov.vn',
        iconType: 'health'
      },
      {
        id: 'link-22',
        title: 'TTHC CỦA ĐẢNG',
        url: 'https://tthc.dangcongsan.vn',
        iconType: 'party_star'
      }
    ]
  },
  {
    id: 'sec-chuyennganh',
    title: 'PHẦN MỀM CHUYÊN NGÀNH',
    links: [
      {
        id: 'link-23',
        title: 'LIÊN THÔNG KHAI SINH - KHAI TỬ',
        url: 'https://lienthong.dichvucong.gov.vn',
        iconType: 'baby'
      },
      {
        id: 'link-24',
        title: 'ĐĂNG KÝ HỘ KINH DOANH',
        url: 'https://hokinhdoanh.dkkd.gov.vn',
        iconType: 'store'
      },
      {
        id: 'link-25',
        title: 'ĐĂNG KÝ DOANH NGHIỆP',
        url: 'https://dangkykinhdoanh.gov.vn',
        iconType: 'business'
      },
      {
        id: 'link-26',
        title: 'QUẢN LÝ HỘ TỊCH',
        url: 'https://hotich.moj.gov.vn',
        iconType: 'civil_status'
      },
      {
        id: 'link-27',
        title: 'NGƯỜI KHUYẾT TẬT',
        url: 'https://nguoikhuyettat.molisa.gov.vn',
        iconType: 'accessibility'
      },
      {
        id: 'link-28',
        title: 'MỤC TIÊU QUỐC GIA - VĂN HÓA',
        url: 'https://vanhoa.gov.vn',
        iconType: 'culture_target'
      }
    ]
  },
  {
    id: 'sec-nghiepvu',
    title: 'PHẦN MỀM NGHIỆP VỤ',
    links: [
      {
        id: 'link-29',
        title: 'SỔ TAY ĐẢNG VIÊN',
        url: 'https://sotaydangvien.vn',
        iconType: 'party_book'
      },
      {
        id: 'link-30',
        title: 'QUẢN LÝ VBDH CỦA ĐẢNG',
        url: 'https://vbdh.dangcongsan.vn',
        iconType: 'party_doc'
      },
      {
        id: 'link-31',
        title: 'HỖ TRỢ AKA247 BỘ TƯ PHÁP',
        url: 'https://aka247.moj.gov.vn',
        iconType: 'aka247'
      }
    ]
  }
];

// Custom Illustrated Graphic Icons rendered via SVG/Lucide to closely mimic the original portal design
const CustomLinkIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'building':
      return (
        <div className="w-11 h-11 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 shadow-2xs">
          <Building2 className="w-6 h-6" />
        </div>
      );
    case 'dispatch':
      return (
        <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-2xs">
          <Share2 className="w-6 h-6" />
        </div>
      );
    case 'feedback':
      return (
        <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-2xs">
          <MessageSquare className="w-6 h-6" />
        </div>
      );
    case 'payment':
      return (
        <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 shadow-2xs">
          <CreditCard className="w-6 h-6" />
        </div>
      );
    case 'database':
      return (
        <div className="w-11 h-11 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100 shadow-2xs">
          <Database className="w-6 h-6" />
        </div>
      );
    case 'landmark':
      return (
        <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 shadow-2xs">
          <Landmark className="w-6 h-6" />
        </div>
      );
    case 'party_star':
      return (
        <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center text-yellow-300 shadow-2xs ring-2 ring-red-100">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      );
    case 'link_chain':
      return (
        <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-200 shadow-2xs">
          <LinkIcon className="w-6 h-6" />
        </div>
      );
    case 'factory':
      return (
        <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200 shadow-2xs">
          <Store className="w-6 h-6" />
        </div>
      );
    case 'ethnic':
      return (
        <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100 shadow-2xs">
          <Users className="w-6 h-6" />
        </div>
      );
    case 'education':
      return (
        <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-2xs">
          <GraduationCap className="w-6 h-6" />
        </div>
      );
    case 'science':
      return (
        <div className="w-11 h-11 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 shadow-2xs">
          <Atom className="w-6 h-6" />
        </div>
      );
    case 'diplomacy':
      return (
        <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-2xs">
          <Globe className="w-6 h-6" />
        </div>
      );
    case 'users':
      return (
        <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 shadow-2xs">
          <Users className="w-6 h-6" />
        </div>
      );
    case 'agriculture':
      return (
        <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-2xs">
          <Leaf className="w-6 h-6" />
        </div>
      );
    case 'defense':
      return (
        <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center text-green-700 border border-green-200 shadow-2xs">
          <ShieldAlert className="w-6 h-6" />
        </div>
      );
    case 'finance':
      return (
        <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-2xs">
          <CreditCard className="w-6 h-6" />
        </div>
      );
    case 'justice':
      return (
        <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200 shadow-2xs">
          <ScaleIcon className="w-6 h-6" />
        </div>
      );
    case 'culture':
    case 'culture_target':
      return (
        <div className="w-11 h-11 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 border border-pink-100 shadow-2xs">
          <Sparkles className="w-6 h-6" />
        </div>
      );
    case 'construction':
      return (
        <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-2xs">
          <Building2 className="w-6 h-6" />
        </div>
      );
    case 'health':
      return (
        <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shadow-2xs">
          <Cross className="w-6 h-6" />
        </div>
      );
    case 'baby':
    case 'civil_status':
      return (
        <div className="w-11 h-11 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100 shadow-2xs">
          <Baby className="w-6 h-6" />
        </div>
      );
    case 'store':
      return (
        <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-2xs">
          <Store className="w-6 h-6" />
        </div>
      );
    case 'business':
      return (
        <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-2xs">
          <Briefcase className="w-6 h-6" />
        </div>
      );
    case 'accessibility':
      return (
        <div className="w-11 h-11 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100 shadow-2xs">
          <Users className="w-6 h-6" />
        </div>
      );
    case 'party_book':
      return (
        <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center text-yellow-300 shadow-2xs ring-2 ring-red-100">
          <BookOpen className="w-6 h-6" />
        </div>
      );
    case 'party_doc':
      return (
        <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xs ring-2 ring-red-100">
          <FileText className="w-6 h-6" />
        </div>
      );
    case 'aka247':
      return (
        <div className="w-11 h-11 rounded-lg bg-blue-900 flex items-center justify-center text-sky-300 font-black text-xs shadow-2xs border border-blue-700">
          AKA247
        </div>
      );
    default:
      return (
        <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
          <Globe className="w-6 h-6" />
        </div>
      );
  }
};

const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-4 9 4M12 2v20M5 10l-2 8h6l-2-8zm10 0l-2 8h6l-2-8z" />
  </svg>
);

export const SystemLinkDispatcher: React.FC = () => {
  const [sections, setSections] = useState<DispatcherSection[]>(INITIAL_SECTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<{ secId: string; link: DispatcherLink } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Handle Redirection
  const handleOpenLink = (link: DispatcherLink) => {
    // Increment click count locally
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        links: sec.links.map((l) =>
          l.id === link.id ? { ...l, clicks: (l.clicks || 0) + 1 } : l
        )
      }))
    );

    // Show toast
    setToastMessage(`Đang chuyển hướng tới: ${link.title}`);
    setTimeout(() => setToastMessage(null), 3500);

    // Open target website
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e: React.MouseEvent, link: DispatcherLink) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditSave = () => {
    if (!editingLink) return;
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === editingLink.secId
          ? {
              ...sec,
              links: sec.links.map((l) =>
                l.id === editingLink.link.id ? editingLink.link : l
              )
            }
          : sec
      )
    );
    setEditingLink(null);
    setToastMessage('Đã cập nhật cấu hình điều phối URL!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter sections by search query
  const filteredSections = sections
    .map((sec) => ({
      ...sec,
      links: sec.links.filter(
        (l) =>
          l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sec.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter((sec) => sec.links.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce border border-slate-700">
          <ExternalLink className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Search & Stats Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm cổng dịch vụ công, phần mềm chuyên ngành..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium shrink-0">
          <span className="bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 font-bold">
            🔗 Tổng số liên kết: {sections.reduce((acc, s) => acc + s.links.length, 0)}
          </span>
          <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Chuyển hướng trực tiếp
          </span>
        </div>
      </div>

      {/* Section List matching exact design from screenshot */}
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-3.5">
            
            {/* Section Header with Left Orange-Red Accent Bar */}
            <div className="flex items-center gap-2.5 pb-1 border-b border-slate-200/80 dark:border-slate-700">
              <div className="w-1.5 h-5 bg-gradient-to-b from-amber-500 to-red-700 rounded-full" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 uppercase tracking-tight flex items-center gap-2">
                <span>{section.title}</span>
                <span className="text-xs font-normal text-slate-400 lowercase">
                  ({section.links.length})
                </span>
              </h3>
            </div>

            {/* Grid of Link Tile Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {section.links.map((link) => (
                <div
                  key={link.id}
                  onClick={() => handleOpenLink(link)}
                  className="group relative bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/90 dark:border-slate-700/80 hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-between min-h-[125px] select-none"
                >
                  {/* Badge if present */}
                  {link.badge && (
                    <span className="absolute top-2 left-2 text-[9px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-extrabold px-1.5 py-0.2 rounded border border-red-200">
                      {link.badge}
                    </span>
                  )}

                  {/* Top Action Buttons (Edit / Copy) */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 z-10">
                    <button
                      onClick={(e) => handleCopyLink(e, link)}
                      className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded shadow-2xs"
                      title="Sao chép đường dẫn"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLink({ secId: section.id, link: { ...link } });
                      }}
                      className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded shadow-2xs"
                      title="Chỉnh sửa liên kết"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Tile Icon Graphic */}
                  <div className="mt-1 transform group-hover:scale-105 transition-transform duration-200">
                    <CustomLinkIcon type={link.iconType} />
                  </div>

                  {/* Title Label */}
                  <div className="mt-2 text-[11px] font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    {link.title}
                  </div>

                  {/* Hover Sub-label */}
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-red-700 dark:text-red-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Mở trang</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
              Không tìm thấy liên kết nào khớp với "{searchTerm}"
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Thử từ khóa khác như "quốc gia", "tư pháp", "bộ" hoặc "mạng".
            </p>
          </div>
        )}
      </div>

      {/* Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md space-y-4 text-xs border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Cấu hình Đường dẫn Điều phối
              </h3>
              <button onClick={() => setEditingLink(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold mb-1">Tên hiển thị hệ thống</label>
              <input
                type="text"
                value={editingLink.link.title}
                onChange={(e) =>
                  setEditingLink({
                    ...editingLink,
                    link: { ...editingLink.link, title: e.target.value }
                  })
                }
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Đường dẫn trang web (URL)</label>
              <input
                type="url"
                value={editingLink.link.url}
                onChange={(e) =>
                  setEditingLink({
                    ...editingLink,
                    link: { ...editingLink.link, url: e.target.value }
                  })
                }
                placeholder="https://..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-blue-600 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Huy hiệu (Nếu có)</label>
              <input
                type="text"
                value={editingLink.link.badge || ''}
                onChange={(e) =>
                  setEditingLink({
                    ...editingLink,
                    link: { ...editingLink.link, badge: e.target.value }
                  })
                }
                placeholder="VD: Trọng điểm, Mới, Cơ bản..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setEditingLink(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
