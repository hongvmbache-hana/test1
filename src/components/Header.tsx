import React, { useState, useEffect } from 'react';
import {
  Settings,
  RotateCw,
  Moon,
  Sun,
  Monitor,
  ShieldCheck,
  User,
  ChevronDown,
  Lock,
  Search,
  Sparkles,
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';
import { UserRole, SystemNotification, SystemBrandingConfig } from '../types';

export type ThemeMode = 'light' | 'dark' | 'system';

// Official Vietnam Public Administration Emblem Logo (5 hands forming a 5-pointed star)
export const PublicAdminLogo = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Single Hand Unit - 5 of these rotated at 72° intervals form the exact emblem */}
      <g id="hcc-hand">
        {/* Main Red Hand & Arm Body */}
        <path
          d="M 43 8
             C 62 8, 86 19, 93 39
             C 98 52, 92 65, 78 70
             C 70 73, 62 68, 56 61
             L 34 48
             C 28 44, 22 39, 20 33
             C 18 26, 21 20, 27 17
             C 32 14, 38 12, 43 8 Z"
          fill="#B91C1C"
        />
        {/* Inner Gold/Yellow Thumb Accent Fold */}
        <path
          d="M 37 16 L 47 8 L 43 21 Z"
          fill="#FACC15"
        />
        {/* 3 Finger Slits (White cutout lines creating the 4 fingers) */}
        <path
          d="M 28 26 L 56 38
             M 30 31 L 58 43
             M 32 36 L 60 48"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </defs>

    {/* 5 Rotated Hands around center (50, 50) */}
    <use href="#hcc-hand" />
    <use href="#hcc-hand" transform="rotate(72 50 50)" />
    <use href="#hcc-hand" transform="rotate(144 50 50)" />
    <use href="#hcc-hand" transform="rotate(216 50 50)" />
    <use href="#hcc-hand" transform="rotate(288 50 50)" />
  </svg>
);

