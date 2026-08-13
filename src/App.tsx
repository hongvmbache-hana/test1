import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_CATEGORIES,
  SAMPLE_PROCEDURES,
  INITIAL_DOSSIERS,
  INITIAL_NOTIFICATIONS
} from './data/mockData';
import { matchSearchQuery } from './utils/searchUtils';
import {
  UserRole,
  ProcedureCategory,
  ProcedureItem,
  Dossier,
  SystemNotification,
  SystemBrandingConfig,
  RealVisitStats
} from './types';
import {
  getStoredBranding,
  saveStoredBranding,
  DEFAULT_BRANDING,
  updateAndGetRealStats
} from './data/brandingData';
import { Header, ThemeMode } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ServiceGrid } from './components/ServiceGrid';
import { ProcedureModal } from './components/ProcedureModal';
import { SubmissionWizardModal } from './components/SubmissionWizardModal';
import { DossierTracker } from './components/DossierTracker';
import { SystemLinkDispatcher } from './components/SystemLinkDispatcher';
import { OfficerWorkspace } from './components/OfficerWorkspace';
import { SecurityPanelModal } from './components/SecurityPanelModal';
import { SupportModal } from './components/SupportModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { FloatingSupportWidgets } from './components/FloatingSupportWidgets';
import { UserGuide } from './components/UserGuide';
import { Footer } from './components/Footer';
import { Bell, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('dvc_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'light'; // Default friendly light mode
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('Tỉnh Quảng Ninh');
  const [activeTab, setActiveTab] = useState<string>('public_services');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Core Data State
  const [categories, setCategories] = useState<ProcedureCategory[]>(INITIAL_CATEGORIES);
  const [procedures, setProcedures] = useState<ProcedureItem[]>(SAMPLE_PROCEDURES);
  const [dossiers, setDossiers] = useState<Dossier[]>(INITIAL_DOSSIERS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // User Public Category Customization State (Stored in localStorage)
  const [isCategoryCustomizerOpen, setIsCategoryCustomizerOpen] = useState<boolean>(false);
  const [userCustomCategoryIds, setUserCustomCategoryIds] = useState<Set<string> | null>(() => {
    try {
      const saved = localStorage.getItem('dvc_user_custom_category_ids');
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const handleSaveUserCustomCategories = (ids: Set<string> | null) => {
    setUserCustomCategoryIds(ids);
    if (ids === null) {
      localStorage.removeItem('dvc_user_custom_category_ids');
      setToastMessage('Đã khôi phục danh mục hiển thị trang chủ về mặc định!');
    } else {
      localStorage.setItem('dvc_user_custom_category_ids', JSON.stringify(Array.from(ids)));
      setToastMessage(`Đã lưu tùy biến hiển thị (${ids.size} danh mục đã chọn)!`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // System Branding & Realtime Visit Statistics State
  const [branding, setBranding] = useState<SystemBrandingConfig>(getStoredBranding);
  const [realStats, setRealStats] = useState<RealVisitStats>(() => updateAndGetRealStats(INITIAL_DOSSIERS.length));

  // Save Branding Handler
  const handleSaveBranding = (newBranding: SystemBrandingConfig) => {
    setBranding(newBranding);
    saveStoredBranding(newBranding);
    setToastMessage('Đã cập nhật giao diện & Logo thành công!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset Branding Handler
  const handleResetBranding = () => {
    setBranding(DEFAULT_BRANDING);
    saveStoredBranding(DEFAULT_BRANDING);
    setToastMessage('Đã khôi phục cài đặt giao diện & Logo mặc định!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals & Drawers
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<ProcedureCategory | null>(null);
  const [selectedInitialProcedureIdModal, setSelectedInitialProcedureIdModal] = useState<string | null>(null);
  const [procedureToSubmit, setProcedureToSubmit] = useState<ProcedureItem | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply dark mode class to <html> with persistent storage & system listener
  useEffect(() => {
    localStorage.setItem('dvc_theme_mode', themeMode);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const isDark =
        themeMode === 'dark' || (themeMode === 'system' && mediaQuery.matches);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    if (themeMode === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [themeMode]);

  const handleToggleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  const handleRefresh = () => {
    setToastMessage('Hệ thống đã đồng bộ trạng thái xử lý hồ sơ thời gian thực mới nhất!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateDossier = (updated: Dossier) => {
    setDossiers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setToastMessage(`Đã cập nhật hồ sơ ${updated.code} thành công!`);
    setTimeout(() => setToastMessage(null), 3000);

    // Create a new notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Cập nhật tiến độ hồ sơ',
      message: `Hồ sơ ${updated.code} đã được chuyển sang trạng thái mới.`,
      type: 'info',
      timestamp: new Date().toLocaleString('vi-VN'),
      read: false,
      dossierCode: updated.code
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddDossierSuccess = (newDossier: Dossier) => {
    setDossiers((prev) => [newDossier, ...prev]);
    setProcedureToSubmit(null);
    setSelectedCategoryModal(null);
    setActiveTab('dossiers'); // Jump to Dossier Tracker!
    setToastMessage(`Đã đẩy hồ sơ trực tuyến ${newDossier.code} thành công qua VNeID!`);
    setTimeout(() => setToastMessage(null), 4000);

    // Add automated notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Nộp hồ sơ trực tuyến thành công',
      message: `Mã hồ sơ ${newDossier.code} đã được gửi đến ${newDossier.department}.`,
      type: 'success',
      timestamp: new Date().toLocaleString('vi-VN'),
      read: false,
      dossierCode: newDossier.code
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddProcedure = (newProc: ProcedureItem) => {
    setProcedures((prev) => [newProc, ...prev]);
    // Also update category totalProcedures count
    setCategories((prev) =>
      prev.map((c) => (c.id === newProc.categoryId ? { ...c, totalProcedures: c.totalProcedures + 1 } : c))
    );
    setToastMessage(`Đã khởi tạo thêm thủ tục hành chính mới "${newProc.title}"!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateProcedure = (updatedProc: ProcedureItem) => {
    setProcedures((prev) => prev.map((p) => (p.id === updatedProc.id ? updatedProc : p)));
    setToastMessage(`Đã cập nhật thủ tục "${updatedProc.title}" thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBatchUpdateProcedures = (updatedList: ProcedureItem[], msg?: string) => {
    setProcedures(updatedList);
    setToastMessage(msg || `Đã cập nhật điều hướng mã tỉnh cho toàn bộ ${updatedList.length} thủ tục!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteProcedure = (procId: string) => {
    const target = procedures.find((p) => p.id === procId);
    setProcedures((prev) => prev.filter((p) => p.id !== procId));
    if (target) {
      setCategories((prev) =>
        prev.map((c) => (c.id === target.categoryId ? { ...c, totalProcedures: Math.max(0, c.totalProcedures - 1) } : c))
      );
    }
    setToastMessage('Đã xóa thủ tục hành chính thành công!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCategory = (newCat: ProcedureCategory) => {
    setCategories((prev) => [newCat, ...prev]);
    setToastMessage(`Đã thêm danh mục thủ tục mới "${newCat.name}"!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateCategory = (updatedCat: ProcedureCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
    // Also update categoryName in procedures
    setProcedures((prev) =>
      prev.map((p) => (p.categoryId === updatedCat.id ? { ...p, categoryName: updatedCat.name } : p))
    );
    setToastMessage(`Đã cập nhật danh mục "${updatedCat.name}" thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBatchUpdateCategories = (updatedCats: ProcedureCategory[], msg?: string) => {
    setCategories(updatedCats);
    const enabledCount = updatedCats.filter(c => c.enabled !== false).length;
    setToastMessage(msg || `Đã cập nhật danh sách hiển thị danh mục thủ tục! (${enabledCount}/${updatedCats.length} danh mục đang hiển thị)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setToastMessage('Đã xóa danh mục thủ tục thành công!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtering Procedures & Categories
  const allAdminCategories = categories.filter((c) => c.enabled !== false);

  // Calculate matching procedures based on search query
  const matchingProcedures = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return procedures.filter((p) => {
      return (
        matchSearchQuery(p.title, searchQuery) ||
        matchSearchQuery(p.code, searchQuery) ||
        matchSearchQuery(p.description, searchQuery) ||
        matchSearchQuery(p.department, searchQuery) ||
        matchSearchQuery(p.categoryName, searchQuery)
      );
    });
  }, [procedures, searchQuery]);

  const filteredCategories = categories.filter((cat) => {
    // Hide disabled categories from citizen portal (configured by admin)
    if (cat.enabled === false) return false;

    // Hide categories deselected by visitor custom settings
    if (userCustomCategoryIds !== null && !userCustomCategoryIds.has(cat.id)) {
      return false;
    }

    if (!searchQuery.trim()) {
      if (selectedFilter === 'popular') return cat.popular;
      return true;
    }

    // Match directly by category name/code OR matching any procedure inside this category
    const matchesCatDirect =
      matchSearchQuery(cat.name, searchQuery) || matchSearchQuery(cat.code, searchQuery);

    const hasMatchingProcedure = matchingProcedures.some((p) => p.categoryId === cat.id);

    const matches = matchesCatDirect || hasMatchingProcedure;

    if (selectedFilter === 'popular') return matches && cat.popular;
    return matches;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'admin' || role === 'officer') {
      setActiveTab('officer_workspace');
    } else if (role === 'citizen') {
      setActiveTab('public_services');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans flex flex-col justify-between`}>
      
      <div>
        {/* Header */}
        <Header
          branding={branding}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          themeMode={themeMode}
          onSetThemeMode={setThemeMode}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleTheme}
          selectedProvince={selectedProvince}
          onSelectProvince={setSelectedProvince}
          onRefresh={handleRefresh}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          onOpenNotificationModal={() => setIsNotificationDrawerOpen(true)}
          unreadNotificationCount={unreadCount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          onOpenCategoryCustomizer={() => {
            setActiveTab('public_services');
            setIsCategoryCustomizerOpen(true);
          }}
        />

        {/* Main Content Area based on Active Tab */}
        <main>
          {/* TAB 1: Public Services Grid */}
          {activeTab === 'public_services' && (
            <div>
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
                totalProceduresCount={filteredCategories.length}
              />
              <ServiceGrid
                categories={filteredCategories}
                allAdminCategories={allAdminCategories}
                userCustomCategoryIds={userCustomCategoryIds}
                onSaveUserCustomCategories={handleSaveUserCustomCategories}
                onSelectCategory={(cat) => {
                  setSelectedCategoryModal(cat);
                  setSelectedInitialProcedureIdModal(null);
                }}
                searchQuery={searchQuery}
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
                isCustomizerOpen={isCategoryCustomizerOpen}
                setIsCustomizerOpen={setIsCategoryCustomizerOpen}
                procedures={procedures}
                matchingProcedures={matchingProcedures}
                onSelectProcedure={(proc, parentCat) => {
                  const cat = parentCat || categories.find((c) => c.id === proc.categoryId) || null;
                  setSelectedCategoryModal(cat);
                  setSelectedInitialProcedureIdModal(proc.id);
                }}
                onClearSearch={() => setSearchQuery('')}
              />
            </div>
          )}

          {/* TAB 2: System Link Dispatcher & External Software Portal */}
          {activeTab === 'dossiers' && (
            <SystemLinkDispatcher />
          )}

          {/* TAB 3: Officer / Admin Processing Panel */}
          {activeTab === 'officer_workspace' && (
            <OfficerWorkspace
              branding={branding}
              onSaveBranding={handleSaveBranding}
              onResetBranding={handleResetBranding}
              realStats={realStats}
              dossiers={dossiers}
              procedures={procedures}
              categories={categories}
              onUpdateDossier={handleUpdateDossier}
              onAddProcedure={handleAddProcedure}
              onUpdateProcedure={handleUpdateProcedure}
              onBatchUpdateProcedures={handleBatchUpdateProcedures}
              onDeleteProcedure={handleDeleteProcedure}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onBatchUpdateCategories={handleBatchUpdateCategories}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {/* TAB 4: User Guide */}
          {activeTab === 'guide' && <UserGuide />}
        </main>
      </div>

      {/* Footer */}
      <Footer
        branding={branding}
        stats={{
          ...realStats,
          totalProcedures: procedures.length,
          totalDossiers: dossiers.length
        }}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Modal 0: Support & Capuchino Coffee Donation Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        branding={branding}
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Modal 1: Category Procedures List Modal */}
      {selectedCategoryModal && (
        <ProcedureModal
          category={selectedCategoryModal}
          procedures={(() => {
            const catProcs = procedures.filter(
              (p) => p.categoryId === selectedCategoryModal.id || p.categoryName === selectedCategoryModal.name
            );
            if (catProcs.length > 0) return catProcs;
            return SAMPLE_PROCEDURES;
          })()}
          onClose={() => {
            setSelectedCategoryModal(null);
            setSelectedInitialProcedureIdModal(null);
          }}
          onStartSubmission={(proc) => {
            setProcedureToSubmit(proc);
            setSelectedCategoryModal(null);
            setSelectedInitialProcedureIdModal(null);
          }}
          initialProcedureId={selectedInitialProcedureIdModal}
        />
      )}

      {/* Modal 2: Step-by-Step Submission Wizard */}
      {procedureToSubmit && (
        <SubmissionWizardModal
          procedure={procedureToSubmit}
          selectedProvince={selectedProvince}
          onClose={() => setProcedureToSubmit(null)}
          onSubmitSuccess={handleAddDossierSuccess}
        />
      )}

      {/* Modal 3: High-Level Security & Audit Log Panel */}
      {isSecurityModalOpen && (
        <SecurityPanelModal onClose={() => setIsSecurityModalOpen(false)} />
      )}

      {/* Drawer 1: AI Assistant */}
      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        branding={branding}
      />

      {/* Floating Support Widgets (Zalo, AI Assistant & Capuchino Coffee buttons) */}
      <FloatingSupportWidgets
        branding={branding}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Drawer 2: Notifications */}
      {isNotificationDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col p-4 animate-slideLeft">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-sm">Thông báo Tự động ({unreadCount})</h3>
            </div>
            <button onClick={() => setIsNotificationDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition ${
                  n.read
                    ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-75'
                    : 'bg-red-50/60 dark:bg-red-950/40 border-red-200 dark:border-red-900 font-semibold'
                }`}
              >
                <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
