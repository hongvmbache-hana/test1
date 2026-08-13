import React, { useState } from 'react';
import {
  ChevronRight,
  Flame,
  Settings2,
  SlidersHorizontal,
  CheckSquare,
  Square,
  RotateCcw,
  Search,
  X,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  FileText,
  Building2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { ProcedureCategory, ProcedureItem } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface ServiceGridProps {
  categories: ProcedureCategory[]; // Active displayed categories (after search & filter & user custom)
  allAdminCategories: ProcedureCategory[]; // Full list of admin-enabled categories available to citizens
  userCustomCategoryIds: Set<string> | null; // Null means default (show all admin-enabled categories)
  onSaveUserCustomCategories: (ids: Set<string> | null) => void;
  onSelectCategory: (cat: ProcedureCategory) => void;
  searchQuery: string;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  isCustomizerOpen?: boolean;
  setIsCustomizerOpen?: (open: boolean) => void;
  procedures?: ProcedureItem[];
  matchingProcedures?: ProcedureItem[];
  onSelectProcedure?: (proc: ProcedureItem, category?: ProcedureCategory) => void;
  onClearSearch?: () => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  categories,
  allAdminCategories,
  userCustomCategoryIds,
  onSaveUserCustomCategories,
  onSelectCategory,
  searchQuery,
  selectedFilter,
  onSelectFilter,
  isCustomizerOpen: externalCustomizerOpen,
  setIsCustomizerOpen: setExternalCustomizerOpen,
  procedures = [],
  matchingProcedures = [],
  onSelectProcedure,
  onClearSearch
}) => {
  const [internalCustomizerOpen, setInternalCustomizerOpen] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<Set<string>>(new Set());
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  const isCustomizerOpen = externalCustomizerOpen || internalCustomizerOpen;

  const handleOpenTargetUrl = (url?: string) => {
    const target = url || 'https://dichvucong.gov.vn';
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  // Sync state when customizer opens
  const openCustomizerModal = () => {
    if (userCustomCategoryIds === null) {
      const initial = new Set(allAdminCategories.map((c) => c.id));
      setTempSelectedIds(initial);
    } else {
      setTempSelectedIds(new Set(userCustomCategoryIds));
    }
    setModalSearchTerm('');
    setInternalCustomizerOpen(true);
    if (setExternalCustomizerOpen) setExternalCustomizerOpen(true);
  };

  const closeCustomizerModal = () => {
    setInternalCustomizerOpen(false);
    if (setExternalCustomizerOpen) setExternalCustomizerOpen(false);
  };

  // Sync if opened externally
  React.useEffect(() => {
    if (externalCustomizerOpen) {
      if (userCustomCategoryIds === null) {
        const initial = new Set(allAdminCategories.map((c) => c.id));
        setTempSelectedIds(initial);
      } else {
        setTempSelectedIds(new Set(userCustomCategoryIds));
      }
      setModalSearchTerm('');
    }
  }, [externalCustomizerOpen, userCustomCategoryIds, allAdminCategories]);

  // Open modal with current selected IDs
  const handleOpenCustomizer = () => {
    openCustomizerModal();
  };

  // Save changes from modal
  const handleApplyCustomization = () => {
    // If user selected all admin categories, reset userCustomCategoryIds to null
    if (tempSelectedIds.size === allAdminCategories.length) {
      onSaveUserCustomCategories(null);
    } else {
      onSaveUserCustomCategories(new Set(tempSelectedIds));
    }
    closeCustomizerModal();
  };

  // Reset to system default
  const handleResetToDefault = () => {
    onSaveUserCustomCategories(null);
    const initial = new Set(allAdminCategories.map((c) => c.id));
    setTempSelectedIds(initial);
  };

  // Filter categories in modal search
  const filteredModalCategories = allAdminCategories.filter((c) => {
    const q = modalSearchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  const isCustomized = userCustomCategoryIds !== null;
  const popularCount = allAdminCategories.filter((c) => c.popular).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Category Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-700 rounded-full"></span>
            DANH MỤC THỦ TỤC HÀNH CHÍNH
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chọn lĩnh vực để thực hiện nộp hồ sơ trực tuyến, tra cứu quy trình và thời gian xử lý
          </p>
        </div>

        {/* Right side controls: Total count & Customizer Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs font-bold text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/80 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-800 shrink-0">
            Tổng số: {categories.length}/{allAdminCategories.length} lĩnh vực
          </div>

          <button
            onClick={handleOpenCustomizer}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs border ${
              isCustomized
                ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'
            }`}
            title="Tùy biến chọn ẩn/hiển thị các danh mục thủ tục theo nhu cầu của bạn"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>{isCustomized ? '⚙️ Đang tùy biến danh mục' : '⚙️ Tùy biến hiển thị'}</span>
          </button>
        </div>
      </div>

      {/* Alert banner when visitor customization is active */}
      {isCustomized && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Chế độ Tùy biến Cá nhân:</strong> Bạn đang chọn hiển thị <strong>{userCustomCategoryIds.size} / {allAdminCategories.length}</strong> danh mục thủ tục ngoài trang chủ.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCustomizer}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-slate-700 font-bold rounded-lg text-[11px] border border-amber-300 dark:border-amber-700 transition"
            >
              Khôi phục mặc định
            </button>
          </div>
        </div>
      )}

      {/* DEDICATED PROCEDURE SEARCH RESULTS SECTION */}
      {searchQuery.trim() !== '' && (
        <div className="bg-gradient-to-br from-red-50/70 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border-2 border-red-200 dark:border-red-900/60 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-200/80 dark:border-red-900/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-700 text-white rounded-2xl shadow-sm">
                <Search className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 flex-wrap">
                  <span>KẾT QUẢ TÌM KIẾM THỦ TỤC HÀNH CHÍNH CỤ THỂ</span>
                  <span className="px-3 py-0.5 bg-red-700 text-amber-200 rounded-full text-xs font-bold border border-red-800">
                    {matchingProcedures.length} thủ tục phù hợp
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Từ khóa: <strong className="text-red-700 dark:text-red-400">"{searchQuery}"</strong> — tìm chính xác tên, mã số thủ tục, cơ quan xử lý & mô tả
                </p>
              </div>
            </div>

            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-slate-600 dark:text-slate-300 hover:text-red-700 font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Xóa từ khóa tìm kiếm</span>
              </button>
            )}
          </div>

          {matchingProcedures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingProcedures.map((proc) => {
                const parentCat = allAdminCategories.find((c) => c.id === proc.categoryId);
                return (
                  <div
                    key={proc.id}
                    className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-red-200 dark:border-slate-700 hover:border-red-600 dark:hover:border-red-500 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 rounded border border-red-300 dark:border-red-800">
                            Mã: {proc.code}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-800">
                            ⚡ {proc.level}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                          📁 {proc.categoryName}
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectProcedure && onSelectProcedure(proc, parentCat)}
                        className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        {proc.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {proc.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span className="truncate">{proc.department}</span>
                      </div>
                    </div>

                    <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={() => onSelectProcedure && onSelectProcedure(proc, parentCat)}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/80 dark:hover:bg-red-900 text-red-800 dark:text-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Xem chi tiết & Nộp hồ sơ</span>
                      </button>

                      <button
                        onClick={() => handleOpenTargetUrl(proc.targetUrl)}
                        className="px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
                        title="Truy cập trực tiếp đường dẫn điều phối gửi hồ sơ"
                      >
                        <span>Mở trang điều phối</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-700 text-center space-y-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Không tìm thấy danh sách thủ tục hành chính cụ thể có tên hoặc mã khớp với từ khóa "{searchQuery}"
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bạn có thể tham khảo danh sách các Lĩnh vực thủ tục bên dưới hoặc thử lại với các từ khóa ngắn như "1.002891", "khai sinh", "xây dựng", "lý lịch", "trợ cấp".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grid matching Clean Minimalism theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className="group relative flex items-center justify-between p-4 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-sm transition-all duration-200 text-left overflow-hidden border-l-4 border-l-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <div className="flex items-center gap-3 pr-2 min-w-0">
              {/* Icon Container with subtle light red tint */}
              <div className="shrink-0 w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 flex items-center justify-center border border-red-100 dark:border-red-800/50 group-hover:bg-red-700 group-hover:text-white transition-colors">
                <CategoryIcon name={cat.iconName} className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.popular && (
                    <span className="shrink-0 text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                      Hot
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {cat.totalProcedures} thủ tục trực tuyến
                </p>
              </div>
            </div>

            {/* Right Chevron Arrow */}
            <div className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors pl-1">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-slate-500 dark:text-slate-400 font-semibold">
            {searchQuery
              ? `Không tìm thấy lĩnh vực thủ tục nào phù hợp với từ khóa "${searchQuery}"`
              : 'Không có danh mục nào đang hiển thị theo tùy chọn chọn lọc hiện tại.'}
          </p>
          <div className="flex justify-center gap-2">
            {isCustomized && (
              <button
                onClick={handleResetToDefault}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs transition shadow-2xs"
              >
                Hiển thị lại toàn bộ danh mục mặc định
              </button>
            )}
          </div>
        </div>
      )}

      {/* PUBLIC CATEGORY CUSTOMIZER MODAL */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-700 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <span>Tùy biến Danh mục & DVC Thường Dùng</span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 rounded text-xs font-bold">
                      {tempSelectedIds.size} / {allAdminCategories.length} Đã chọn
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tùy chọn danh mục thủ tục bạn muốn hiển thị trên trang chủ. Cấu hình tự động lưu trên thiết bị này.
                  </p>
                </div>
              </div>
              <button
                onClick={closeCustomizerModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions & Search Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allSet = new Set(allAdminCategories.map((c) => c.id));
                      setTempSelectedIds(allSet);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Chọn tất cả ({allAdminCategories.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempSelectedIds(new Set())}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Bỏ chọn tất cả</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const popSet = new Set<string>();
                      allAdminCategories.forEach((c) => {
                        if (c.popular) popSet.add(c.id);
                      });
                      setTempSelectedIds(popSet);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Chỉ DVC Thường dùng ({popularCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Mặc định ban đầu</span>
                  </button>
                </div>
              </div>

              {/* Search input inside modal */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm danh mục theo tên hoặc mã thủ tục..."
                  className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {modalSearchTerm && (
                  <button
                    onClick={() => setModalSearchTerm('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* List / Grid of Categories */}
            <div className="p-4 overflow-y-auto max-h-[420px] custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredModalCategories.map((cat) => {
                const isSelected = tempSelectedIds.has(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      const next = new Set(tempSelectedIds);
                      if (isSelected) next.delete(cat.id);
                      else next.add(cat.id);
                      setTempSelectedIds(next);
                    }}
                    className={`p-3.5 rounded-xl border-2 transition cursor-pointer select-none flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 border-slate-300 dark:border-slate-600'
                      }`}>
                        <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">
                            {cat.code}
                          </span>
                          {cat.popular && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold px-1 py-0.2 rounded flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> Hot
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                          {cat.name}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {cat.totalProcedures} thủ tục trực tuyến
                        </p>
                      </div>
                    </div>

                    {/* Checkbox Icon */}
                    <div className="shrink-0 pl-1">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Đã chọn <strong>{tempSelectedIds.size}</strong> trên tổng số <strong>{allAdminCategories.length}</strong> danh mục
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeCustomizerModal}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustomization}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center gap-1.5"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Áp dụng tùy biến ({tempSelectedIds.size})</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