interface HeaderProps {
  branding?: SystemBrandingConfig;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  selectedProvince: string;
  onSelectProvince: (prov: string) => void;
  onRefresh: () => void;
  onOpenSecurityModal: () => void;
  onOpenNotificationModal: () => void;
  unreadNotificationCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  onOpenCategoryCustomizer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  branding,
  currentRole,
  onRoleChange,
  themeMode,
  onSetThemeMode,
  isDarkMode,
  onToggleDarkMode,
  selectedProvince,
  onSelectProvince,
  onRefresh,
  onOpenSecurityModal,
  onOpenNotificationModal,
  unreadNotificationCount,
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  onOpenCategoryCustomizer
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const provinces = [
    'Tỉnh Quảng Ninh',
    'TP. Hà Nội',
    'TP. Hồ Chí Minh',
    'TP. Đà Nẵng',
    'TP. Hải Phòng',
    'Tỉnh Bắc Ninh',
    'Tỉnh Bình Dương',
    'Tỉnh Lâm Đồng'
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time: HH:mm:ss
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds}`);

      // Format date: THỨ SÁU, 24/07/2026
      const daysOfWeek = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
      const dayName = daysOfWeek[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setDateString(`${dayName}, ${day}/${month}/${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top Bar matching Clean Minimalism design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & System Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center shrink-0 drop-shadow-xs">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Custom System Logo"
                  className="w-11 h-11 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5"
                />
              ) : (
                <PublicAdminLogo className="w-11 h-11" />
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="Hệ thống trực tuyến thời gian thực"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-red-700 dark:text-red-400 uppercase whitespace-nowrap">
                {branding?.headerTitle || 'ĐIỀU PHỐI DVC SIÊU TỐC'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {branding?.headerSubtitle || 'Hệ thống điều phối dịch vụ công & tiếp nhận hồ sơ hành chính công trực tuyến'}
              </p>
            </div>
          </div>

          {/* Time, Province & Quick Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5 text-xs">
            
            {/* Live Clock & Province Selector */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200">
              <div className="text-right">
                <div className="font-mono font-bold text-xs text-red-700 dark:text-red-400 tracking-wider">
                  {timeString || '13:38:30'}
                </div>
                <div className="text-[10px] uppercase font-medium text-slate-400 dark:text-slate-500">
                  {dateString || 'THỨ SÁU, 24/07/2026'}
                </div>
              </div>

              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5"></div>

              {/* Province Picker Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                  className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-red-700 focus:outline-none"
                >
                  <span className="bg-red-700 text-white text-[10px] px-2 py-0.5 rounded-md font-semibold shadow-2xs">
                    📍 {selectedProvince}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProvinceDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                      Chọn Tỉnh / Thành phố
                    </div>
                    {provinces.map((prov) => (
                      <button
                        key={prov}
                        onClick={() => {
                          onSelectProvince(prov);
                          setIsProvinceDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-red-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors ${
                          selectedProvince === prov
                            ? 'font-bold text-red-700 dark:text-red-300 bg-red-50/70 dark:bg-slate-700/60'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {prov}
                        {selectedProvince === prov && <CheckCircle2 className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg font-bold shadow-2xs transition-all"
              title="Trợ lý AI Hỗ trợ kiểm tra hồ sơ"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Trợ lý AI DVC</span>
            </button>

            {/* Configuration / Customizer Button */}
            <button
              onClick={onOpenCategoryCustomizer || onOpenSecurityModal}
              className="flex items-center gap-1 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-slate-700 shadow-2xs transition hover:border-amber-300"
              title="Cửa sổ Tùy biến Danh mục cá nhân"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="inline">Cấu hình</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="flex items-center gap-1 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg font-medium border border-slate-200 dark:border-slate-700 shadow-2xs transition"
              title="Cập nhật trạng thái thời gian thực"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Làm mới</span>
            </button>

            {/* Theme Mode Dropdown Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-slate-700 shadow-2xs transition focus:outline-none"
                title="Tùy chỉnh chế độ giao diện (Sáng / Tối / Theo Hệ thống)"
              >
                {themeMode === 'light' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="hidden sm:inline">Giao diện Sáng</span>
                  </>
                ) : themeMode === 'dark' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="hidden sm:inline">Giao diện Tối</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="hidden sm:inline">Theo Hệ thống</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                    Chế độ giao diện
                  </div>
                  <button
                    onClick={() => {
                      onSetThemeMode('light');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      themeMode === 'light'
                        ? 'bg-amber-50 text-amber-800 dark:bg-slate-700 dark:text-amber-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>☀️ Giao diện Sáng (Thân thiện)</span>
                    </div>
                    {themeMode === 'light' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                  </button>

                  <button
                    onClick={() => {
                      onSetThemeMode('dark');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      themeMode === 'dark'
                        ? 'bg-indigo-50 text-indigo-800 dark:bg-slate-700 dark:text-indigo-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span>🌙 Giao diện Tối (Ban đêm)</span>
                    </div>
                    {themeMode === 'dark' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>

                  <button
                    onClick={() => {
                      onSetThemeMode('system');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      themeMode === 'system'
                        ? 'bg-blue-50 text-blue-800 dark:bg-slate-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-500" />
                      <span>🖥️ Theo Hệ thống (Tự động)</span>
                    </div>
                    {themeMode === 'system' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onRoleChange('citizen')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  currentRole === 'citizen'
                    ? 'bg-red-700 text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Công dân
              </button>
              <button
                onClick={() => onRoleChange('admin')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'admin' || currentRole === 'officer'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3" />
                Cán bộ / Admin
              </button>
            </div>

          </div>
        </div>

        {/* Navigation Bar Tabs */}
        <nav className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between overflow-x-auto no-scrollbar text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('public_services')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'public_services'
                  ? 'bg-red-50 text-red-800 font-extrabold dark:bg-red-950/80 dark:text-red-300 border-b-2 border-red-600'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>📌 Dịch vụ công</span>
            </button>

            <button
              onClick={() => setActiveTab('dossiers')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'dossiers'
                  ? 'bg-red-50 text-red-800 font-extrabold dark:bg-red-950/80 dark:text-red-300 border-b-2 border-red-600'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🌐 Điều phối Link Hệ thống & Phần mềm</span>
            </button>

            {(currentRole === 'admin' || currentRole === 'officer' || activeTab === 'officer_workspace') && (
              <button
                onClick={() => setActiveTab('officer_workspace')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'officer_workspace'
                    ? 'bg-red-50 text-red-800 font-extrabold dark:bg-red-950/80 dark:text-red-300 border-b-2 border-red-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>🛠️ Quản trị Admin (Thủ tục & Danh mục)</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'guide'
                  ? 'bg-red-50 text-red-800 font-extrabold dark:bg-red-950/80 dark:text-red-300 border-b-2 border-red-600'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>📖 Hướng dẫn sử dụng</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md border border-green-200 dark:border-green-800">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>VNeID L2 & AES-256</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
